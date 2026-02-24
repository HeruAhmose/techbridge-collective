-- Partner multi-tenant support (organizations + memberships) + PARTNER role.
-- Safe, idempotent-ish SQL for Postgres.

DO $$ BEGIN
  ALTER TYPE "UserRole" ADD VALUE 'PARTNER';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "PartnerOrganization" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PartnerOrganization_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerOrganization_name_key" ON "PartnerOrganization"("name");

CREATE TABLE IF NOT EXISTS "PartnerMembership" (
  "id" TEXT NOT NULL,
  "partnerOrgId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PartnerMembership_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerMembership_partnerOrgId_userId_key"
ON "PartnerMembership"("partnerOrgId", "userId");

CREATE INDEX IF NOT EXISTS "PartnerMembership_userId_idx" ON "PartnerMembership"("userId");
CREATE INDEX IF NOT EXISTS "PartnerMembership_partnerOrgId_idx" ON "PartnerMembership"("partnerOrgId");

ALTER TABLE "HubLocation"
  ADD COLUMN IF NOT EXISTS "partnerOrgId" TEXT;

CREATE INDEX IF NOT EXISTS "HubLocation_partnerOrgId_idx" ON "HubLocation"("partnerOrgId");

DO $$ BEGIN
  ALTER TABLE "HubLocation"
    ADD CONSTRAINT "HubLocation_partnerOrgId_fkey"
    FOREIGN KEY ("partnerOrgId") REFERENCES "PartnerOrganization"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "PartnerMembership"
    ADD CONSTRAINT "PartnerMembership_partnerOrgId_fkey"
    FOREIGN KEY ("partnerOrgId") REFERENCES "PartnerOrganization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "PartnerMembership"
    ADD CONSTRAINT "PartnerMembership_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
