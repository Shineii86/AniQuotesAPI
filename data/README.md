# Quotes Database

A curated collection of high-quality quotes in JSON format for developers and content creators.

> [!IMPORTANT]  
> **Copyright & Attribution Requirements**  
> This dataset represents significant curation effort. If you use this JSON file in your project, you **must**:
> - Provide visible attribution in your application/documentation
> - Include a link back to this repository
> - Maintain copyright notices in all derivatives

> [!CAUTION]
> **Consequences of Non-Compliance**  
> Failure to provide proper attribution may result in:
> - Legal action for copyright violation
> - Public naming in violation reports
> - Removal rights exercised via DMCA takedowns

> [!TIP]
> **Recommended Attribution Text**   
> Place in:  
> - Website footers  
> - Documentation credits  
> - About dialogs  
> - Project READMEs
```json
"Quote data sourced from [AniQuotesAPI](https://github.com/Shineii86/AniQuotesAPI) by [Shinei Nouze](https://github.com/Shineii86)  - [GitHub URL](https://github.com/Shineii86/AniQuotesAPI)"
```

> [!NOTE]
> **License Clarification**  
> This dataset is provided under **Creative Commons Attribution-NonCommercial 4.0**:
> - [x] Permitted: Personal/commercial projects with attribution
> - [x] Permitted: Modifications and derivatives
> - [ ] Prohibited: Reselling raw data
> - [ ] Prohibited: Attribution removal

## Usage Examples
```javascript
// Proper attribution in code
const quoteData = require('./quotes.json');
console.log(`Quotes provided by ${quoteData._metadata.author}`);
```

## Dataset Structure
`quotes.json` contains:
```json
{
  "_metadata": {
    "copyright": "Copyright © 2025 Shinei Nouzen. All rights reserved.",
    "license": "CC BY-NC 4.0",
    "attribution_required": true
  },
  "quotes": [
    {
      "quote": "People's dreams... have no ends!",
      "anime": "One Piece",
      "character": "Marshall D. Teach",
      "language": "en"
    }
  ]
}
```

<div align="center">
  
[![License: CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc/4.0)

</div>
