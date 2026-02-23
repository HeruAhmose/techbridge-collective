-- Schema correction: ResidentRequest and PartnerRequest had @@index([startedAt])
-- declared in schema.prisma but those models have no startedAt field.
-- This migration is a no-op at the DB level (those indexes were never created)
-- but documents the schema correction for audit purposes.

-- No SQL needed — the bogus indexes were in schema.prisma only, not in any prior migration.
-- prisma migrate deploy will apply this as an empty migration and move on.
SELECT 1;
