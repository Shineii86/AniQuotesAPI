# Contributing to Anime Quotes API

Thank you for your interest in contributing to Anime Quotes API! We welcome contributions from everyone, regardless of your experience level. This guide will help you get started with contributing to our project.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Ways to Contribute](#ways-to-contribute)
3. [Adding New Quotes](#adding-new-quotes)
4. [Translating Quotes](#translating-quotes)
5. [Reporting Issues](#reporting-issues)
6. [Feature Requests](#feature-requests)
7. [Code Contributions](#code-contributions)
8. [Pull Request Guidelines](#pull-request-guidelines)
9. [Code of Conduct](#code-of-conduct)
10. [Community](#community)

## Getting Started <a name="getting-started"></a>
1. **Fork** the repository on GitHub
2. **Clone** your forked repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/anime-quotes-api.git
   ```
3. **Install dependencies**:
   ```bash
   cd anime-quotes-api
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b your-feature-branch
   ```

## Ways to Contribute <a name="ways-to-contribute"></a>
You can contribute in several ways:
- 🌟 Add new anime quotes
- 🌐 Translate existing quotes
- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🛠 Fix issues and improve code

## Adding New Quotes <a name="adding-new-quotes"></a>
To add new quotes:

1. Open the appropriate JSON file:
   - English quotes: `data/quotes.json`
   - Other languages: `data/languages/[language-code].json`
   
2. Add your quote using this format:
   ```json
   {
     "id": 123,
     "quote": "Your quote here",
     "anime": "Anime Title",
     "character": "Character Name",
     "language": "en"
   }
   ```
   
3. Guidelines:
   - Use the next available ID (check the last ID in the file and increment by 1)
   - Verify the anime title and character name are accurate
   - Keep quotes authentic (from actual anime)
   - Maintain consistent formatting
   - Add only one quote per pull request (unless they're related)

## Translating Quotes <a name="translating-quotes"></a>
To translate existing quotes:

1. Find the quote you want to translate in `data/quotes.json`
2. Open or create the appropriate language file in `data/languages/`
3. Add the translated quote with the **same ID** as the original
   ```json
   {
     "id": 123,
     "quote": "Translated quote here",
     "anime": "Anime Title (in target language if applicable)",
     "character": "Character Name",
     "language": "target-language-code"
   }
   ```
4. Language codes should follow [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) standards

## Reporting Issues <a name="reporting-issues"></a>
When reporting issues:
1. Check if the issue already exists
2. Use a clear, descriptive title
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details

Example issue format:
```
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional context**
Add any other context about the problem here.
```

## Feature Requests <a name="feature-requests"></a>
Suggest new features by:
1. Explaining the feature clearly
2. Describing why it would be valuable
3. Suggesting implementation approaches if possible
4. Providing examples of similar implementations

## Code Contributions <a name="code-contributions"></a>
1. Follow existing code style and patterns
2. Write clear commit messages
3. Add tests for new functionality
4. Update documentation when needed
5. Keep changes focused on a single purpose

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run tests: `npm test`
4. Lint code: `npm run lint`

## Pull Request Guidelines <a name="pull-request-guidelines"></a>
1. Keep PRs focused on a single feature/fix
2. Reference related issues in your PR description
3. Ensure all tests pass
4. Update documentation if needed
5. Use a descriptive title and detailed description
6. Allow edits from maintainers

After submitting your PR:
1. A maintainer will review your code
2. You may be asked to make changes
3. Once approved, your PR will be merged

## Code of Conduct <a name="code-of-conduct"></a>
We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) Code of Conduct. Please:
- Be respectful and inclusive
- Use welcoming language
- Accept constructive criticism gracefully
- Focus on what's best for the community

Unacceptable behavior includes:
- Harassment or discrimination
- Insults or derogatory comments
- Publishing others' private information

## Community <a name="community"></a>
Join our community:
- [GitHub Discussions](https://github.com/Shineii86/AniQuotesAPI/discussions)
- [Telegram Channel](https://telegram.me/MaximXAPI) (coming soon)

---

Thank you for contributing to Anime Quotes API! Your contributions help make this project better for everyone in the anime community. 🎉
