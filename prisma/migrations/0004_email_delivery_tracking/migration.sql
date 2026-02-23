-- Email delivery tracking for partner invites (message id, status, retries) + webhook event storage.

DO $$ BEGIN
  CREATE TYPE "InviteEmailStatus" AS ENUM ('NOT_SENT', 'SENT', 'DELIVERED', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "PartnerInvite"
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill updatedAt for existing rows (safe no-op if already set by default)
UPDATE "PartnerInvite" SET "updatedAt" = COALESCE("updatedAt", CURRENT_TIMESTAMP);

ALTER TABLE "PartnerInvite"
  ADD COLUMN IF NOT EXISTS "emailStatus" "InviteEmailStatus" NOT NULL DEFAULT 'NOT_SENT',
  ADD COLUMN IF NOT EXISTS "emailProvider" TEXT,
  ADD COLUMN IF NOT EXISTS "emailMessageId" TEXT,
  ADD COLUMN IF NOT EXISTS "emailAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "emailLastAttemptAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "emailDeliveredAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "emailLastError" TEXT;

CREATE TABLE IF NOT EXISTS "EmailDeliveryEvent" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "messageId" TEXT,
  "inviteId" TEXT,
  "eventType" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailDeliveryEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EmailDeliveryEvent_provider_idx" ON "EmailDeliveryEvent"("provider");
CREATE INDEX IF NOT EXISTS "EmailDeliveryEvent_messageId_idx" ON "EmailDeliveryEvent"("messageId");
CREATE INDEX IF NOT EXISTS "EmailDeliveryEvent_inviteId_idx" ON "EmailDeliveryEvent"("inviteId");
CREATE INDEX IF NOT EXISTS "EmailDeliveryEvent_receivedAt_idx" ON "EmailDeliveryEvent"("receivedAt");

DO $$ BEGIN
  ALTER TABLE "EmailDeliveryEvent"
    ADD CONSTRAINT "EmailDeliveryEvent_inviteId_fkey"
    FOREIGN KEY ("inviteId") REFERENCES "PartnerInvite"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "PartnerInvite_emailMessageId_idx" ON "PartnerInvite"("emailMessageId");
CREATE INDEX IF NOT EXISTS "PartnerInvite_emailStatus_idx" ON "PartnerInvite"("emailStatus");
