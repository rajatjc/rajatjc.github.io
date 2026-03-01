# rajatjc.github.io

Personal portfolio and resume, hosted on GitHub Pages.

## Repository structure

- **`site/`** – Live site (Next.js static export). This folder is deployed to the root of https://rajatjc.github.io.
- **`old-portfolio/`** – Backup of the previous HTML/CSS/JS portfolio. Available at https://rajatjc.github.io/old-portfolio/ if you need to revert or reference it.

## Updating the live site

1. Build the Next.js portfolio locally: `cd portfolio && npm run build`
2. Copy the contents of `portfolio/out/` into this repo’s `site/` folder.
3. Commit and push to `main`. GitHub Actions will deploy `site/` to GitHub Pages.

## GitHub Pages

- **Source:** GitHub Actions (see `.github/workflows/deploy-pages.yml`).
- The workflow deploys the `site/` directory on every push to `main`.
- In repo **Settings → Pages**, set **Source** to **GitHub Actions** (not “Deploy from a branch”) so this workflow is used.
