# rajatjc.github.io

Personal portfolio and resume, hosted on GitHub Pages.

## Repository structure

| Folder / file   | Purpose |
|-----------------|--------|
| **`site/`**     | Source of the portfolio (Next.js, static export). Not deployed itself. |
| **Root**        | Built portfolio (index.html, _next/, resume.pdf, og.png, etc.), generated from `site/`. Deployed to the root of https://rajatjc.github.io. |
| **`old-portfolio/`** | Backup of the previous HTML/CSS/JS site. Available at https://rajatjc.github.io/old-portfolio/. |
| **`README.md`** | This file. |

## Editing the site

- All text (experience, projects, skills, links) is in `site/app/data.ts`. Keep it in sync with the résumé.
- Interactive pieces live in `site/app/components/`: the cursor, the hero terminal, the lsm-kv playground and the Loonie Ledger simulator.
- Replace the résumé at `site/public/resume.pdf`.
- `site/tools/og.html` is the source of the link-preview image (`og.png`); the command to regenerate it is at the top of that file.

## Updating the live site

```sh
cd site
npm install            # first time only
npm run dev            # preview at http://localhost:3000
npm run publish-site   # build, then copy site/out/ to the repo root
```

Then commit and push to `main`. GitHub Actions deploys the root files and `old-portfolio/` to GitHub Pages.
`publish-site` only replaces files it published last time (listed in `site/.published.json`), so nothing else at the root is touched.

## GitHub Pages

- **Source must be GitHub Actions** (`.github/workflows/deploy-pages.yml`) so the site is deployed at the root. If you see unstyled text (“RS”, “AboutSkillsExperience…”), **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**, not “Deploy from a branch”.
- After changing the source or pushing, wait for the workflow to finish under the **Actions** tab, then hard-refresh the site (Ctrl+Shift+R) or try in an incognito window.
