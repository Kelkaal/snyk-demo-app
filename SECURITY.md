# Security Policy

## Snyk Scanning
This repository is protected by Snyk across all four scan types:
- **Snyk Open Source** — dependency vulnerability scanning
- **Snyk Code** — static application security testing (SAST)
- **Snyk Container** — Dockerfile and base image scanning
- **Snyk IaC** — Kubernetes manifest misconfiguration scanning

## Branch Protection
All pull requests targeting `main` must pass all Snyk checks before merging.

## Vulnerability Response
- Critical/High vulnerabilities must be remediated before merge
- Exceptions require explicit justification via Snyk ignore with a reason and expiry date