"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { attempts, levels, userLevelProgress, userStatsDaily, users } from "@/db/schema";
import { auth, hashPassword, signIn } from "@/lib/auth";
import { buildLevelResult, resolveUnlock } from "@/lib/typing";
import { getTracksWithLevels } from "@/lib/data";

type ActionState = {
  ok: boolean;
  message?: string;
};

export async function registerUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password || password.length < 8) {
    return { ok: false, message: "Introduce un email valido y una clave de al menos 8 caracteres." };
  }

  const existingUser = await db.select().from(users).where(eq(users.email, email));

  if (existingUser.length > 0) {
    return { ok: false, message: "Ya existe una cuenta con este email." };
  }

  await db.insert(users).values({
    name,
    email,
    passwordHash: hashPassword(password),
  });

  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  revalidatePath("/progreso");
  return { ok: true, message: "Cuenta creada. Ya puedes guardar tu progreso." };
}

export async function loginUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    return { ok: false, message: "No se pudo iniciar sesion. Revisa tus datos." };
  }

  revalidatePath("/progreso");
  return { ok: true, message: "Sesion iniciada correctamente." };
}

type SaveAttemptInput = {
  levelSlug: string;
  typedText: string;
  elapsedMs: number;
};

export async function saveAttemptAction(input: SaveAttemptInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: true,
      persisted: false,
      message: "Resultado calculado en local. Registra tu cuenta para guardarlo.",
    };
  }

  const trackList = await getTracksWithLevels();
  const flatLevels = trackList.flatMap((track) => track.levels);
  const currentLevel = flatLevels.find((level) => level.slug === input.levelSlug);

  if (!currentLevel) {
    return { ok: false, persisted: false, message: "Nivel no encontrado." };
  }

  const result = buildLevelResult(
    currentLevel.slug,
    currentLevel.body,
    input.typedText,
    input.elapsedMs,
    currentLevel.target,
  );

  const [dbLevel] = await db.select().from(levels).where(eq(levels.slug, input.levelSlug));

  if (!dbLevel) {
    return { ok: false, persisted: false, message: "Nivel no disponible." };
  }

  const [attemptRow] = await db
    .insert(attempts)
    .values({
      userId: session.user.id,
      levelId: dbLevel.id,
      targetText: currentLevel.body,
      typedText: input.typedText,
      elapsedMs: result.elapsedMs,
      totalChars: result.totalChars,
      correctChars: result.correctChars,
      errorCount: result.errorCount,
      accuracy: result.accuracy,
      wpm: result.wpm,
      stars: result.stars,
      passed: result.passed,
      metadata: { source: "game-client" },
    })
    .returning({ id: attempts.id });

  const [existingProgress] = await db
    .select()
    .from(userLevelProgress)
    .where(and(eq(userLevelProgress.userId, session.user.id), eq(userLevelProgress.levelId, dbLevel.id)));

  const nextBestStars = Math.max(existingProgress?.bestStars ?? 0, result.stars);
  const nextBestWpm = Math.max(existingProgress?.bestWpm ?? 0, result.wpm);
  const nextBestAccuracy = Math.max(existingProgress?.bestAccuracy ?? 0, result.accuracy);

  await db
    .insert(userLevelProgress)
    .values({
      userId: session.user.id,
      levelId: dbLevel.id,
      bestAttemptId: attemptRow.id,
      bestStars: nextBestStars,
      bestWpm: nextBestWpm,
      bestAccuracy: nextBestAccuracy,
      completedAt: result.passed ? new Date() : existingProgress?.completedAt ?? null,
    })
    .onConflictDoUpdate({
      target: [userLevelProgress.userId, userLevelProgress.levelId],
      set: {
        bestAttemptId: attemptRow.id,
        bestStars: nextBestStars,
        bestWpm: nextBestWpm,
        bestAccuracy: nextBestAccuracy,
        completedAt: result.passed ? new Date() : existingProgress?.completedAt ?? null,
        updatedAt: new Date(),
      },
    });

  if (result.passed) {
    const levelSlugs = flatLevels
      .filter((level) => level.order >= 1)
      .map((level) => level.slug);
    const unlock = resolveUnlock(levelSlugs, currentLevel.slug);

    if (unlock.unlockedLevelSlug) {
      const [nextLevel] = await db.select().from(levels).where(eq(levels.slug, unlock.unlockedLevelSlug));
      if (nextLevel) {
        await db
          .insert(userLevelProgress)
          .values({
            userId: session.user.id,
            levelId: nextLevel.id,
          })
          .onConflictDoNothing();
      }
    }
  }

  const currentDay = new Date().toISOString().slice(0, 10);
  await db
    .insert(userStatsDaily)
    .values({
      userId: session.user.id,
      day: currentDay,
      attemptsCount: 1,
      totalPracticeMs: result.elapsedMs,
      avgAccuracy: result.accuracy,
      avgWpm: result.wpm,
      bestWpm: result.wpm,
    })
    .onConflictDoUpdate({
      target: [userStatsDaily.userId, userStatsDaily.day],
      set: {
        attemptsCount: sql`${userStatsDaily.attemptsCount} + 1`,
        totalPracticeMs: sql`${userStatsDaily.totalPracticeMs} + ${result.elapsedMs}`,
        avgAccuracy: result.accuracy,
        avgWpm: result.wpm,
        bestWpm: sql`greatest(${userStatsDaily.bestWpm}, ${result.wpm})`,
      },
    });

  revalidatePath("/progreso");
  revalidatePath("/jugar");
  revalidatePath(`/jugar/${input.levelSlug}`);

  return {
    ok: true,
    persisted: true,
    result,
    message: result.passed ? "Resultado guardado y progreso actualizado." : "Resultado guardado. Sigue practicando.",
  };
}
