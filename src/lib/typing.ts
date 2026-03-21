export type TypingMetrics = {
  elapsedMs: number;
  totalChars: number;
  correctChars: number;
  errorCount: number;
  accuracy: number;
  wpm: number;
};

export type StarRating = 0 | 1 | 2 | 3;

export type LevelResult = TypingMetrics & {
  levelSlug: string;
  stars: StarRating;
  passed: boolean;
};

export type UnlockResult = {
  completedLevelSlug: string;
  unlockedLevelSlug: string | null;
  isTrackComplete: boolean;
};

export type LevelTarget = {
  minAccuracy: number;
  bronzeWpm: number;
  silverWpm: number;
  goldWpm: number;
  maxErrors: number;
};

function safeDivision(value: number, total: number) {
  return total === 0 ? 0 : value / total;
}

export function calculateTypingMetrics(
  targetText: string,
  typedText: string,
  elapsedMs: number,
): TypingMetrics {
  const normalizedTarget = targetText.trim();
  const normalizedTyped = typedText.trim();
  const totalChars = normalizedTarget.length;
  let correctChars = 0;
  let errorCount = 0;

  for (let index = 0; index < normalizedTarget.length; index += 1) {
    if (normalizedTyped[index] === normalizedTarget[index]) {
      correctChars += 1;
    } else {
      errorCount += 1;
    }
  }

  if (normalizedTyped.length > normalizedTarget.length) {
    errorCount += normalizedTyped.length - normalizedTarget.length;
  }

  const minutes = elapsedMs > 0 ? elapsedMs / 60000 : 1 / 60;
  const wpm = Number(((correctChars / 5) / minutes).toFixed(1));
  const accuracy = Number(
    (safeDivision(correctChars, Math.max(normalizedTyped.length, totalChars)) * 100).toFixed(1),
  );

  return {
    elapsedMs,
    totalChars,
    correctChars,
    errorCount,
    accuracy,
    wpm,
  };
}

export function calculateStars(metrics: TypingMetrics, target: LevelTarget): StarRating {
  if (metrics.accuracy < target.minAccuracy || metrics.errorCount > target.maxErrors) {
    return 0;
  }

  if (metrics.wpm >= target.goldWpm) {
    return 3;
  }

  if (metrics.wpm >= target.silverWpm) {
    return 2;
  }

  if (metrics.wpm >= target.bronzeWpm) {
    return 1;
  }

  return 0;
}

export function buildLevelResult(
  levelSlug: string,
  targetText: string,
  typedText: string,
  elapsedMs: number,
  levelTarget: LevelTarget,
): LevelResult {
  const metrics = calculateTypingMetrics(targetText, typedText, elapsedMs);
  const stars = calculateStars(metrics, levelTarget);

  return {
    levelSlug,
    stars,
    passed: stars > 0,
    ...metrics,
  };
}

export function resolveUnlock(levelSlugs: string[], currentSlug: string): UnlockResult {
  const currentIndex = levelSlugs.indexOf(currentSlug);
  const unlockedLevelSlug =
    currentIndex >= 0 && currentIndex < levelSlugs.length - 1 ? levelSlugs[currentIndex + 1] : null;

  return {
    completedLevelSlug: currentSlug,
    unlockedLevelSlug,
    isTrackComplete: unlockedLevelSlug === null,
  };
}

