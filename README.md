<div align="center"><a href="https://github.com/AniQuotes"><img src="https://github.com/Shineii86/AniQuotesAPI/blob/main/assets/LogoSD.png" LOGO" width="200" height="200"/></a>

[![AniQuotes Badge](https://img.shields.io/endpoint?url=https://aniquotesapi.vercel.app/api/badge)](https://aniquotesapi.vercel.app/api/badge)


*A Multilingual Anime Quotes API With Image Generation.*
    
<a href="https://github.com/Shineii86"> Creator </a> •
    <a href="https://github.com/AniQuotes/Documentation"> Documentation </a> •
    <a href="https://github.com/AniQuotes"> Organizations </a> • <a href="https://github.com/AniQuotes/Statistics"> Statistics </a>

[![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://aniquotesapi.vercel.app)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)](CONTRIBUTING.md)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

![Last Commit](https://img.shields.io/github/last-commit/Shineii86/AniQuotesAPI?style=for-the-badge)
![Repo Size](https://img.shields.io/github/repo-size/Shineii86/AniQuotesAPI?style=for-the-badge) [![GitHub Stars](https://img.shields.io/github/stars/Shineii86/AniQuotesAPI?style=for-the-badge)](https://github.com/Shineii86/AniQuotesAPI/stargazers) [![GitHub Forks](https://img.shields.io/github/forks/Shineii86/AniQuotesAPI?style=for-the-badge)](https://github.com/Shineii86/AniQuotesAPI/fork)
[![API Status](https://img.shields.io/website?down_color=lightgrey&down_message=offline&label=API%20Status&style=for-the-badge&up_color=green&up_message=online&url=https%3A%2F%2Faniquotesapi.vercel.app)](https://aniquotesapi.vercel.app)

</div>

<a href="https://github.com/Shineii86/AniPay">
<img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner1.png" alt="Banner">
</a>
  
## <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Activity/Sparkles.webp" alt="Sparkles" width="25" height="25" /> Features

- 🔀 Random, Anime, Character, and Full-Text Search Endpoints
- 🌍 Multilingual Support: English, Japanese, Hindi, and more
- 🖼️ Quote Image Generator: Beautiful PNGs with watermark, perfect for social media
- ⚡ Fast, Serverless Deployment (Vercel-ready)
- 📄 Pagination Support: `limit` and `offset` parameters on all list endpoints
- 👥 Community-Driven: Add your favorite anime quotes via Pull Requests
- 📜 Clean API Response with Developer Credit on Every Quote
- 🧠 Error Handling with HTTP Codes: 400, 404, 429, 500

## <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Objects/Books.webp" alt="Books" width="25" height="25" /> Use Case Examples
- 🎌 Build anime bots (Discord, Telegram, etc.)
- 🌈 Share quote cards on Instagram, X (Twitter), or Threads
- ✍️ Write fan blogs or anime content with embedded quotes
- 💬 Learn languages using multilingual quote responses
- 🧩 Create quote guessing games or character quizzes

<a href="https://github.com/Shineii86/AniPay">
<img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner2.png" alt="Banner">
</a>

## <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Objects/File%20Folder.webp" alt="File Folder" width="25" height="25" /> Project Structure
```bash
AniQuotesAPI
├── api/
│   ├── v1/
│   │   ├── random.js
│   │   ├── anime.js
│   │   ├── character.js
│   │   └── search.js
│   ├── v2/
│   │   ├── languages.js
│   │   └── image.js
│   ├── status.js
│   └── badge.js
├── data/
│   ├── quotes.json
│   └── languages/
│       ├── de.json
│       ├── es.json
│       ├── fr.json
│       ├── hi.json
│       ├── it.json
│       ├── jp.json
│       ├── ko.json
│       ├── pt.json
│       ├── ru.json
│       └── zh.json
├── fonts/
│   ├── Anime/
│   │   ├── AnimeAce.ttf
│   │   └── AnimeFont.ttf
│   ├── NotoSans/
│   │   ├── NotoSans-Regular.ttf
│   │   ├── NotoSans-Bold.ttf
│   │   ├── NotoSans-Italic.ttf
│   │   └── NotoSans-BoldItalic.ttf
│   └── NotoSansJP/
│       └── NotoSansJP-Regular.ttf
├── utils/
│   ├── config.js
│   ├── helpers.js
│   ├── errors.js
│   ├── imageGenerator.js
│   └── stats.js
├── public/
│   └── index.html
├── vercel.json
├── package.json
├── CHANGELOG.md
└── README.md
```

## <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Travel and Places/Rocket.webp" alt="Rocket" width="25" height="25" /> API Endpoints

### V1
| Endpoint | Params | Description |
|----------|--------|-------------|
| `api/v1/random` | None | Random quote |
| `api/v1/anime` | `?name=&limit=&offset=` | Quotes by anime |
| `api/v1/character` | `?name=&limit=&offset=` | Quotes by character |
| `api/v1/search` | `?q=&limit=&offset=` | Full-text search across quotes |

### V2
| Endpoint | Params | Description |
|----------|--------|-------------|
| `api/v2/languages` | `?lang=&anime=&character=&limit=&offset=` | Multilingual quotes |
| `api/v2/image` | `?id=&lang=` | Generate quote image |

<a href="https://github.com/Shineii86/AniPay">
    <img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner3.png" alt="Banner">
</a>

## <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Objects/Bomb.webp" alt="Bomb" width="25" height="25" /> Deploy Your Own API

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/aniquotesapi)

1. Click the Deploy button
2. Clone the repository
3. `npm install`
4. `vercel deploy`

## <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/People/Writing%20Hand.webp" alt="Writing Hand" width="25" height="25" /> Add New Quotes

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
<a href="https://github.com/Shineii86/AniPay">
    <img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner4.png" alt="Banner">
</a>

3. Submit a Pull Request

## <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/People/Handshake.webp" alt="Handshake" width="25" height="25" /> Contribution Guide

We accept contributions in:
- Adding new quotes
- Translating existing quotes
- Improving documentation
- Enhancing API functionality

## <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/People/Eyes.webp" alt="Eyes" width="25" height="25" /> Contributors

Thanks to these amazing people:

![Contributors](https://contrib.rocks/image?repo=Shineii86/AniQuotesAPI)

## <img src="https://raw.githubusercontent.com/Shineii86/AniEmojis/main/Objects/Identification%20Card.webp" alt="Identification Card" width="25" height="25" /> License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Symbols/Two%20Hearts.webp" alt="Two Hearts" width="25" height="25" /> Loved My Work?

<img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Animals%20and%20Nature/Star.webp" alt="Star" width="20" height="20" />&nbsp;[Give a star to this project](https://github.com/Shineii86/AniPay/) <br/>
<img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Animals%20and%20Nature/Cherry%20Blossom.webp" alt="Cherry Blossom" width="20" height="20" />&nbsp;[Follow me on GitHub](https://github.com/Shineii86/Shineii86)<br/>

> <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Smileys/Thinking%20Face.webp" alt="Thinking Face" width="20" height="20" /> Wondering where to get these animated emojis?
> [Visit here!](https://github.com/Shineii86/AniEmojis) You also should look around my other github repos. Maybe you'll find some cool useful stuff there.

<a href="https://github.com/Shineii86/AniPay">
<img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner6.png" alt="Banner">
</a>

## <img src="https://raw.githubusercontent.com/Shineii86/AniEmojis/refs/heads/main/Objects/Telephone.webp" alt="Telephone" width="25" height="25" /> Contact

<div align="center">
  
  *For inquiries or collaborations:*
     
[![Telegram Badge](https://img.shields.io/badge/-Telegram-2CA5E0?style=flat&logo=Telegram&logoColor=white)](https://telegram.me/Shineii86 "Contact on Telegram")
[![Instagram Badge](https://img.shields.io/badge/-Instagram-C13584?style=flat&logo=Instagram&logoColor=white)](https://instagram.com/ikx7.a "Follow on Instagram")
[![Pinterest Badge](https://img.shields.io/badge/-Pinterest-E60023?style=flat&logo=Pinterest&logoColor=white)](https://pinterest.com/ikx7a "Follow on Pinterest")
[![Gmail Badge](https://img.shields.io/badge/-Gmail-D14836?style=flat&logo=Gmail&logoColor=white)](mailto:ikx7a@hotmail.com "Send an Email")

  <sup><b>Copyright © 2025 <a href="https://telegram.me/Shineii86">Shinei Nouzen</a> All Rights Reserved</b></sup>

</div>
