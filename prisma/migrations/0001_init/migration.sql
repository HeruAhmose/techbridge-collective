-- This migration is intentionally minimal and matches prisma/schema.prisma.
-- Prisma will manage cuid() ids at the client layer (no DB defaults required).

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('PUBLIC', 'NAVIGATOR', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "TechOutcome" AS ENUM ('RESOLVED', 'NEEDS_HELP', 'FOLLOW_UP');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "clerkUserId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'PUBLIC',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkUserId_key" ON "User"("clerkUserId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

CREATE TABLE IF NOT EXISTS "HubLocation" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "zip" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HubLocation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "HubLocation_name_key" ON "HubLocation"("name");
CREATE INDEX IF NOT EXISTS "HubLocation_city_state_idx" ON "HubLocation"("city","state");

CREATE TABLE IF NOT EXISTS "HubSchedule" (
  "id" TEXT NOT NULL,
  "hubLocationId" TEXT NOT NULL,
  "dayOfWeek" INTEGER NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "cadence" TEXT NOT NULL DEFAULT 'Weekly',
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT "HubSchedule_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "HubSchedule_hubLocationId_dayOfWeek_idx" ON "HubSchedule"("hubLocationId","dayOfWeek");

ALTER TABLE "HubSchedule"
  ADD CONSTRAINT "HubSchedule_hubLocationId_fkey"
  FOREIGN KEY ("hubLocationId") REFERENCES "HubLocation"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "ResidentRequest" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "name" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "language" TEXT NOT NULL DEFAULT 'EN',
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "preferredHubLocationId" TEXT,
  "preferredTime" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  CONSTRAINT "ResidentRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ResidentRequest_createdAt_idx" ON "ResidentRequest"("createdAt");
CREATE INDEX IF NOT EXISTS "ResidentRequest_status_idx" ON "ResidentRequest"("status");

ALTER TABLE "ResidentRequest"
  ADD CONSTRAINT "ResidentRequest_preferredHubLocationId_fkey"
  FOREIGN KEY ("preferredHubLocationId") REFERENCES "HubLocation"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "PartnerRequest" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "organization" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "city" TEXT,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  CONSTRAINT "PartnerRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PartnerRequest_createdAt_idx" ON "PartnerRequest"("createdAt");
CREATE INDEX IF NOT EXISTS "PartnerRequest_status_idx" ON "PartnerRequest"("status");

CREATE TABLE IF NOT EXISTS "TechMinute" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "hubLocationId" TEXT NOT NULL,
  "navigatorUserId" TEXT NOT NULL,
  "minutes" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "outcome" "TechOutcome" NOT NULL,
  "resolution" TEXT,
  "isEscalated" BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT "TechMinute_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TechMinute_createdAt_idx" ON "TechMinute"("createdAt");
CREATE INDEX IF NOT EXISTS "TechMinute_category_idx" ON "TechMinute"("category");
CREATE INDEX IF NOT EXISTS "TechMinute_outcome_idx" ON "TechMinute"("outcome");

ALTER TABLE "TechMinute"
  ADD CONSTRAINT "TechMinute_hubLocationId_fkey"
  FOREIGN KEY ("hubLocationId") REFERENCES "HubLocation"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "TechMinute"
  ADD CONSTRAINT "TechMinute_navigatorUserId_fkey"
  FOREIGN KEY ("navigatorUserId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
