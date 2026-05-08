# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2026-05-08

### Added
- **External Provider System** (`utils/providers/`) — Aggregates quotes from external APIs alongside local data
  - **Animechan Provider** (`utils/providers/animechan.js`) — Fetches quotes from Animechan API (api.animechan.io) with 1-hour response caching
  - **Provider Manager** (`utils/providers/index.js`) — Orchestrates multiple providers with deduplication, merging, and fallback to local data
- **Auto-Translation Service** (`utils/translator.js`) — On-demand translation via LibreTranslate
  - Translates English quotes to any supported language when no pre-translated local data exists
  - 24-hour translation cache to avoid redundant API calls
  - Supports self-hosted LibreTranslate via `LIBRETRANSLATE_URL` env var
  - Supports API key auth via `LIBRETRANSLATE_API_KEY` env var
- **Response Cache** (`utils/cache.js`) — In-memory TTL cache with `getOrCompute` pattern for all external API calls
- **Inline Image Generation** — `/v2/image` now accepts `?quote=&anime=&character=` for generating images from any quote (not just local IDs), plus random mode when no params given
- **Source tracking** — API responses now include `sources` field (e.g., `["animechan", "local"]`) and `translated`/`translatedBy` metadata
- **Provider health info** — `/status` endpoint now lists active providers and feature flags
- **Terms of Service page** (`/tos`) — legal page matching AniNewsAPI's premium design system
- **Privacy Policy page** (`/privacy`) — privacy policy with data collection table and third-party service list
- **TOS/Privacy rewrites** in `vercel.json` for clean `/tos` and `/privacy` URLs

### Changed
- **Homepage redesign** — complete overhaul matching AniNewsAPI's design system (Space Grotesk font, ambient orb backgrounds, glassmorphism cards, terminal preview, scroll-reveal animations, sticky header, responsive mobile nav)
- **Image Generator v2** (`utils/imageGenerator.js`) — complete rewrite:
  - Glass card overlay with rounded corners and shadow
  - Auto-sizing fonts (shrinks for long quotes)
  - Decorative opening quote mark watermark
  - Dedicated watermark bar with semi-transparent background
  - 18 curated gradient pairs (up from 15)
  - Subtle noise texture overlay for depth
  - Support for italic Noto Sans font
  - Proper Unicode curly quotes (\u201C \u201D)
- **Version bumped** from `2.6.0` to `3.0.0` — major version bump due to provider architecture
- **`/v1/random`** now tries external providers first, falls back to local data
- **`/v1/anime`** and **`/v1/character`** merge results from external providers + local data with deduplication
- **`/v2/languages`** auto-translates when pre-translated local data is insufficient
- **`/v2/image`** supports three modes: by ID, inline quote data, or random
- **README.md** — updated features list, project structure, and endpoint documentation
- **Homepage** — updated badge text, endpoint descriptions, and image endpoint params

## [2.6.0] - 2026-05-08

### Added
- **Full-text search endpoint** (`/v1/search?q=`) — search across quote text, anime names, and character names
- **Pagination support** — `limit` (max 20) and `offset` parameters on `/v1/anime`, `/v1/character`, `/v1/search`, and `/v2/languages`
- **Shared config module** (`utils/config.js`) — centralized creator metadata and `buildMeta()` helper to eliminate hardcoded meta objects across all endpoints
- **`getRandomItems` helper** — proper Fisher-Yates shuffle replacing biased `sort(() => 0.5 - Math.random())`
- **`paginate` helper** — reusable pagination logic with `{ items, total, offset, limit, hasMore }` response shape
- **`searchQuotes` helper** — case-insensitive multi-field search across quote, anime, and character fields
- **CHANGELOG.md** — this file, tracking all changes going forward

### Fixed
- **Typo in `random.js`** — `telegran.me` corrected to `telegram.me`
- **Broken homepage rewrite** — removed `/ → /api/home.js` rewrite from `vercel.json` (file never existed; homepage is served from `public/index.html`)
- **Module format inconsistency** — `badge.js` converted from ESM (`export default`) to CJS (`module.exports`) to match all other API files

### Changed
- **Version bumped** from `2.5.0` to `2.6.0` in `package.json`
- **Status endpoint** now reports version `2.6.0`
- **README.md** — updated project structure to reflect actual files, added search endpoint docs, added pagination params to endpoint table, added `config.js` to utils listing
- **Homepage** — added search endpoint card to the API documentation section
- **All API endpoints** refactored to use `buildMeta()` from shared config instead of inline metadata objects
- **`anime.js` and `character.js`** now use shared `getRandomItems` instead of local duplicates
- **`stats.js`** now uses `buildMeta()` for consistent metadata
