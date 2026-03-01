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

- **Source must be GitHub Actions** (`.github/workflows/deploy-pages.yml`) so the site is deployed at the root. If you see unstyled text (“RS”, “AboutSkillsExperience…”), **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**, not “Deploy from a branch”.
- After changing the source or pushing, wait for the workflow to finish under the **Actions** tab, then hard-refresh the site (Ctrl+Shift+R) or try in an incognito window.
