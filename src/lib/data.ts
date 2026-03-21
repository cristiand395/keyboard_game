import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { attempts, levels, levelTargets, tracks, userLevelProgress } from "@/db/schema";
import { tutorials } from "@/lib/content";

export const getTracksWithLevels = cache(async () => {
  const rows = await db
    .select({
      trackId: tracks.id,
      trackSlug: tracks.slug,
      trackTitle: tracks.title,
      trackDescription: tracks.description,
      levelId: levels.id,
      levelSlug: levels.slug,
      levelOrder: levels.order,
      levelTitle: levels.title,
      levelDescription: levels.description,
      body: levels.body,
      minAccuracy: levelTargets.minAccuracy,
      bronzeWpm: levelTargets.bronzeWpm,
      silverWpm: levelTargets.silverWpm,
      goldWpm: levelTargets.goldWpm,
      maxErrors: levelTargets.maxErrors,
    })
    .from(tracks)
    .innerJoin(levels, eq(levels.trackId, tracks.id))
    .innerJoin(levelTargets, eq(levelTargets.levelId, levels.id))
    .where(eq(levels.isPublished, true))
    .orderBy(asc(tracks.createdAt), asc(levels.order));

  return rows.reduce<
    Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      levels: Array<{
        id: string;
        slug: string;
        order: number;
        title: string;
        description: string;
        body: string;
        target: {
          minAccuracy: number;
          bronzeWpm: number;
          silverWpm: number;
          goldWpm: number;
          maxErrors: number;
        };
      }>;
    }>
  >((accumulator, row) => {
    const existingTrack = accumulator.find((track) => track.id === row.trackId);
    const nextLevel = {
      id: row.levelId,
      slug: row.levelSlug,
      order: row.levelOrder,
      title: row.levelTitle,
      description: row.levelDescription,
      body: row.body,
      target: {
        minAccuracy: row.minAccuracy,
        bronzeWpm: row.bronzeWpm,
        silverWpm: row.silverWpm,
        goldWpm: row.goldWpm,
        maxErrors: row.maxErrors,
      },
    };

    if (existingTrack) {
      existingTrack.levels.push(nextLevel);
      return accumulator;
    }

    accumulator.push({
      id: row.trackId,
      slug: row.trackSlug,
      title: row.trackTitle,
      description: row.trackDescription,
      levels: [nextLevel],
    });

    return accumulator;
  }, []);
});

export const getLevelBySlug = cache(async (slug: string) => {
  const [level] = await db
    .select({
      id: levels.id,
      slug: levels.slug,
      order: levels.order,
      title: levels.title,
      description: levels.description,
      body: levels.body,
      trackSlug: tracks.slug,
      trackTitle: tracks.title,
      minAccuracy: levelTargets.minAccuracy,
      bronzeWpm: levelTargets.bronzeWpm,
      silverWpm: levelTargets.silverWpm,
      goldWpm: levelTargets.goldWpm,
      maxErrors: levelTargets.maxErrors,
    })
    .from(levels)
    .innerJoin(tracks, eq(tracks.id, levels.trackId))
    .innerJoin(levelTargets, eq(levelTargets.levelId, levels.id))
    .where(and(eq(levels.slug, slug), eq(levels.isPublished, true)));

  return level ?? null;
});

export async function getProgressForUser(userId: string) {
  return db
    .select({
      levelSlug: levels.slug,
      title: levels.title,
      order: levels.order,
      bestWpm: userLevelProgress.bestWpm,
      bestAccuracy: userLevelProgress.bestAccuracy,
      bestStars: userLevelProgress.bestStars,
      completedAt: userLevelProgress.completedAt,
    })
    .from(userLevelProgress)
    .innerJoin(levels, eq(levels.id, userLevelProgress.levelId))
    .where(eq(userLevelProgress.userId, userId))
    .orderBy(asc(levels.order));
}

export async function getDashboardSummary(userId: string) {
  const [summary] = await db
    .select({
      completedLevels: count(userLevelProgress.levelId),
      totalStars: sql<number>`coalesce(sum(${userLevelProgress.bestStars}), 0)`,
      bestWpm: sql<number>`coalesce(max(${userLevelProgress.bestWpm}), 0)`,
      bestAccuracy: sql<number>`coalesce(max(${userLevelProgress.bestAccuracy}), 0)`,
    })
    .from(userLevelProgress)
    .where(eq(userLevelProgress.userId, userId));

  const [latestAttempt] = await db
    .select({
      wpm: attempts.wpm,
      accuracy: attempts.accuracy,
      createdAt: attempts.createdAt,
    })
    .from(attempts)
    .where(eq(attempts.userId, userId))
    .orderBy(desc(attempts.createdAt))
    .limit(1);

  return {
    completedLevels: Number(summary?.completedLevels ?? 0),
    totalStars: Number(summary?.totalStars ?? 0),
    bestWpm: Number(summary?.bestWpm ?? 0),
    bestAccuracy: Number(summary?.bestAccuracy ?? 0),
    latestAttempt,
  };
}

export function getTutorialBySlug(slug: string) {
  return tutorials.find((tutorial) => tutorial.slug === slug) ?? null;
}

export function getAllTutorials() {
  return tutorials;
}

