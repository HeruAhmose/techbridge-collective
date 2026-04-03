# Security policy

This repository is **proprietary**. Reporting a vulnerability does **not** grant
any right to redistribute source or publish non-public details without written
approval.

## Reporting a vulnerability

- **Do not** open a **public** GitHub issue for exploitable findings.

### Preferred: GitHub private reporting

If enabled for this repository, use **Security** → **Report a vulnerability**
so the discussion stays private.

### Email

If private reporting is not available, contact the **repository owner**
(`HeruAhmose` / maintainers) with:

- clear description and affected paths or versions
- steps to reproduce (safe PoC only)
- impact and suggested remediation, if known

We aim to acknowledge within **72 hours** and coordinate a fix timeline.

## Secrets and configuration

- Never commit `.env`, `.env.local`, API keys, or database credentials.
- Use documented env var names only in examples — never real values.
- Rotate keys immediately if they are exposed (chat, logs, CI output, screenshots).

## Dependencies

- Keep `pnpm-lock.yaml` committed and use `pnpm install --frozen-lockfile` in CI.
- Review `pnpm audit` regularly; Dependabot opens weekly update PRs when configured.
