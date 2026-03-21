import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TypingGame } from "@/components/typing-game";
import { getCachedSession } from "@/lib/auth";
import { getLevelBySlug } from "@/lib/data";

export default async function LevelPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, session] = await Promise.all([params, getCachedSession()]);
  const level = await getLevelBySlug(slug);

  if (!level) {
    notFound();
  }

  return (
    <main className="shell space-y-6 pb-16">
      <div className="space-y-3">
        <Badge>{level.trackTitle}</Badge>
        <h1 className="text-4xl font-bold tracking-tight">{level.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{level.description}</p>
      </div>
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
      />
    </main>
  );
}

