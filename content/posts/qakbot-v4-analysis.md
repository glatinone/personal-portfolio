---
title: "QakBot v4 Malware Analysis: Banking Trojan Deep Dive"
description: "A static and dynamic analysis of QakBot v4, the persistent banking trojan that evolved into a full-service initial access broker for ransomware groups."
date: "2025-10-15"
categories: ["Malware"]
tags: ["QakBot", "Malware Analysis", "Banking Trojan", "Reverse Engineering", "YARA"]
coverGradient: "malware"
---

QakBot (also known as QBot and Pinkslipbot) is one of the most resilient banking trojans in the threat landscape. What started as a credential stealer in 2007 has grown into a modular malware platform. Ransomware groups including Black Basta, REvil, and Conti have consistently relied on QakBot as their preferred initial access vehicle.

This post covers my thesis research findings on QakBot v4, focusing on the loader chain, anti-analysis techniques, and C2 communication protocol.

## Infection Chain Overview

The typical QakBot v4 delivery chain observed during 2024-2025 follows a predictable but effective pattern:

1. **Phishing email** with a ZIP attachment or direct HTML smuggling
2. **JavaScript dropper** that executes via `wscript.exe`
3. **PowerShell loader** that fetches an encrypted payload from a hardcoded CDN URL
4. **Packed DLL** injected into a legitimate Windows process (usually `calc.exe` or `AtBroker.exe`)
5. **QakBot core** running inside the hollowed process, establishing C2

The operators behind QakBot clearly invest in delivery infrastructure. CDN URLs rotate frequently and the JavaScript dropper uses heavy obfuscation to defeat signature-based detection at the email gateway.

## Anti-Analysis Techniques

QakBot v4 is heavily obfuscated. The following evasion techniques were documented during analysis:

**Control flow obfuscation.** The decompiled code is littered with opaque predicates. Every meaningful branch has a junk computation path that never executes, making manual static analysis extremely difficult and frustrating. Symbolic execution tools like angr are required to cut through the noise.

**String encryption.** All strings (API names, C2 URLs, registry keys) are encrypted with a custom RC4-like cipher. The decryption key is derived from a 4-byte seed stored in the `.data` section, XOR'd with the binary's compile timestamp. This means no two samples have the same decrypted strings without knowing the timestamp.

**API hashing.** Instead of importing DLL functions by name, QakBot resolves them at runtime using CRC32 hashes. This defeats naive import table analysis and breaks most automated dynamic analysis rulesets.

**Sandbox detection.** The sample checks multiple environmental factors before executing:

- Loaded module count below 100 (indicates a clean virtual machine)
- `CPUID` leaf `0x40000000` for hypervisor signatures
- Timing checks using `RDTSC` to detect single-stepping
- User interaction presence (mouse movement history, recent file access)

If any check fails, the sample exits cleanly with no visible error.

## C2 Communication

The C2 protocol uses HTTPS over ports 443 and 8443 against a list of roughly 50 hardcoded IP addresses. These are predominantly compromised residential routers, which makes blocklisting by IP impractical for defenders.

Key observations from traffic analysis:

- **Beacon interval**: 5 to 60 minutes with randomized jitter
- **Data encoding**: Base64-wrapped RC4 over the wire
- **Initial fingerprint**: First beacon includes hostname, domain, username, OS version, installed AV products, and software inventory
- **Module delivery**: The C2 pushes additional capability modules on demand, including an email stealer, VNC access module, and lateral movement tooling

The modular design is notable. The core implant stays lean and the operator decides which capabilities to load post-compromise. This reduces the detection surface of the initial payload.

## YARA Rule

The following YARA rule targets the PowerShell loader stage. It matches on the base64 conversion routine combined with the PE header magic bytes that get unpacked in memory.

```yara
rule QakBot_v4_Loader {
    meta:
        description = "Detects QakBot v4 PowerShell loader"
        author = "Kiell Tampubolon"
        date = "2025-10"
        reference = "Thesis research - QakBot v4 analysis"
    strings:
        $s1 = "FromBase64String" ascii
        $s2 = "Reflection.Assembly" ascii
        $s3 = { 4D 5A 90 00 03 00 00 00 }
        $s4 = "[System.Convert]::" ascii wide
    condition:
        2 of ($s1, $s2, $s4) and $s3
}
```

Test against your sample corpus first. The `$s3` PE magic bytes will produce false positives without the string conditions, so all three clauses are required.

## Detection Recommendations

QakBot v4 represents the commoditization of serious malware engineering. The code is professionally maintained, regression-tested, and ships with a plugin architecture that lets operators extend functionality without modifying the core binary.

Defenders should prioritize the following:

- Monitor for `wscript.exe` spawning `powershell.exe` process trees. This parent-child relationship is unusual in most enterprise environments and catches the early loader stage.
- Alert on DLL injection into system calculator (`calc.exe`) and accessibility binaries (`AtBroker.exe`). Legitimate software rarely injects into these targets.
- Block outbound HTTPS to IP addresses in residential ISP ASNs rather than data center ranges. QakBot operators specifically avoid cloud provider IP space.
- Deploy network-level detection using JA3/JA3S fingerprints specific to QakBot's TLS handshake pattern. The cipher suite ordering is distinctive and consistent across samples.

The sample set for this research came from MalwareBazaar and internal threat intelligence sharing. Full IOC list available on request.
