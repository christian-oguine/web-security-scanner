# Security Knowledge

This document explains the security ideas behind each check in this project: what the control does, why it matters, how attackers abuse weaknesses, and what stronger configuration usually looks like.

A passing scanner result means a control was detected. It does not guarantee the control is fully hardened. Treat these checks as baseline guardrails and use manual review for deeper assurance.

---

## HTTP Security Headers

HTTP response headers are browser instructions. Security headers reduce attack surface by telling the browser what behavior is allowed, blocked, or restricted.

Missing headers are silent weaknesses. Applications may appear to work normally while users remain exposed to avoidable risk.

---

### Content-Security-Policy (CSP)

**What it is**

A policy header that allowlists trusted content sources for scripts, styles, images, frames, and other resources.

**Why it matters**

CSP is one of the strongest browser-layer mitigations against XSS and script injection.

**How attackers exploit its absence**

If user-controlled content reaches the page unsafely, attackers can inject script code or external script references. The victim browser executes that code in the application's trusted context.

**What good configuration looks like**

- Use a strict baseline such as `default-src 'self'`
- Restrict script execution with nonces/hashes instead of broad wildcards
- Avoid `unsafe-inline` and `unsafe-eval` unless absolutely required
- Add `object-src 'none'` and `base-uri 'self'`
- Tune incrementally and test to avoid breaking legitimate resources

---

### Strict-Transport-Security (HSTS)

**What it is**

A header that tells browsers to use HTTPS only for a domain for a specified duration.

**Why it matters**

It helps prevent protocol downgrade and SSL stripping attacks.

**How attackers exploit its absence**

Attackers on an untrusted network can attempt to force HTTP connections and intercept or alter traffic.

**What good configuration looks like**

- Set long max-age (for example, `31536000`)
- Use `includeSubDomains` where appropriate
- Consider preload only when all subdomains are HTTPS-ready

---

### X-Frame-Options

**What it is**

A header controlling whether a page can be embedded in frames/iframes.

**Why it matters**

It reduces clickjacking risk, where users are tricked into clicking hidden UI elements.

**How attackers exploit its absence**

An attacker site embeds the target page invisibly and overlays decoy UI, causing unintended user actions.

**What good configuration looks like**

- Prefer `DENY` where framing is not needed
- Use `SAMEORIGIN` only when same-site framing is required
- Pair with CSP `frame-ancestors` for stronger modern control

---

### X-Content-Type-Options

**What it is**

A header that disables MIME sniffing (`nosniff`), forcing browsers to trust declared content types.

**Why it matters**

It lowers the chance of browsers interpreting content as executable when it should not be.

**How attackers exploit its absence**

Mislabelled files can be interpreted in unsafe ways by certain clients, enabling script execution paths.

**What good configuration looks like**

- Set `X-Content-Type-Options: nosniff` globally
- Ensure server `Content-Type` headers are accurate

---

### Referrer-Policy

**What it is**

A header that controls how much referrer information is sent to other origins.

**Why it matters**

It reduces accidental leakage of sensitive URLs, query params, and internal paths.

**How attackers exploit weak policy**

Third-party endpoints can receive full URLs containing identifiers or sensitive query values.

**What good configuration looks like**

- Common secure default: `strict-origin-when-cross-origin`
- Use stricter values for highly sensitive applications

---

### Server / X-Powered-By Disclosure

**What it is**

Headers that may reveal server software or framework details.

**Why it matters**

Technology disclosure helps attackers fingerprint stack versions and prioritize known exploit paths.

**How attackers exploit exposure**

Automated scanners combine header fingerprints with CVE databases to target likely vulnerable versions.

**What good configuration looks like**

- Remove or minimize identifying headers where possible
- Keep dependencies patched even if headers are hidden

---

## SSL/TLS Certificate Security

### Certificate Presence and Validity

**What it is**

A certificate proves server identity and enables encrypted transport over HTTPS.

**Why it matters**

Without valid TLS, confidentiality and integrity of traffic are at risk.

**How attackers exploit failures**

Expired/misconfigured certificates can break trust, create warning fatigue, and increase interception exposure on hostile networks.

**What good configuration looks like**

- Maintain valid certificates for all public hostnames
- Renew well before expiry (automate where possible)
- Monitor expiry and issuance health continuously

---

## DNS / Email Domain Security (DMARC)

### DMARC Record and Policy

**What it is**

A DNS policy helping receiving mail systems decide how to treat unauthenticated email claiming your domain.

**Why it matters**

DMARC reduces domain spoofing and phishing abuse.

**How attackers exploit missing/weak policy**

If no DMARC exists or policy is `p=none`, spoofed messages can still be delivered more easily.

**What good configuration looks like**

- Publish a valid DMARC TXT record at `_dmarc.<domain>`
- Move from `p=none` to `quarantine`/`reject` after monitoring
- Align DMARC with SPF and DKIM rollout

---

## Sensitive File Exposure

### Public `/.env` Access

**What it is**

Exposure of environment configuration files through web root or static serving misconfiguration.

**Why it matters**

`.env` files often contain API keys, database credentials, and secrets.

**How attackers exploit it**

Attackers request common paths and use leaked credentials for account takeover, data extraction, and infrastructure compromise.

**What good configuration looks like**

- Never serve `.env` from public paths
- Store secrets outside web-accessible directories
- Rotate all exposed credentials immediately if leakage is suspected

---

### Public `/.git/config` Access

**What it is**

Exposure of internal Git metadata from deployed web servers.

**Why it matters**

Visible `.git` structure can lead to repository reconstruction and code disclosure.

**How attackers exploit it**

Attackers enumerate `.git` objects/refs and recover source code, secrets, and internal URLs.

**What good configuration looks like**

- Block `/.git` paths at web server/reverse proxy level
- Keep VCS artifacts out of deployment outputs
- Validate deny rules in staging and production

---

## Practical Interpretation

- A pass indicates baseline protection signal, not full hardening.
- A fail indicates actionable risk and should be prioritized by severity and exposure.
- A warning indicates partial protection that still needs follow-up.

Use these checks as a fast triage layer, then follow with deeper testing and architecture review.
