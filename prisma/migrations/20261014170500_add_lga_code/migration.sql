ALTER TABLE "lgas" ADD COLUMN "code" TEXT;

UPDATE "lgas"
SET "code" = 'LGA-' || upper(substr(md5(random()::text || "id"), 1, 6))
WHERE "code" IS NULL;

ALTER TABLE "lgas" ALTER COLUMN "code" SET NOT NULL;

CREATE UNIQUE INDEX "lgas_code_key" ON "lgas"("code");
