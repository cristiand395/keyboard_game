import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 50 }),
    scope: varchar("scope", { length: 255 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 255 }),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.identifier, table.token],
    }),
  }),
);

export const tracks = pgTable(
  "tracks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    title: varchar("title", { length: 120 }).notNull(),
    description: text("description").notNull(),
    order: integer("order").notNull(),
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIndex: uniqueIndex("tracks_order_unique").on(table.order),
  }),
);

export const levels = pgTable(
  "levels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    order: integer("order").notNull(),
    title: varchar("title", { length: 120 }).notNull(),
    description: text("description").notNull(),
    body: text("body").notNull(),
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIndex: uniqueIndex("levels_track_order_unique").on(table.trackId, table.order),
  }),
);

export const levelTargets = pgTable("level_targets", {
  levelId: uuid("level_id")
    .primaryKey()
    .references(() => levels.id, { onDelete: "cascade" }),
  minAccuracy: real("min_accuracy").notNull(),
  bronzeWpm: real("bronze_wpm").notNull(),
  silverWpm: real("silver_wpm").notNull(),
  goldWpm: real("gold_wpm").notNull(),
  maxErrors: integer("max_errors").notNull(),
});

export const attempts = pgTable(
  "attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    levelId: uuid("level_id")
      .notNull()
      .references(() => levels.id, { onDelete: "cascade" }),
    targetText: text("target_text").notNull(),
    typedText: text("typed_text").notNull(),
    elapsedMs: integer("elapsed_ms").notNull(),
    totalChars: integer("total_chars").notNull(),
    correctChars: integer("correct_chars").notNull(),
    errorCount: integer("error_count").notNull(),
    accuracy: real("accuracy").notNull(),
    wpm: real("wpm").notNull(),
    stars: integer("stars").notNull(),
    passed: boolean("passed").notNull(),
    metadata: jsonb("metadata").default(sql`'{}'::jsonb`).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userLevelIndex: index("attempts_user_level_idx").on(table.userId, table.levelId),
  }),
);

export const userLevelProgress = pgTable(
  "user_level_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    levelId: uuid("level_id")
      .notNull()
      .references(() => levels.id, { onDelete: "cascade" }),
    bestAttemptId: uuid("best_attempt_id").references(() => attempts.id, {
      onDelete: "set null",
    }),
    bestWpm: real("best_wpm").notNull().default(0),
    bestAccuracy: real("best_accuracy").notNull().default(0),
    bestStars: integer("best_stars").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.levelId] }),
  }),
);

export const userStatsDaily = pgTable(
  "user_stats_daily",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    day: date("day").notNull(),
    attemptsCount: integer("attempts_count").notNull().default(0),
    totalPracticeMs: integer("total_practice_ms").notNull().default(0),
    avgAccuracy: real("avg_accuracy").notNull().default(0),
    avgWpm: real("avg_wpm").notNull().default(0),
    bestWpm: real("best_wpm").notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.day] }),
  }),
);

export const trackRelations = relations(tracks, ({ many }) => ({
  levels: many(levels),
}));

export const levelRelations = relations(levels, ({ one, many }) => ({
  track: one(tracks, {
    fields: [levels.trackId],
    references: [tracks.id],
  }),
  target: one(levelTargets, {
    fields: [levels.id],
    references: [levelTargets.levelId],
  }),
  attempts: many(attempts),
}));

export const attemptRelations = relations(attempts, ({ one }) => ({
  user: one(users, {
    fields: [attempts.userId],
    references: [users.id],
  }),
  level: one(levels, {
    fields: [attempts.levelId],
    references: [levels.id],
  }),
}));

