# Responsible Use Policy

This project is a defensive security tool. Use it to improve your own systems or systems you are explicitly authorized to test.

## Purpose

The scanner helps identify basic web security weaknesses (headers, TLS, DMARC, and exposed files) so teams can remediate issues early.

It is not intended for offensive use, stealth probing, exploitation, or unauthorized reconnaissance.

## Authorization Requirements

Only scan targets when at least one of the following is true:

- You own the domain/system.
- You have written permission from the owner.
- The target is part of an approved internal security program.
- The target is explicitly included in a legal bug bounty scope.

Do not scan:

- Systems outside your authorization scope.
- Government, healthcare, financial, or critical infrastructure assets without explicit legal approval.
- Internal/private network targets you are not approved to assess.

## Legal and Compliance

You are responsible for complying with all applicable laws, regulations, contracts, and acceptable use policies in your jurisdiction and the target's jurisdiction.

Unauthorized scanning may violate:

- Computer misuse/cybercrime laws
- Terms of service
- Contractual obligations
- Privacy and data protection laws

When in doubt, do not scan until legal approval is confirmed.

## Safe Operational Practices

To reduce risk and avoid accidental disruption:

- Prefer scanning your staging environment before production.
- Run scans during approved testing windows.
- Respect target rate limits and service stability.
- Avoid repeated high-frequency scans against the same host.
- Use least-privilege credentials and secure secrets handling.

If a scan appears to affect service availability, stop immediately and notify the system owner.

## Data Handling and Privacy

Scan results can contain sensitive technical details (hostnames, security posture, potential exposures).

Handle data responsibly:

- Store results only in approved environments.
- Restrict access to authorized team members.
- Avoid sharing raw findings publicly.
- Remove sensitive details from screenshots, demos, and tickets when possible.
- Follow your organization's retention and deletion policy.

## Vulnerability Disclosure

If you identify a real security issue:

1. Document evidence clearly and minimally.
2. Report through the owner's official disclosure channel.
3. Share only what is required for remediation.
4. Do not publicly disclose before the owner has reasonable time to respond and fix.

Do not attempt exploitation or lateral movement to "prove" impact beyond authorized testing rules.

## Tool Limitations

This scanner provides baseline checks only.

- A passing scan does not mean a system is secure.
- A failing scan does not confirm exploitability in all cases.
- Results should be reviewed by humans and combined with deeper testing.

Use this tool as one component of a broader security program.

## Team Policy Template

You can adopt this minimum policy in your organization:

- "We scan only authorized assets."
- "We use findings for remediation, not exploitation."
- "We protect scan data as sensitive information."
- "We disclose vulnerabilities responsibly."

## Contact and Escalation

Define internal owners for:

- Security approvals
- Incident response
- Legal review
- Vulnerability disclosure decisions

If your team has no defined owner, pause external scanning until ownership is assigned.

## Document Ownership

- Developer: Christian Oguine
- Last Updated: 2026-05-08
