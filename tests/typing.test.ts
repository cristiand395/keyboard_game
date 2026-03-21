import { describe, expect, it } from "vitest";
import {
  buildLevelResult,
  calculateStars,
  calculateTypingMetrics,
  resolveUnlock,
} from "@/lib/typing";

describe("typing domain", () => {
  it("calculates metrics with errors", () => {
    const metrics = calculateTypingMetrics("hola mundo", "hola murdo", 30000);

    expect(metrics.correctChars).toBeGreaterThan(0);
    expect(metrics.errorCount).toBe(1);
    expect(metrics.wpm).toBeGreaterThan(0);
  });

  it("assigns three stars when metrics exceed gold target", () => {
    const stars = calculateStars(
      {
        elapsedMs: 15000,
        totalChars: 30,
        correctChars: 30,
        errorCount: 0,
        accuracy: 100,
        wpm: 50,
      },
      {
        minAccuracy: 95,
        bronzeWpm: 20,
        silverWpm: 30,
        goldWpm: 40,
        maxErrors: 3,
      },
    );

    expect(stars).toBe(3);
  });

  it("builds a passing level result", () => {
    const result = buildLevelResult(
      "fila-guia-1",
      "asdf asdf",
      "asdf asdf",
      10000,
      {
        minAccuracy: 90,
        bronzeWpm: 10,
        silverWpm: 20,
        goldWpm: 30,
        maxErrors: 2,
      },
    );

    expect(result.passed).toBe(true);
    expect(result.stars).toBeGreaterThanOrEqual(1);
  });

  it("resolves next unlocked level", () => {
    const unlock = resolveUnlock(["one", "two", "three"], "two");

    expect(unlock.unlockedLevelSlug).toBe("three");
    expect(unlock.isTrackComplete).toBe(false);
  });
});
