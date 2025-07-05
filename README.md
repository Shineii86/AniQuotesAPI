<p align="center"><img src="https://github.com/Shineii86/AniQuotesAPI/blob/main/assets/LogoSD.png" LOGO" width="200" height="200"/></p>

<h4 align="center">
    A Multilingual Anime Quotes API With Image Generation.
</h4>
<p align="center">
    <a href="https://"> Creator </a> •
    <a href=""> Documentation </a> •
    <a href=""> Organizations </a>
</p>

[![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://aniquotes.vercel.app)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)](CONTRIBUTING.md)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## 🚀 Features
- 🔀 Random, Anime, and Character Searchable Endpoints
- 🌍 Multilingual Support: English, Japanese, Hindi, and more
- 🖼️ Quote Image Generator: Beautiful PNGs with watermark, perfect for social media
- ⚡ Fast, Serverless Deployment (Vercel-ready)
- 👥 Community-Driven: Add your favorite anime quotes via Pull Requests
- 📜 Clean API Response with Developer Credit on Every Quote
- 🧠 Error Handling with HTTP Codes: 400, 404, 429, 500

## 📚 Use Case Examples
- 🎌 Build anime bots (Discord, Telegram, etc.)
- 🌈 Share quote cards on Instagram, X (Twitter), or Threads
- ✍️ Write fan blogs or anime content with embedded quotes
- 💬 Learn languages using multilingual quote responses
- 🧩 Create quote guessing games or character quizzes


## 📂 Project Structure
```bash
/
├── api/
│   ├── v1/
│   │   ├── random.js
│   │   ├── anime.js
│   │   └── character.js
│   ├── v2/
│   │   ├── languages.js
│   │   └── image.js
│   └── index.js
├── data/
│   ├── quotes.json
│   └── languages/
│       ├── en.json
│       ├── jp.json
│       └── hi.json
├── utils/
│   ├── helpers.js
│   ├── errors.js
│   └── imageGenerator.js
├── public/
│   └── images/
├── vercel.json
├── package.json
└── README.md
```

## 🚀 API Endpoints

### V1
| Endpoint | Params | Description |
|----------|--------|-------------|
| `/v1/random` | None | Random quote |
| `/v1/anime` | `?name=` | Quotes by anime |
| `/v1/character` | `?name=` | Quotes by character |

### V2
| Endpoint | Params | Description |
|----------|--------|-------------|
| `/v2/languages` | `?lang=&anime=&character=` | Multilingual quotes |
| `/v2/image` | `?id=&lang=` | Generate quote image |

## 🗿 Deploy Your Own API

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/AniQuotesAPI)

1. Click the Deploy button
2. Clone the repository
3. `npm install`
4. `vercel deploy`

## 🌻 Add New Quotes

1. Fork this repository
2. Add quotes to `data/quotes.json` or language-specific files:
```json
{
  "id": 123,
  "quote": "Your quote here",
  "anime": "Anime Title",
  "character": "Character Name",
  "language": "en"
}
```

3. Submit a Pull Request

## 🤝 Contribution Guide

We accept contributions in:
- Adding new quotes
- Translating existing quotes
- Improving documentation
- Enhancing API functionality

## 👀 Contributors

Thanks to these amazing people:

![Contributors](https://contrib.rocks/image?repo=Shineii86/AniQuotesAPI)

## 🪪 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
