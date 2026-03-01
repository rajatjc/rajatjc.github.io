# rajatjc.github.io

Personal portfolio and resume, hosted on GitHub Pages.

## Repository structure

- **Repo root** – Live site files (`index.html`, `_next/`, `resume.pdf`, etc.). Deployed to https://rajatjc.github.io.
- **`old-portfolio/`** – Backup of the previous HTML/CSS/JS portfolio. Available at https://rajatjc.github.io/old-portfolio/.

## Updating the live site

1. Build the Next.js portfolio locally (from your portfolio project): `npm run build`
2. Copy the contents of `portfolio/out/` into this repo’s **root** (replace existing files).
3. Commit and push to `main`. GitHub Actions will deploy to GitHub Pages.

## GitHub Pages

- **Source:** GitHub Actions (see `.github/workflows/deploy-pages.yml`). The workflow deploys the repo root (excluding `.git` and `.github`) on every push to `main`.
- In repo **Settings → Pages**, set **Source** to **GitHub Actions** so the workflow is used.
