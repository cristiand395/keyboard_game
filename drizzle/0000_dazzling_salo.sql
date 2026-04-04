CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
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
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"level_id" uuid NOT NULL,
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
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "level_targets" (
	"level_id" uuid PRIMARY KEY NOT NULL,
	"min_accuracy" real NOT NULL,
	"bronze_wpm" real NOT NULL,
	"silver_wpm" real NOT NULL,
	"gold_wpm" real NOT NULL,
	"max_errors" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"track_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"order" integer NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"body" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "levels_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tracks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_level_progress" (
	"user_id" uuid NOT NULL,
	"level_id" uuid NOT NULL,
	"best_attempt_id" uuid,
	"best_wpm" real DEFAULT 0 NOT NULL,
	"best_accuracy" real DEFAULT 0 NOT NULL,
	"best_stars" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"unlocked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_level_progress_user_id_level_id_pk" PRIMARY KEY("user_id","level_id")
);
--> statement-breakpoint
CREATE TABLE "user_stats_daily" (
	"user_id" uuid NOT NULL,
	"day" date NOT NULL,
	"attempts_count" integer DEFAULT 0 NOT NULL,
	"total_practice_ms" integer DEFAULT 0 NOT NULL,
	"avg_accuracy" real DEFAULT 0 NOT NULL,
	"avg_wpm" real DEFAULT 0 NOT NULL,
	"best_wpm" real DEFAULT 0 NOT NULL,
	CONSTRAINT "user_stats_daily_user_id_day_pk" PRIMARY KEY("user_id","day")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone,
	"image" text,
	"password_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_targets" ADD CONSTRAINT "level_targets_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "levels" ADD CONSTRAINT "levels_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_level_progress" ADD CONSTRAINT "user_level_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_level_progress" ADD CONSTRAINT "user_level_progress_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_level_progress" ADD CONSTRAINT "user_level_progress_best_attempt_id_attempts_id_fk" FOREIGN KEY ("best_attempt_id") REFERENCES "public"."attempts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats_daily" ADD CONSTRAINT "user_stats_daily_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attempts_user_level_idx" ON "attempts" USING btree ("user_id","level_id");--> statement-breakpoint
CREATE UNIQUE INDEX "levels_track_order_unique" ON "levels" USING btree ("track_id","order");