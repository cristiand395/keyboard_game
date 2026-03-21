import { eq } from "drizzle-orm";
import { db, pool } from "@/db";
import { levelTargets, levels, tracks } from "@/db/schema";
import { levelSeeds, trackSeeds } from "@/db/seed-data";

async function main() {
  for (const trackSeed of trackSeeds) {
    await db
      .insert(tracks)
      .values(trackSeed)
      .onConflictDoUpdate({
        target: tracks.slug,
        set: {
          title: trackSeed.title,
          description: trackSeed.description,
        },
      });
  }

  for (const levelSeed of levelSeeds) {
    const [track] = await db.select().from(tracks).where(eq(tracks.slug, levelSeed.trackSlug));

    if (!track) {
      throw new Error(`Track ${levelSeed.trackSlug} not found`);
    }

    const [level] = await db
      .insert(levels)
      .values({
        trackId: track.id,
        slug: levelSeed.slug,
        order: levelSeed.order,
        title: levelSeed.title,
        description: levelSeed.description,
        body: levelSeed.body,
        isPublished: true,
      })
      .onConflictDoUpdate({
        target: levels.slug,
        set: {
          order: levelSeed.order,
          title: levelSeed.title,
          description: levelSeed.description,
          body: levelSeed.body,
          isPublished: true,
        },
      })
      .returning({ id: levels.id });

    await db
      .insert(levelTargets)
      .values({
        levelId: level.id,
        minAccuracy: levelSeed.minAccuracy,
        bronzeWpm: levelSeed.bronzeWpm,
        silverWpm: levelSeed.silverWpm,
        goldWpm: levelSeed.goldWpm,
        maxErrors: levelSeed.maxErrors,
      })
      .onConflictDoUpdate({
        target: levelTargets.levelId,
        set: {
          minAccuracy: levelSeed.minAccuracy,
          bronzeWpm: levelSeed.bronzeWpm,
          silverWpm: levelSeed.silverWpm,
          goldWpm: levelSeed.goldWpm,
          maxErrors: levelSeed.maxErrors,
        },
      });
  }

  await pool.end();
}

main().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});

