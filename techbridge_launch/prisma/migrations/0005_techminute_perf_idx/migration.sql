-- Performance index for partner exports and dashboard queries.

CREATE INDEX IF NOT EXISTS "TechMinute_hubLocationId_createdAt_idx"
ON "TechMinute"("hubLocationId", "createdAt");
