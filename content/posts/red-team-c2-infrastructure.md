---
title: "Building a Covert C2 Infrastructure for Red Team Ops"
description: "A practical guide to standing up a resilient, opsec-aware command-and-control infrastructure using Havoc C2, redirectors, and domain fronting."
date: "2025-09-03"
categories: ["Red Teaming"]
tags: ["C2", "Havoc", "Infrastructure", "Red Team", "OPSEC"]
coverGradient: "redteam"
---

One of the most common mistakes I see in red team setups: operators spin up a bare VPS, install Cobalt Strike, and point the beacon directly at the C2 server's public IP. That infrastructure is dead within 30 minutes against any competent blue team. This post covers how to build something that actually survives active hunting.

## Core Design Principles

Before configuring a single server, establish your threat model clearly:

- **Attribution resistance.** Your infrastructure should not trace back to you or your client during the engagement window.
- **Resilience.** Losing one server should not kill active sessions or compromise the operation.
- **Traffic legitimacy.** C2 callbacks must blend into normal enterprise network flows to avoid triggering behavioral analytics.

## Infrastructure Layout

```
Target Network
     |
     v
[Redirector 1]  <---- CDN / Domain Front
[Redirector 2]  <---- Legitimate hosting provider
     |
     v
[C2 Team Server]  <-- VPN-only management
     |
     v
[Operator Workstation]
```

Redirectors sit between the beacon and the actual C2 team server. They are cheap VPS instances running Nginx or Apache with a reverse proxy rule. If the blue team burns a redirector, you spin up a replacement without losing active sessions. The team server IP stays clean and unknown to the target environment.

Never expose the team server IP to the internet directly. Firewall rules should drop everything except inbound connections from your redirector IP list.

## Domain Selection

Your C2 domain is a critical OPSEC decision. The rules that matter:

1. **Age matters.** Buy or reclaim domains at least two months before the engagement begins. Fresh domains are flagged automatically by Cisco Umbrella, Palo Alto DNS Security, and similar products.
2. **Categorize before go-live.** Submit your domain to web categorization services (Bluecoat, Cisco Talos, Fortiguard) as "Business & Economy" before the engagement starts. An uncategorized domain triggers proxy alerts.
3. **Match the target's technology stack.** If the client uses Microsoft 365, a domain resembling a Microsoft update or CDN endpoint blends in. Obvious typosquats are filtered by modern URL reputation tools.
4. **Valid TLS is required.** Let's Encrypt is fine. What matters is that the certificate matches the domain and the TLS fingerprint is not identical to known C2 frameworks.

## Havoc C2 Configuration

Havoc has replaced Cobalt Strike for most of my engagements. It is open-source, actively maintained, and the malleable C2 profile support is solid. The lack of a per-seat license also makes it easier to scale operations.

Key listener settings for a low-profile HTTPS profile:

```toml
[Listener]
  Name = "https-443"
  Protocol = "https"
  CallbackHosts = ["redirector1.yourdomain.com"]
  BindPort = 443
  Hosts = ["redirector1.yourdomain.com"]

[Agent.Config]
  Jitter = 15
  Sleep = 30
  Killdate = "2025-12-01"
  WorkingHours = "08:00-18:00"
```

The `WorkingHours` setting is underused. Making the beacon only active during business hours significantly reduces the detection window during nights and weekends when SOC coverage is typically lighter.

The `Killdate` field is non-negotiable. Every payload delivered should have a hard expiry date aligned with the engagement end date. A stray beacon phoning home after scope ends is a major incident waiting to happen.

## Traffic Blending with Nginx Redirectors

The redirector's Nginx configuration serves two purposes: forward valid C2 traffic to the team server, and return legitimate-looking responses to everything else. A SOC analyst probing the IP from a browser sees a normal 200 response.

```nginx
location /api/v1/update {
    proxy_pass https://c2-teamserver-ip:443;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
}

location / {
    return 200 'OK';
    add_header Content-Type text/plain;
    add_header Server "nginx";
}
```

Only traffic matching the beacon's callback URI (`/api/v1/update` in this example) gets proxied. Everything else gets a clean 200 response that looks like a placeholder site. Customize the URI to match something plausible for your domain category.

## OPSEC Checklist

Before going operational, verify each item:

- [ ] Redirector IPs share no ASN with the team server
- [ ] Domain has valid reverse DNS (PTR record configured)
- [ ] CDN or front domain is categorized as safe by Umbrella, Palo Alto, and Fortiguard
- [ ] Team server firewall drops all inbound except redirector IPs on port 443
- [ ] All management access routes through WireGuard VPN only
- [ ] Separate operator credentials provisioned per engagement
- [ ] Kill date set in every payload before delivery
- [ ] No operator workstation connected directly to team server

## Lessons from the Field

The hardest part of C2 infrastructure is not the technical configuration. It is discipline. An operator who SSHes directly into the team server from a home IP exposes the entire operation in a single connection log entry. An operator who reuses infrastructure across engagements hands the blue team attribution data that links previously separate incidents.

Treat every connection as if a threat hunter is watching the logs in real time. In a well-run engagement, they are.
