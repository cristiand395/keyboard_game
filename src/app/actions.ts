"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { attempts, levels, userLevelProgress, userStatsDaily, users, verificationTokens } from "@/db/schema";
import { auth, hashPassword, signIn } from "@/lib/auth";
import { buildLevelResult, resolveUnlock } from "@/lib/typing";
import { getTracksWithLevels } from "@/lib/data";
import { sendVerificationEmail } from "@/lib/emails";

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

  const [existingUser] = await db.select().from(users).where(eq(users.email, email));

  if (existingUser) {
    return { ok: false, message: "Ya existe una cuenta con este email." };
  }

  await db.insert(users).values({
    name,
    email,
    passwordHash: hashPassword(password),
  });

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.insert(verificationTokens).values({
    identifier: email,
    token,
    expires,
  });

  const emailRes = await sendVerificationEmail(email, name, token);

  if (!emailRes.success) {
    return { ok: false, message: "Cuenta creada, pero hubo un error enviando el correo de verificacion. Contacta con soporte." };
  }

  return { ok: true, message: "Cuenta casi lista. Revisa tu correo para verificar tu cuenta antes de entrar." };
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
    revalidatePath("/progreso");
    // No devolvemos nada, redirigimos directamente
  } catch (error) {
    if (error instanceof Error && error.message.includes("EMAIL_NOT_VERIFIED")) {
      return { ok: false, message: "Tu correo no ha sido verificado. Revisa tu bandeja de entrada." };
    }
    return { ok: false, message: "Credenciales invalidas." };
  }
  
  redirect("/progreso");
}

export async function verifyEmailAction(token: string): Promise<ActionState> {
  const [dbToken] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token));

  if (!dbToken || dbToken.expires < new Date()) {
    return { ok: false, message: "El enlace ha caducado o es invalido." };
  }

  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, dbToken.identifier));

  await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

  return { ok: true, message: "¡Cuenta verificada! Ya puedes iniciar sesion." };
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
    const currentTrack = trackList.find((t) => t.levels.some((l) => l.slug === input.levelSlug));
    const trackLevelSlugs = currentTrack?.levels.map((l) => l.slug) ?? [];
    const unlock = resolveUnlock(trackLevelSlugs, currentLevel.slug);

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
  revalidatePath("/retos");
  revalidatePath(`/retos/${input.levelSlug}`);

  return {
    ok: true,
    persisted: true,
    result,
    message: result.passed ? "Resultado guardado y progreso actualizado." : "Resultado guardado. Sigue practicando.",
  };
}

export async function updateUserNameAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, message: "No autorizado." };
  }

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { ok: false, message: "El nombre no puede estar vacío." };
  }

  await db.update(users).set({ name }).where(eq(users.id, session.user.id));

  revalidatePath("/");
  revalidatePath("/progreso");
  revalidatePath("/retos");

  return { ok: true, message: "Nombre actualizado correctamente." };
}
