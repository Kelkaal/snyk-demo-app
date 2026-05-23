# snyk-demo-app — Snyk PR Scanning Integration Runbook

## Overview

This repository demonstrates a complete end-to-end Snyk PR scanning integration
with GitHub. Every pull request targeting `main` is automatically scanned across
four security domains. Failing checks block the merge.

---

## Architecture

```text
Developer opens PR
│
▼
GitHub triggers checks
│
├── Snyk Native PR Checks (via GitHub App)
│       ├── code/snyk      → Snyk Code (SAST)
│       └── security/snyk  → Snyk Open Source (SCA)
│
└── GitHub Actions Workflow (.github/workflows/snyk.yml)
        ├── Snyk Open Source (SCA)
        ├── Snyk Code (SAST)
        ├── Snyk Container
        └── Snyk IaC
│
▼
All checks Required on main
Merge blocked if any check fails
```

---

## Snyk Organisation & Project Structure

| Item | Value |
|---|---|
| Snyk Org | kelkaal |
| SCM | GitHub |
| Repo | Kelkaal/snyk-demo-app |
| Snyk Open Source | monitors package.json / package-lock.json |
| Snyk Code | scans all .js source files |
| Snyk Container | scans Dockerfile and built image |
| Snyk IaC | scans k8s/ directory (deployment.yaml, service.yaml) |

---

## Repo Onboarding Steps

To onboard a new repository to this Snyk integration:

1. **Connect SCM**
   - In Snyk UI go to Settings → Integrations → GitHub
   - Ensure the GitHub App is installed and has access to the target repo

2. **Import the repo**
   - Go to Snyk Projects → Add Projects → GitHub
   - Select the repo
   - Click Add selected repositories

3. **Verify scan types detected**
   Confirm Snyk detects:
   - `package.json` → Open Source
   - Source files → Code
   - `Dockerfile` → Container
   - `k8s/*.yaml` → IaC

4. **Enable PR Checks**
   - Settings → Integrations → GitHub
   - Pull request status checks
   - Enable Open Source and Code Analysis

5. **Add GitHub Actions workflow**
   - Copy `.github/workflows/snyk.yml`
   - Add `SNYK_TOKEN` as repository secret under:
     GitHub Settings → Secrets → Actions

6. **Add branch protection**
   - GitHub repo Settings → Branches
   - Add rule for `main`

Enable:
- Require status checks to pass
- Add all 6 Snyk checks as required
- Enable "Do not allow bypassing"

---

## Threshold Configuration

| Scan Type | Fail Condition | Severity Threshold |
|---|---|---|
| Snyk Open Source | New dependency with issues | High and Critical |
| Snyk Code | New code issues | High and Critical |
| Snyk Container | App layer vulnerabilities | High and Critical |
| Snyk IaC | Kubernetes misconfigurations | High and Critical |

Thresholds are defined in two places:

- **Snyk UI**
  - Settings → Integrations → GitHub
  - Pull request status checks

- **GitHub Actions**
  - `.github/workflows/snyk.yml`
  - via `--severity-threshold=high`

---

## PR Status Checks Reference

| Check Name | Source | Scan Type |
|---|---|---|
| `code/snyk (kelkaal)` | Snyk GitHub App | Snyk Code (SAST) |
| `security/snyk (kelkaal)` | Snyk GitHub App | Snyk Open Source |
| `Snyk Security Scans / Snyk Code (SAST)` | GitHub Actions | Snyk Code |
| `Snyk Security Scans / Snyk Container` | GitHub Actions | Container |
| `Snyk Security Scans / Snyk IaC` | GitHub Actions | IaC |
| `Snyk Security Scans / Snyk Open Source (SCA)` | GitHub Actions | Open Source |

All 6 are set as **Required** on the `main` branch protection rule.

---

## Demo: Buggy PR (PR #1)

**Branch:** `feature/vulnerable-changes`

**Purpose:** Demonstrates Snyk catching real vulnerabilities and blocking merge.

### Issues Introduced

| File | Issue | Snyk Product | Severity |
|---|---|---|---|
| `package.json` | `lodash@4.17.4` — CVE-2019-10744, CVE-2020-8203 | Open Source | High |
| `index.js` | `eval(req.query.cmd)` — Remote Code Execution | Code | High |
| `index.js` | Hardcoded `DB_PASSWORD` and `API_KEY` | Code | High |
| `k8s/deployment.yaml` | `privileged: true` | IaC | High |
| `k8s/deployment.yaml` | `runAsUser: 0` (root) | IaC | High |
| `k8s/deployment.yaml` | `allowPrivilegeEscalation: true` | IaC | High |
| `k8s/deployment.yaml` | Missing resource limits | IaC | Medium |
| `Dockerfile` | `node:14-alpine` (EOL base image) | Container | High |

**Result:** All 6 Snyk checks failed. Merge blocked. ❌

---

## Demo: Clean PR (PR #2)

**Branch:** `feature/security-fixes`

**Purpose:** Control case — demonstrates a clean PR passing all checks.

### Fixes Applied

| File | Fix |
|---|---|
| `package.json` | Removed `lodash`, upgraded `express` to `4.22.0` |
| `index.js` | Removed `eval()`, removed hardcoded secrets |
| `Dockerfile` | Upgraded to `node:22-alpine`, updated npm to latest |
| `k8s/deployment.yaml` | Set `privileged: false`, `runAsNonRoot: true`, `runAsUser: 1000`, added resource limits, disabled privilege escalation |

**Result:** All 6 Snyk checks passed. Merge allowed. ✅

---

## Triage Workflow

When a Snyk check fails on a PR:

1. Click **Details** next to the failing check on the PR
2. Review the vulnerability report
3. Note the CVE, severity, and fix advice
4. Fix the issue
5. Push the fix to the same branch
6. Checks re-run automatically

If a fix is not yet available:
- proceed to the Ignore/Exception process below

---

## Ignore / Exception Process

When a vulnerability cannot be immediately fixed:

1. Go to `app.snyk.io`
2. Open Projects
3. Find the affected project
4. Click the vulnerability
5. Click **Ignore**

Fill in:
- Reason
- Justification
- Expiry date

Recommended:
- maximum 30-day expiry

The ignore is logged in Snyk with:
- username
- timestamp
- justification

> Ignores must never be used to bypass Critical findings without documented approval.

---

## Repository Structure

```text
snyk-demo-app/
├── .github/
│   └── workflows/
│       └── snyk.yml
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
├── .gitignore
├── Dockerfile
├── README.md
├── SECURITY.md
├── index.js
├── package.json
└── package-lock.json
```

---

## Key Links

- Snyk Organisation:
  https://app.snyk.io/org/kelkaal

- GitHub Repository:
  https://github.com/Kelkaal/snyk-demo-app

- GitHub Actions:
  https://github.com/Kelkaal/snyk-demo-app/actions

- Branch Protection:
  https://github.com/Kelkaal/snyk-demo-app/settings/branches

- Snyk Integration Settings:
  https://app.snyk.io/org/kelkaal/manage/integrations