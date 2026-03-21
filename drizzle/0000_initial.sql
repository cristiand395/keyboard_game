CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(120),
  "email" varchar(255) NOT NULL UNIQUE,
  "email_verified" timestamptz,
  "image" text,
  "password_hash" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "accounts" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "type" varchar(50) NOT NULL,
  "provider" varchar(50) NOT NULL,
  "provider_account_id" varchar(255) NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" varchar(50),
  "scope" varchar(255),
  "id_token" text,
  "session_state" varchar(255),
  PRIMARY KEY ("provider", "provider_account_id")
);

CREATE TABLE "sessions" (
  "session_token" varchar(255) PRIMARY KEY,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "expires" timestamptz NOT NULL
);

CREATE TABLE "verification_tokens" (
  "identifier" varchar(255) NOT NULL,
  "token" varchar(255) NOT NULL,
  "expires" timestamptz NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

CREATE TABLE "tracks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" varchar(120) NOT NULL UNIQUE,
  "title" varchar(120) NOT NULL,
  "description" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "levels" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "track_id" uuid NOT NULL REFERENCES "tracks"("id") ON DELETE cascade,
  "slug" varchar(120) NOT NULL UNIQUE,
  "order" integer NOT NULL,
  "title" varchar(120) NOT NULL,
  "description" text NOT NULL,
  "body" text NOT NULL,
  "is_published" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "levels_track_order_unique" ON "levels" ("track_id", "order");

CREATE TABLE "level_targets" (
  "level_id" uuid PRIMARY KEY REFERENCES "levels"("id") ON DELETE cascade,
  "min_accuracy" real NOT NULL,
  "bronze_wpm" real NOT NULL,
  "silver_wpm" real NOT NULL,
  "gold_wpm" real NOT NULL,
  "max_errors" integer NOT NULL
);

CREATE TABLE "attempts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid REFERENCES "users"("id") ON DELETE cascade,
  "level_id" uuid NOT NULL REFERENCES "levels"("id") ON DELETE cascade,
  "target_text" text NOT NULL,
  "typed_text" text NOT NULL,
  "elapsed_ms" integer NOT NULL,
  "total_chars" integer NOT NULL,
  "correct_chars" integer NOT NULL,
  "error_count" integer NOT NULL,
  "accuracy" real NOT NULL,
  "wpm" real NOT NULL,
  "stars" integer NOT NULL,
  "passed" boolean NOT NULL,
  "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "attempts_user_level_idx" ON "attempts" ("user_id", "level_id");

CREATE TABLE "user_level_progress" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "level_id" uuid NOT NULL REFERENCES "levels"("id") ON DELETE cascade,
  "best_attempt_id" uuid REFERENCES "attempts"("id") ON DELETE set null,
  "best_wpm" real NOT NULL DEFAULT 0,
  "best_accuracy" real NOT NULL DEFAULT 0,
  "best_stars" integer NOT NULL DEFAULT 0,
  "completed_at" timestamptz,
  "unlocked_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "level_id")
);

CREATE TABLE "user_stats_daily" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "day" date NOT NULL,
  "attempts_count" integer NOT NULL DEFAULT 0,
  "total_practice_ms" integer NOT NULL DEFAULT 0,
  "avg_accuracy" real NOT NULL DEFAULT 0,
  "avg_wpm" real NOT NULL DEFAULT 0,
  "best_wpm" real NOT NULL DEFAULT 0,
  PRIMARY KEY ("user_id", "day")
);

