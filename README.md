# rajatjc.github.io

Personal portfolio and resume, hosted on GitHub Pages.

## Repository structure

| Folder / file   | Purpose |
|-----------------|--------|
| **`site/`**     | Built Next.js portfolio (index.html, _next/, resume.pdf, etc.). Deployed to the root of https://rajatjc.github.io. |
| **`old-portfolio/`** | Backup of the previous HTML/CSS/JS site. Available at https://rajatjc.github.io/old-portfolio/. |
| **`README.md`** | This file. |

## Updating the live site

1. Build your Next.js portfolio locally: `npm run build`
2. Copy the contents of `out/` into this repo’s **`site/`** folder (replace existing files).
3. Commit and push to `main`. GitHub Actions will deploy `site/` and `old-portfolio/` to GitHub Pages.

## GitHub Pages

- **Source:** GitHub Actions (`.github/workflows/deploy-pages.yml`) — deploys on every push to `main`.
- In **Settings → Pages**, set **Source** to **GitHub Actions**.
