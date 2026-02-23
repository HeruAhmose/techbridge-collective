-- Additional indexes for cron pruning and invite retry performance.

-- CronRun prune uses ORDER BY startedAt
CREATE INDEX IF NOT EXISTS "CronRun_startedAt_idx" ON "CronRun"("startedAt");

-- Invite retry cron uses consumedAt/emailStatus ordering by emailLastAttemptAt
CREATE INDEX IF NOT EXISTS "PartnerInvite_emailStatus_emailLastAttemptAt_idx"
ON "PartnerInvite"("emailStatus", "emailLastAttemptAt");

CREATE INDEX IF NOT EXISTS "PartnerInvite_consumedAt_emailStatus_emailLastAttemptAt_idx"
ON "PartnerInvite"("consumedAt", "emailStatus", "emailLastAttemptAt");
