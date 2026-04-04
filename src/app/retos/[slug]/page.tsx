import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TypingGame } from "@/components/typing-game";
import { getCachedSession } from "@/lib/auth";
import { getAttemptsForUserByLevel, getLevelBySlug, getTracksWithLevels } from "@/lib/data";

export default async function LevelPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, session] = await Promise.all([params, getCachedSession()]);
  const level = await getLevelBySlug(slug);

  if (!level) {
    notFound();
  }

  const [history, tracks] = await Promise.all([
    session?.user?.id ? getAttemptsForUserByLevel(session.user.id, level.id) : Promise.resolve([]),
    getTracksWithLevels(),
  ]);

  const allLevels = tracks.flatMap((t) => t.levels);
  const currentIndex = allLevels.findIndex((l) => l.id === level.id);
  const nextLevelSlug = allLevels[currentIndex + 1]?.slug;

  return (
    <div className="flex min-h-screen flex-col bg-[#e0e7ff]/30">
      <TypingGame
        levelSlug={level.slug}
        title={level.title}
        description={level.description}
        targetText={level.body}
        target={{
          minAccuracy: level.minAccuracy,
          bronzeWpm: level.bronzeWpm,
          silverWpm: level.silverWpm,
          goldWpm: level.goldWpm,
          maxErrors: level.maxErrors,
        }}
        isAuthenticated={Boolean(session?.user)}
        userName={session?.user?.name ?? session?.user?.email ?? "Invitado"}
        history={history}
        nextLevelSlug={nextLevelSlug}
      />
    </div>
  );
}
