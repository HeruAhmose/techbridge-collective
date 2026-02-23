-- Cron health tracking table for observability.

DO $$ BEGIN
  CREATE TYPE "CronRunStatus" AS ENUM ('STARTED', 'SUCCESS', 'FAILED', 'SKIPPED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "CronRun" (
  "id" TEXT NOT NULL,
  "jobName" TEXT NOT NULL,
  "status" "CronRunStatus" NOT NULL DEFAULT 'STARTED',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3),
  "durationMs" INTEGER,
  "locked" BOOLEAN NOT NULL DEFAULT TRUE,
  "attempted" INTEGER NOT NULL DEFAULT 0,
  "processed" INTEGER NOT NULL DEFAULT 0,
  "skipped" INTEGER NOT NULL DEFAULT 0,
  "errorsCount" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "meta" JSONB,
  CONSTRAINT "CronRun_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "CronRun_jobName_startedAt_idx" ON "CronRun"("jobName", "startedAt");
CREATE INDEX IF NOT EXISTS "CronRun_status_idx" ON "CronRun"("status");
