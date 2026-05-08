> [!NOTE]
> **This project has been archived and is no longer actively maintained.**
>
> After 10 months of development as a solo project, this repository is being archived due to limited community support and the unsustainable workload of maintaining multilingual quote data as a single developer. The API may continue to work as long as the Vercel deployment remains active, but no new features, bug fixes, or quote additions will be made.
>
> Thank you to everyone who starred, forked, or used the API. Feel free to fork and continue development on your own.

---

<div align="center">

# 💬 AniQuotesAPI

**Free Multilingual Anime Quotes API with Image Generation**

![Vercel](https://img.shields.io/badge/Deployed%20On-Vercel-black?logo=vercel&style=flat-square)
![Version](https://img.shields.io/badge/Version-3.0.0-89b4fa?style=flat-square&labelColor=1e1e2e)
![Node](https://img.shields.io/badge/Node.js-≥18-339933?logo=node.js&style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Languages](https://img.shields.io/badge/Languages-10-f5c2e7?style=flat-square&labelColor=1e1e2e)
![Status](https://img.shields.io/badge/API-Stable-a6e3a1?style=flat-square&labelColor=1e1e2e)

[![API Status](https://img.shields.io/website?down_color=f38ba8&down_message=offline&label=API&style=for-the-badge&up_color=a6e3a1&up_message=online&url=https%3A%2F%2Faniquotesapi.vercel.app)](https://aniquotesapi.vercel.app)
![Last Commit](https://img.shields.io/github/last-commit/Shineii86/AniQuotesAPI?style=for-the-badge)
![Repo Size](https://img.shields.io/github/repo-size/Shineii86/AniQuotesAPI?style=for-the-badge)
[![Stars](https://img.shields.io/github/stars/Shineii86/AniQuotesAPI?style=for-the-badge)](https://github.com/Shineii86/AniQuotesAPI/stargazers)
[![Forks](https://img.shields.io/github/forks/Shineii86/AniQuotesAPI?style=for-the-badge)](https://github.com/Shineii86/AniQuotesAPI/fork)

> A free, serverless API delivering anime quotes in **10 languages** with auto-translation, beautiful image generation, full-text search, and external provider aggregation.

<br>

[🚀 Quick Start](#-quick-start) · [📡 API Docs](#-api-endpoints) · [🖼️ Image Generator](#️-image-generator) · [🌍 Languages](#-supported-languages) · [🤝 Contributing](#-contributing)

</div>

---

## 📊 At a Glance

<table>
<tr>
<td align="center" width="25%"><strong>📡 800+ Quotes</strong><br><sub>Curated collection<br>Community-driven<br>Always growing</sub></td>
<td align="center" width="25%"><strong>⚡ 7 Endpoints</strong><br><sub>Random · Anime · Character<br>Search · Languages<br>Image · Status</sub></td>
<td align="center" width="25%"><strong>🌍 10 Languages</strong><br><sub>EN · JP · KO · ZH · HI<br>ES · FR · DE · PT · RU · IT<br>Auto-translated via LibreTranslate</sub></td>
<td align="center" width="25%"><strong>🖼️ Image Gen</strong><br><sub>Beautiful PNG cards<br>18 gradient themes<br>Custom fonts & watermarks</sub></td>
</tr>
</table>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### ⚡ Core
- **Random, Anime, Character** endpoints with pagination
- **Full-text search** across quotes, anime, and characters (`/v1/search`)
- **External provider aggregation** — Animechan API + local data with deduplication
- **Smart caching** — in-memory TTL cache for all external API calls
- **Graceful fallback** — local data when providers are unavailable

</td>
<td width="50%">

### 🌍 Multilingual
- **Auto-translation** via LibreTranslate (free, open-source)
- **10 supported languages** — EN, JP, KO, ZH, HI, ES, FR, DE, PT, RU, IT
- **Pre-translated local data** used when available, auto-translate as fallback
- **24-hour translation cache** to avoid redundant API calls
- **Self-hosted LibreTranslate** support via environment variables

</td>
</tr>
<tr>
<td width="50%">

### 🖼️ Image Generation
- **Beautiful PNG quote cards** with gradient backgrounds
- **18 curated gradient themes** — warm, vibrant, anime-inspired
- **Auto-sizing fonts** — shrinks for long quotes, expands for short ones
- **Glass card overlay** with rounded corners and drop shadow
- **Watermark bar** with API attribution

</td>
<td width="50%">

### 🚀 Deployment
- **Zero-config** Vercel deployment
- **Serverless functions** — scales automatically
- **CORS enabled** — works from any frontend
- **~50KB** total codebase, no heavy dependencies
- **Free forever** — no API keys required for basic usage

</td>
</tr>
</table>

---

## 🗞️ Data Sources

| Source | Type | Description |
|--------|------|-------------|
| **Local Database** | JSON | 800+ curated English quotes with 10 language translations |
| [**Animechan API**](https://animechan.io/) | External | Community anime quotes — aggregated with 1-hour caching |

> External providers are tried first; local data is the fallback. Results are deduplicated by quote text.

---

## 🏗️ Architecture

**Request Flow**

| Stage | Component | Description |
|:-----:|-----------|-------------|
| 1 | **Client** | Browser, app, or `curl` sends request |
| 2 | **Vercel Edge** | Routes request, applies CORS headers |
| 3 | **Cache Check** | In-memory TTL cache — hit = instant response |
| 4 | **Provider Manager** | Tries Animechan API, merges with local data |
| 5 | **Deduplicate** | Removes duplicate quotes across sources |
| 6 | **Translate** | Auto-translates if non-English requested and no local translation |
| 7 | **Respond** | Paginate, format → JSON / PNG image |

**Modules**

| Module | File | Purpose |
|--------|------|---------|
| Provider Manager | `utils/providers/index.js` | Aggregates all quote sources |
| Animechan Provider | `utils/providers/animechan.js` | Fetches from Animechan API |
| Translator | `utils/translator.js` | LibreTranslate auto-translation |
| Cache | `utils/cache.js` | In-memory TTL response cache |
| Image Generator | `utils/imageGenerator.js` | Canvas-based PNG generation |
| Config | `utils/config.js` | Shared metadata and `buildMeta()` |
| Helpers | `utils/helpers.js` | Data loading, filtering, pagination |
| Stats | `utils/stats.js` | Quote statistics generator |

---

## 📡 API Endpoints

### `GET /v1/random`

Returns a random anime quote from local data or external providers.

```bash
curl "https://aniquotesapi.vercel.app/v1/random"
```

<details>
<summary>📄 Example Response</summary>

```json
{
  "status": "success",
  "data": {
    "id": 42,
    "quote": "People's dreams... have no ends!",
    "anime": "One Piece",
    "character": "Marshall D. Teach",
    "language": "en",
    "source": "local"
  },
  "meta": {
    "creator": "Shinei Nouzen",
    "github": "https://github.com/Shineii86",
    "timestamp": "2026-05-08T07:00:00.000Z"
  }
}
```
</details>

---

### `GET /v1/anime`

Get quotes from a specific anime. Merges results from external providers and local data.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | `string` | — | Anime name (required) |
| `limit` | `1-20` | `3` | Max quotes to return |
| `offset` | `≥0` | `0` | Pagination offset |

```bash
curl "https://aniquotesapi.vercel.app/v1/anime?name=naruto&limit=5"
```

---

### `GET /v1/character`

Get quotes said by a specific character across all sources.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | `string` | — | Character name (required) |
| `limit` | `1-20` | `3` | Max quotes to return |
| `offset` | `≥0` | `0` | Pagination offset |

```bash
curl "https://aniquotesapi.vercel.app/v1/character?name=goku"
```

---

### `GET /v1/search`

Full-text search across all quotes by text, anime name, or character name.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | `string` | — | Search query (required) |
| `limit` | `1-20` | `5` | Max results |
| `offset` | `≥0` | `0` | Pagination offset |

```bash
curl "https://aniquotesapi.vercel.app/v1/search?q=believe+in+yourself"
```

---

### `GET /v2/languages`

Get quotes in any supported language. Uses pre-translated data when available, auto-translates via LibreTranslate otherwise.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `lang` | `string` | — | Language code (required) |
| `anime` | `string` | — | Filter by anime name |
| `character` | `string` | — | Filter by character name |
| `limit` | `1-20` | `3` | Max quotes |
| `offset` | `≥0` | `0` | Pagination offset |

```bash
curl "https://aniquotesapi.vercel.app/v2/languages?lang=jp&anime=naruto"
curl "https://aniquotesapi.vercel.app/v2/languages?lang=es&limit=10"
```

---

### `GET /v2/image`

Generate a beautiful PNG image with quote text. Supports three modes.

| Param | Description |
|-------|-------------|
| `id` | Quote ID (local data mode) |
| `quote` + `anime` + `character` | Inline quote data mode |
| _(none)_ | Random quote image mode |
| `lang` | Language code (default: `en`) |

```bash
# By local ID
curl "https://aniquotesapi.vercel.app/v2/image?id=1" -o quote.png

# Inline quote data
curl "https://aniquotesapi.vercel.app/v2/image?quote=Believe+it&anime=Naruto&character=Naruto" -o quote.png

# Random quote image
curl "https://aniquotesapi.vercel.app/v2/image" -o random.png
```

---

### `GET /status`

API health check, quote statistics, supported languages, and active providers.

```bash
curl "https://aniquotesapi.vercel.app/status"
```

<details>
<summary>📄 Example Response</summary>

```json
{
  "api": "AniQuotes API",
  "version": "3.0.0",
  "status": "alive",
  "health": { "status": "operational", "uptime": 12345.678, "node": "v20.x" },
  "stats": {
    "totalQuotes": 800,
    "quotesByLanguage": { "en": 800, "jp": 800, "es": 800 },
    "supportedLanguages": ["en", "jp", "ko", "zh", "hi", "es", "fr", "de", "pt", "ru", "it"]
  },
  "providers": [{ "name": "animechan", "type": "external" }],
  "features": {
    "externalProviders": true,
    "autoTranslation": true,
    "imageGeneration": true,
    "pagination": true,
    "fullTextSearch": true
  }
}
```
</details>

---

## 🖼️ Image Generator

The image generator creates beautiful PNG quote cards with:

- **18 curated gradient pairs** — warm, vibrant, anime-inspired color schemes
- **Glass card overlay** with rounded corners, drop shadow, and border glow
- **Auto-sizing fonts** — 28px to 40px based on quote length
- **Decorative quote mark** watermark in the background
- **Dedicated watermark bar** with API attribution
- **Random font selection** — Noto Sans (serif) or Anime Ace (display)
- **Noise texture overlay** for visual depth
- **Unicode curly quotes** (`""`) for proper typography

**Supported fonts:**

| Font | Style | Use Case |
|------|-------|----------|
| Noto Sans Bold | Clean sans-serif | Default for English quotes |
| Noto Sans Italic | Elegant italic | Attribution text |
| Noto Sans JP Bold | Japanese sans-serif | Japanese quotes |
| Anime Ace | Anime display font | Random 35% chance for variety |

---

## 🌍 Supported Languages

| Code | Language | Status |
|------|----------|--------|
| `en` | English | ✅ Primary (800+ quotes) |
| `jp` | Japanese | ✅ Pre-translated |
| `ko` | Korean | ✅ Pre-translated |
| `zh` | Chinese | ✅ Pre-translated |
| `hi` | Hindi | ✅ Pre-translated |
| `es` | Spanish | ✅ Pre-translated |
| `fr` | French | ✅ Pre-translated |
| `de` | German | ✅ Pre-translated |
| `pt` | Portuguese | ✅ Pre-translated |
| `ru` | Russian | ✅ Pre-translated |
| `it` | Italian | ✅ Pre-translated |

> Missing a language? Request it via [GitHub Issues](https://github.com/Shineii86/AniQuotesAPI/issues) or submit a translation PR.

---

## 🚀 Quick Start

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/AniQuotesAPI)

### Local Development

```bash
git clone https://github.com/Shineii86/AniQuotesAPI.git
cd AniQuotesAPI && npm install && npm run dev
# → http://localhost:3000
```

---

## 🔧 Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `LIBRETRANSLATE_URL` | `https://libretranslate.com` | Custom LibreTranslate instance URL |
| `LIBRETRANSLATE_API_KEY` | _(none)_ | API key for LibreTranslate (if required) |

> **Tip**: For production use, self-host [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) for unlimited translations without rate limits.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js ≥ 18 |
| **HTTP** | Vercel Serverless Functions |
| **Canvas** | @napi-rs/canvas (image generation) |
| **Translation** | LibreTranslate API |
| **External Data** | Animechan API |
| **Caching** | In-memory TTL cache |

---

## 📁 Project Structure

```
AniQuotesAPI/
├── api/                        # Vercel serverless functions
│   ├── v1/
│   │   ├── random.js           # Random quote
│   │   ├── anime.js            # Quotes by anime
│   │   ├── character.js        # Quotes by character
│   │   └── search.js           # Full-text search
│   ├── v2/
│   │   ├── languages.js        # Multilingual + auto-translate
│   │   └── image.js            # PNG image generation
│   ├── status.js               # Health & statistics
│   └── badge.js                # Shields.io badge endpoint
├── data/
│   ├── quotes.json             # 800+ English quotes
│   └── languages/              # Pre-translated quotes (10 files)
├── fonts/                      # Custom fonts for image generation
│   ├── Anime/                  # Anime Ace, AnimeFont
│   ├── NotoSans/               # Regular, Bold, Italic, BoldItalic
│   └── NotoSansJP/             # Japanese variant
├── utils/                      # Core logic
│   ├── providers/
│   │   ├── index.js            # Provider manager (aggregator)
│   │   └── animechan.js        # Animechan API provider
│   ├── cache.js                # In-memory TTL cache
│   ├── config.js               # Shared metadata & buildMeta()
│   ├── helpers.js              # Data loading, filtering, pagination
│   ├── errors.js               # Standardized error responses
│   ├── translator.js           # LibreTranslate auto-translation
│   ├── imageGenerator.js       # Canvas-based PNG generator
│   └── stats.js                # Quote statistics
├── public/
│   ├── index.html              # Landing page
│   ├── tos.html                # Terms of Service
│   └── privacy.html            # Privacy Policy
├── vercel.json                 # Vercel routing & headers
├── package.json
├── CHANGELOG.md
└── README.md
```

---

## 🤝 Contributing

### Add New Quotes

1. Fork the repository
2. Add quotes to `data/quotes.json`:
```json
{
  "id": 802,
  "quote": "Your favorite quote here",
  "anime": "Anime Title",
  "character": "Character Name",
  "language": "en"
}
```
3. Submit a Pull Request

### Translate Existing Quotes

1. Open the target language file in `data/languages/` (e.g., `fr.json`)
2. Add translated quotes with the same ID as the English original
3. Submit a Pull Request

### Add a New External Provider

1. Create `utils/providers/newprovider.js`:
```javascript
async function getRandom() { /* returns { quote, anime, character, language } or null */ }
async function getByAnime(name) { /* returns quote[] */ }
async function getByCharacter(name) { /* returns quote[] */ }
module.exports = { getRandom, getByAnime, getByCharacter, name: 'newprovider' };
```
2. Register in `utils/providers/index.js` → `providers` array
3. Test and submit a PR

---

## 📄 License

[MIT](LICENSE) © [Shinei Nouzen](https://github.com/Shineii86)

---

## 🙏 Acknowledgments

| Source | About |
|--------|-------|
| [Animechan](https://animechan.io/) | Community anime quotes API |
| [LibreTranslate](https://libretranslate.com/) | Free, open-source translation API |
| [Noto Sans](https://fonts.google.com/noto) | Google's font family for all languages |
| [Anime Ace](https://www.dafont.com/anime-ace.font) | Anime-style display font |

---

<div align="center">

**Built with ❤️ for the anime community**

[![Telegram](https://img.shields.io/badge/-Telegram-2CA5E0?style=flat&logo=Telegram&logoColor=white)](https://telegram.me/Shineii86)
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Shineii86)
[![Instagram](https://img.shields.io/badge/-Instagram-C13584?style=flat&logo=Instagram&logoColor=white)](https://instagram.com/ikx7.a)
[![Gmail](https://img.shields.io/badge/-Gmail-D14836?style=flat&logo=Gmail&logoColor=white)](mailto:ikx7a@hotmail.com)

⭐ [Star this repo](https://github.com/Shineii86/AniQuotesAPI) · 🐛 [Report a bug](https://github.com/Shineii86/AniQuotesAPI/issues) · 💡 [Request a feature](https://github.com/Shineii86/AniQuotesAPI/issues)

</div>
