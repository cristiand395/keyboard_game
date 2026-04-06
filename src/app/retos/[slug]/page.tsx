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
    <div className="flex grow flex-col bg-background relative overflow-hidden">
      {/* Background kinetic effect */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
      
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
        userName={session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Invitado"}
        history={history}
        nextLevelSlug={nextLevelSlug}
      />
    </div>
  );
}
