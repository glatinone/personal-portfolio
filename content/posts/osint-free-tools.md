---
title: "OSINT on a Budget: Mapping Attack Surfaces with Free Tools"
description: "A practitioner's guide to passive and active reconnaissance using free-tier tools including Shodan, VirusTotal, Censys, SpiderFoot, and certificate transparency logs."
date: "2025-07-20"
categories: ["OSINT"]
tags: ["OSINT", "Recon", "Shodan", "Threat Intel", "Attack Surface"]
coverGradient: "osint"
---

Before you touch a target network, you should know more about their infrastructure than most of their own IT team does. Passive OSINT lets you map the attack surface without sending a single packet to the target. This is my actual workflow, built from real engagements.

## Phase 1: Domain and IP Intelligence

Start broad. Given a company name or primary domain, build out the IP and domain landscape before getting specific.

**WHOIS and passive DNS** are your baseline:

```bash
# Current registrar, creation date, nameservers
whois target.com

# Historical DNS records to find old IPs and forgotten subdomains
curl "https://api.securitytrails.com/v1/domain/target.com/subdomains" \
  -H "apikey: YOUR_KEY"
```

**Certificate transparency logs** are consistently underused by practitioners. Every TLS certificate issued for a domain is logged publicly in CT logs. Searching `crt.sh` for `%.target.com` reveals subdomains the organization may have forgotten about entirely:

```bash
curl -s "https://crt.sh/?q=%.target.com&output=json" | \
  jq '.[].name_value' | sort -u
```

On nearly every engagement I run, CT log searches surface staging servers, internal tools with public DNS entries, and legacy apps that were never decommissioned. These are often the easiest entry points because nobody is patching or monitoring them.

## Phase 2: Shodan Dorks

Shodan is the most capable free tool for infrastructure mapping. A focused initial sweep uses these queries:

```
org:"Target Corp"
ssl.cert.subject.cn:"target.com"
http.title:"Outlook Web App" org:"Target Corp"
port:3389 org:"Target Corp"
port:22 org:"Target Corp" country:"ID"
```

What you are looking for: exposed RDP and SSH, web admin panels, VPN concentrators, legacy services (FTP, Telnet), and misconfigured cloud storage buckets. Any port 3389 result deserves immediate attention. RDP exposed to the internet is a recurring finding even in mature organizations.

Filter your Shodan results by country code when you know the target operates primarily in one region. It cuts noise significantly.

## Phase 3: VirusTotal as a Threat Intel Platform

Most practitioners use VirusTotal only for file scanning. It is actually a full threat intelligence platform when used correctly.

The three features that matter most for recon:

**Passive DNS.** What IP addresses has this domain resolved to over its lifetime? Old IPs often still host internal services or reveal hosting provider patterns.

**Relations graph.** Every domain's graph shows files that communicate with it, other domains hosted on the same IP, and sibling domains registered to the same infrastructure. The graph view regularly surfaces undisclosed assets.

**Communicating files.** What known malware has beaconed to this IP? Useful for threat intel work when profiling a suspicious host.

Programmatic access via the Python client:

```python
import vt

client = vt.Client("YOUR_API_KEY")
obj = client.get_object("/domains/suspicious-domain.com")
print(obj.last_analysis_stats)
print(obj.passive_dns_replication)
```

The free tier (1000 requests/day) is sufficient for single-target recon.

## Phase 4: Email Intelligence

**Hunter.io** free tier gives 25 email searches per month. That is enough to confirm the email format (`first.last@company.com` vs `flast@company.com`) and collect a handful of real addresses for social engineering or password spray testing.

**Have I Been Pwned API** checks whether company email addresses appear in breach datasets. A corporate email in a credential dump suggests password reuse is a realistic attack path. This is a fast way to prioritize which accounts to target in a password spray.

## Phase 5: LinkedIn OSINT

LinkedIn is a goldmine for org chart mapping, technology stack discovery, and identifying high-value targets. Job postings are particularly useful because they reveal internal tooling:

- "Experience with CrowdStrike Falcon" indicates they run CrowdStrike EDR
- "Must be proficient in Cisco ISE" reveals network access control infrastructure
- "Our stack: AWS, Terraform, Kubernetes" discloses cloud and infrastructure details

My [OSINTScout](https://github.com/glatinone/osintscout) tool automates scraping LinkedIn, X, and Instagram for a given target username. It requires no authentication and operates on public data only.

## Phase 6: SpiderFoot for Automation

SpiderFoot (free, self-hosted) automates most of the above into a single run. It queries roughly 200 data sources and maps relationships automatically. For an initial sweep on a new target:

```bash
docker run -p 5001:5001 spiderfoot/spiderfoot
# Open http://localhost:5001
# New scan -> target.com -> All modules -> Run
```

Expect 30 to 60 minutes for a complete scan. The output is a relationship graph covering every discovered IP, subdomain, email address, employee name, and third-party service relationship.

SpiderFoot is not a replacement for manual methodology. It is a way to ensure you have not missed something obvious before moving into active phases.

## Defensive Perspective

If you are a defender reading this, run this same workflow against your own organization at least once per quarter. Every asset this process surfaces is an asset that attackers can find with the same tools. Anything exposed and unmonitored is a potential entry point. The only way to know your real attack surface is to map it the same way an attacker would.
