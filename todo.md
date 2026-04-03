# Quantum Hardening & Deployment TODO

## Phase 1: Audit

- [ ] Review all source files for security vulnerabilities
- [ ] Check for exposed secrets, API keys, or sensitive data
- [ ] Audit all external CDN/image URLs
- [ ] Review all dependencies for known vulnerabilities

## Phase 2: Quantum Hardening

- [ ] Add Cloudflare \_headers file with strict security headers
- [ ] Add Subresource Integrity (SRI) hashes for external scripts/fonts
- [ ] Add Content Security Policy (CSP)
- [ ] Add Permissions-Policy to restrict dangerous APIs
- [ ] Add anti-clickjacking / anti-tampering protections
- [ ] Add runtime integrity checks
- [ ] Harden contact form / email links
- [ ] Add SECURITY.md

## Phase 3: Cloudflare Parity

- [ ] Verify vite.config.ts is clean
- [ ] Verify build works standalone
- [ ] Verify all CDN URLs accessible
- [ ] Test build output

## Phase 4: GitHub Security

- [ ] Push all hardened code
- [ ] Set branch protection rules
- [ ] Make repo public for viewing
- [ ] Add LICENSE file
