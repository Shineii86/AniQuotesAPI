<p align="center"><img src="https://github.com/Shineii86/AniQuotesAPI/blob/main/assets/LogoSD.png" LOGO" width="200" height="200"/></p>

<h4 align="center">
    A Multilingual Anime Quotes API With Image Generation.
</h4>
<p align="center">
    <a href="https://github.com/Shineii86"> Creator </a> •
    <a href="https://github.com/AniQuotes/Doumentation"> Documentation </a> •
    <a href="https://github.com/AniQuotes"> Organizations </a>
</p>

[![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://aniquotes.vercel.app)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)](CONTRIBUTING.md)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

![Last Commit](https://img.shields.io/github/last-commit/Shineii86/AniQuotesAPI?style=for-the-badge)
![Repo Size](https://img.shields.io/github/repo-size/Shineii86/AniQuotesAPI?style=for-the-badge) [![GitHub Stars](https://img.shields.io/github/stars/Shineii86/AniQuotesAPI?style=for-the-badge)](https://github.com/Shineii86/AniQuotesAPI/stargazers) [![GitHub Forks](https://img.shields.io/github/forks/Shineii86/AniQuotesAPI?style=for-the-badge)](https://github.com/Shineii86/AniQuotesAPI/fork)

<a href="https://github.com/Shineii86/AniPay">
<img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner1.png" alt="Banner">
</a>
  
## ⭐ Features
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

<a href="https://github.com/Shineii86/AniPay">
<img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner2.png" alt="Banner">
</a>

## 📂 Project Structure
```bash
AniQuotesAPI
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
| `api/v1/random` | None | Random quote |
| `api/v1/anime` | `?name=` | Quotes by anime |
| `api/v1/character` | `?name=` | Quotes by character |

### V2
| Endpoint | Params | Description |
|----------|--------|-------------|
| `api/v2/languages` | `?lang=&anime=&character=` | Multilingual quotes |
| `api/v2/image` | `?id=&lang=` | Generate quote image |

<a href="https://github.com/Shineii86/AniPay">
    <img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner3.png" alt="Banner">
</a>

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
<a href="https://github.com/Shineii86/AniPay">
    <img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner4.png" alt="Banner">
</a>

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
