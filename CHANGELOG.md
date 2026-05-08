# Changelog

All notable changes to this project will be documented in this file.

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
