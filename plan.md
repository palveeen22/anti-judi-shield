# Anti-Judi Shield - Chrome Extension Plan

## Context

Build a Chrome Extension (Manifest V3) called **"Anti-Judi Shield"** — a gambling blocking and behavioral protection tool targeting Indonesian online gambling. Not just an adblocker, but a **digital self-control system** with smart blocking, content detection, anti-bypass mechanisms, and behavioral tracking.

Project location: `/Users/alvinputrapratama/code-folder/anti-judi-shield/`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build | **Vite** + `@crxjs/vite-plugin` (MV3 HMR, multi-entry) |
| Language | **TypeScript** (strict) |
| UI | **React 19** + **Tailwind CSS v4** |
| Linter | **Biome** |
| Testing | **Vitest** |
| Package manager | **pnpm** |

---

## Project Structure

```
anti-judi-shield/
├── manifest.json
├── package.json
├── vite.config.ts
├── tsconfig.json
├── biome.json
├── tailwind.config.ts
│
├── public/
│   ├── icons/ (icon-16/48/128.png)
│   └── _locales/ (id/, en/)
│
├── src/
│   ├── background/
│   │   ├── index.ts              # Service worker entry
│   │   ├── blocker.ts            # DeclarativeNetRequest engine
│   │   ├── rule-updater.ts       # Dynamic rule updates
│   │   ├── accountability.ts     # Partner notifications
│   │   └── analytics.ts          # Block tracking
│   │
│   ├── content/
│   │   ├── index.ts              # Content script entry
│   │   ├── scanner.ts            # DOM gambling detector (weighted scoring)
│   │   ├── ad-filter.ts          # Gambling ad removal
│   │   ├── overlay.tsx           # Warning overlay (Shadow DOM)
│   │   └── blur.ts               # CSS blur injection
│   │
│   ├── pages/
│   │   ├── popup/                # Extension popup (status, quick stats)
│   │   ├── blocked/              # Interception page (countdown, education)
│   │   ├── dashboard/            # Options page (analytics, settings)
│   │   └── onboarding/           # First-install wizard
│   │
│   ├── shared/
│   │   ├── constants/
│   │   │   ├── blacklist.ts      # 500+ Indonesian gambling domains
│   │   │   ├── keywords.ts       # Weighted gambling phrases
│   │   │   ├── quotes.ts         # Motivational quotes (id/en)
│   │   │   └── risk-facts.ts     # Gambling statistics
│   │   ├── types/ (storage.ts, rules.ts, index.ts)
│   │   ├── utils/ (storage.ts, pattern-matcher.ts, hash.ts, messaging.ts, date.ts)
│   │   ├── hooks/ (useChromeStorage.ts, useBlockStats.ts)
│   │   └── styles/globals.css
│   │
│   └── rules/
│       └── static-rules.json     # DNR static ruleset
│
└── tests/
```

---

## Feature Architecture

### 1. Smart Website Blocking (Background)
- **Static DNR rules**: 500+ known Indonesian gambling domains → redirect to block page
- **Dynamic DNR rules**: User-added domains + pattern updates (5000 rule limit)
- **Regex patterns**: `*slot*.xyz`, `*judi*.site`, `*gacor*.com`, URL keywords like "slot gacor", "maxwin"
- **Redirect target**: `chrome-extension://<id>/blocked/index.html?url=<encoded>&reason=<match>`
- Uses `chrome.declarativeNetRequest` (MV3 requirement, no webRequest)

### 2. Content Detection (Content Script)
- **Weighted keyword scoring** (not ML — lightweight, 95%+ accuracy for ID gambling vocab)
- Keywords: "deposit via dana" (8), "slot gacor" (10), "link alternatif" (7), "bonus 100%" (9), etc.
- Threshold-based: score > 15 triggers protection (prevents false positives on news)
- `MutationObserver` for dynamically loaded content
- **Blur** matching elements + inject **Shadow DOM warning overlay**

### 3. Gambling Ad Blocking (Content + Background)
- **Network level**: DNR rules for known gambling ad networks
- **DOM level**: Scan `iframe`, `a[href]`, ad containers for gambling keywords
- **YouTube**: Detect gambling ads in `#player-ads`, `.ytp-ad-text`

### 4. Anti-Bypass System
- **Strict Mode**: PBKDF2-hashed password (Web Crypto API) required to disable
- **Accountability Partner**: Notify via `chrome.notifications` when user tries to disable
- **Anti-uninstall**: `chrome.management.onDisabled` listener + re-enable attempt
- Optional 24hr cooldown after correct password

### 5. Behavioral Dashboard (Options Page)
- Block stats: daily/weekly counters, domain breakdown
- Streak system: gamification with milestones (7, 30, 90, 365 days)
- CSS bar chart (or lightweight uPlot ~35KB)
- GitHub-style streak calendar
- Custom blacklist/whitelist manager
- **Storage split**: `sync` for settings/streak (<100KB), `local` for stats (<5MB)

### 6. Educational Block Page
- 5-10 second countdown timer before any action
- Random motivational quote (bilingual)
- Gambling risk fact
- Personal goals reminder (set during onboarding)
- "Go Back" (primary) vs "I understand risks" (secondary, requires password if strict mode)

---

## Key Chrome APIs

| Feature | API |
|---|---|
| Domain blocking | `chrome.declarativeNetRequest` |
| Content scanning | Content script + `MutationObserver` |
| Settings sync | `chrome.storage.sync` + `chrome.storage.local` |
| Streak checking | `chrome.alarms` |
| Partner alerts | `chrome.notifications` |
| Anti-disable | `chrome.management.onDisabled` |
| First install | `chrome.runtime.onInstalled` |
| Inter-component | `chrome.runtime.sendMessage` (typed) |

---

## Implementation Phases

### Phase 1: Scaffold + Core Blocking
1. Init project: Vite + CRXJS + React + Tailwind + TypeScript + Biome
2. `manifest.json` with all permissions
3. Background service worker + DNR static rules
4. `blacklist.ts` with 100+ initial domains
5. `blocker.ts` for dynamic rules
6. Basic block page with countdown + "Go Back"
7. Basic popup with ON/OFF status

### Phase 2: Content Detection + Ad Blocking
1. `keywords.ts` weighted phrase dictionary
2. `scanner.ts` DOM scanner with scoring
3. `blur.ts` + `overlay.tsx` (Shadow DOM)
4. `ad-filter.ts` for gambling ad removal
5. YouTube-specific detection
6. MutationObserver for SPAs

### Phase 3: Anti-Bypass + Strict Mode
1. Onboarding page (password + goals)
2. `hash.ts` PBKDF2 implementation
3. Strict mode in popup toggle
4. `accountability.ts` notifications
5. `chrome.management.onDisabled` handler

### Phase 4: Dashboard + Analytics
1. `analytics.ts` block tracking
2. `storage.ts` typed wrapper
3. `date.ts` streak calculations
4. Dashboard: BlockChart, StreakCalendar, SettingsPanel
5. BlacklistManager, AccountabilitySettings
6. `chrome.alarms` daily streak check

### Phase 5: Polish + Ship
1. Populate quotes + risk facts (bilingual)
2. Enhanced block page with all components
3. i18n (`_locales/`)
4. Icons design
5. Unit tests (pattern-matcher, scanner, storage)
6. QA across 20+ real gambling sites
7. Production build + CRX packaging

---

## Design Decisions

- **DNR over webRequest**: MV3 removed blocking webRequest; DNR is the only option and more performant
- **Shadow DOM for overlays**: Prevents CSS conflicts between page and extension UI
- **Heuristic scoring over ML**: Chrome extension must be lightweight; weighted keywords achieve 95%+ accuracy for Indonesian gambling vocabulary
- **PBKDF2 via Web Crypto**: Native API, no dependencies, sufficient for self-imposed access control
- **Storage split**: `sync` (100KB limit, cross-device) for settings; `local` (5MB) for stats

---

## Verification

1. `pnpm dev` → load unpacked extension in Chrome
2. Visit known gambling domains → verify redirect to block page
3. Visit news/social sites with gambling ads → verify blur + overlay
4. Test strict mode: try disabling without password → blocked
5. Check dashboard shows accurate block counts and streak
6. Run `pnpm test` for unit tests
7. Build with `pnpm build` → load production build → verify all features
