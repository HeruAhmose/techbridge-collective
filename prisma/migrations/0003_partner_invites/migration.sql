-- Partner invites: allow admins to invite partner users by email before they sign in.

CREATE TABLE IF NOT EXISTS "PartnerInvite" (
  "id" TEXT NOT NULL,
  "partnerOrgId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "consumedAt" TIMESTAMP(3),
  "consumedByUserId" TEXT,
  CONSTRAINT "PartnerInvite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerInvite_partnerOrgId_email_key"
ON "PartnerInvite"("partnerOrgId", "email");

CREATE INDEX IF NOT EXISTS "PartnerInvite_email_idx" ON "PartnerInvite"("email");
CREATE INDEX IF NOT EXISTS "PartnerInvite_partnerOrgId_idx" ON "PartnerInvite"("partnerOrgId");
CREATE INDEX IF NOT EXISTS "PartnerInvite_consumedAt_idx" ON "PartnerInvite"("consumedAt");

DO $$ BEGIN
  ALTER TABLE "PartnerInvite"
    ADD CONSTRAINT "PartnerInvite_partnerOrgId_fkey"
    FOREIGN KEY ("partnerOrgId") REFERENCES "PartnerOrganization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
