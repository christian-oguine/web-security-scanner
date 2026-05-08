# Security Checks Reference

This document explains the checks currently implemented in this project, how results are evaluated, and how they affect scoring.

## Result Model

Each check returns a finding with:

- `check`: check name
- `status`: `pass`, `fail`, or `warning`
- `severity`: `critical`, `high`, `medium`, `low`, or `info`
- `score`: numeric contribution to total score
- `message`: human-readable explanation
- `autoFail` (optional): when `true`, final score becomes `0` and grade becomes `F`

## Check Groups

## 1) HTTP Header Checks

Source: `src/services/checks/headers.ts`

### Content-Security-Policy

- **Pass**: `Content-Security-Policy` header exists
- **Fail**: header missing
- **Severity**: high
- **Score**: `22` on pass, `0` on fail
- **Why it matters**: reduces XSS attack surface

### Strict-Transport-Security

- **Pass**: `Strict-Transport-Security` header exists
- **Fail**: header missing
- **Severity**: high
- **Score**: `22` on pass, `0` on fail
- **Why it matters**: helps prevent protocol downgrade / SSL stripping

### X-Frame-Options

- **Pass**: `X-Frame-Options` header exists
- **Fail**: header missing
- **Severity**: medium
- **Score**: `13` on pass, `0` on fail
- **Why it matters**: helps reduce clickjacking risk

### X-Content-Type-Options

- **Pass**: `X-Content-Type-Options` header exists
- **Fail**: header missing
- **Severity**: low
- **Score**: `8` on pass, `0` on fail
- **Why it matters**: helps prevent MIME type sniffing issues

### Referrer-Policy

- **Pass**: `Referrer-Policy` header exists
- **Fail**: header missing
- **Severity**: low
- **Score**: `5` on pass, `0` on fail
- **Why it matters**: limits sensitive referrer data leakage

### Server Version Disclosure

- **Pass**: `Server` header not present
- **Fail**: `Server` header present
- **Severity**: low
- **Score**: `5` on pass, `0` on fail
- **Why it matters**: reduces stack fingerprinting signals

### X-Powered-By Disclosure

- **Pass**: `X-Powered-By` header not present
- **Fail**: `X-Powered-By` header present
- **Severity**: low
- **Score**: `5` on pass, `0` on fail
- **Why it matters**: reduces technology disclosure

### Header Check Failure Case

If the target URL cannot be reached for header analysis, the service returns one finding:

- `check`: `HTTP Security Headers`
- `status`: `fail`
- `severity`: high
- `score`: `0`

## 2) SSL/TLS Certificate Check

Source: `src/services/checks/ssl.ts`

The scanner opens a TLS connection to port `443` and inspects certificate validity and expiry.

### Outcomes

- **Pass**
  - Certificate is valid
  - `status`: `pass`
  - `severity`: critical
  - `score`: `0`
  - `autoFail`: `false`

- **Warning**
  - Certificate is valid but expires in 30 days or fewer
  - `status`: `warning`
  - `severity`: high
  - `score`: `0`
  - `autoFail`: `false`

- **Fail (Auto-Fail)**
  - Certificate is expired, missing, or connection fails/times out
  - `status`: `fail`
  - `severity`: critical
  - `score`: `0`
  - `autoFail`: `true`

## 3) DNS Check (DMARC)

Source: `src/services/checks/dns.ts`

The scanner looks up TXT records for `_dmarc.<hostname>` and evaluates DMARC policy.

### Outcomes

- **Pass**
  - DMARC record exists and policy is enforcing (`quarantine` or `reject`)
  - `status`: `pass`
  - `severity`: medium
  - `score`: `20`

- **Warning**
  - DMARC exists but policy is `p=none`
  - `status`: `warning`
  - `severity`: medium
  - `score`: `10`

- **Fail**
  - No DMARC record found or lookup fails
  - `status`: `fail`
  - `severity`: medium
  - `score`: `0`

## 4) Exposed Sensitive Files

Source: `src/services/checks/files.ts`

The scanner checks two common high-risk paths:

- `/.env`
- `/.git/config`

Each file is requested from the target origin and evaluated for likely sensitive content.

### Exposed `.env` File

- **Fail (Auto-Fail)**: file appears publicly accessible and content matches environment key pattern
- **Pass**: file blocked/missing/empty/not matching exposure pattern
- **Severity**: critical
- **Score**: `0`
- **autoFail**: `true` when exposed

### Exposed `.git/config`

- **Fail (Auto-Fail)**: file appears publicly accessible and content includes Git config structure (for example `[core]`)
- **Pass**: file blocked/missing/empty/not matching exposure pattern
- **Severity**: critical
- **Score**: `0`
- **autoFail**: `true` when exposed

## Scoring Impact Summary

Implemented positive score contributions currently come from:

- Header checks
- DMARC check
- Disclosure checks

Critical checks (`SSL`, exposed files) currently act as risk gates (`autoFail`) rather than positive score contributors.

Final scoring behavior is documented in `src/services/scoring.ts`:

- Sum all finding scores
- Cap at `100`
- If any finding has `autoFail: true`, force final score `0` and grade `F`

## Known Limitations

- Checks are intentionally lightweight and do not replace a full security assessment.
- Header presence is checked, but directive quality is not deeply validated.
- TLS check focuses on certificate validity/expiry, not full cipher/protocol hardening.
- DMARC check validates presence/policy only, not full SPF/DKIM alignment state.
- Exposed file checks target two common paths only; other sensitive endpoints are not scanned.

## Recommended Remediation Priority

When a scan fails, prioritize fixes in this order:

1. Exposed sensitive files (`/.env`, `/.git/config`)
2. SSL/TLS certificate failures
3. Missing high-impact headers (`CSP`, `HSTS`)
4. DMARC record issues
5. Remaining medium/low findings

## Related Files

- `src/services/scanner.ts`
- `src/services/checks/headers.ts`
- `src/services/checks/ssl.ts`
- `src/services/checks/dns.ts`
- `src/services/checks/files.ts`
- `src/services/scoring.ts`
- `src/types/scanner.ts`
