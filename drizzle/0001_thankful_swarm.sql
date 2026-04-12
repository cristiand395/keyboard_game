ALTER TABLE "tracks" ADD COLUMN "order" integer;--> statement-breakpoint
UPDATE "tracks" SET "order" = 1 WHERE "slug" = 'fundamentos';--> statement-breakpoint
ALTER TABLE "tracks" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "tracks_order_unique" ON "tracks" USING btree ("order");