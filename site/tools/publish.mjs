// Copies the static export (site/out) to the repo root, which GitHub Actions deploys to Pages.
// Files from the previous publish are listed in .published.json and removed first, so stale
// build chunks don't pile up. Nothing else at the root is touched.
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(site, "..");
const out = join(site, "out");
const manifest = join(site, ".published.json");
const protectedPaths = new Set([".git", ".github", ".gitignore", ".nojekyll", "README.md", "site", "old-portfolio", "scripts"]);

if (!existsSync(out)) throw new Error("site/out not found. Run `next build` first.");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [relative(out, p)];
  });

const previous = existsSync(manifest) ? JSON.parse(readFileSync(manifest, "utf8")) : [];
for (const file of previous) {
  if (protectedPaths.has(file.split("/")[0])) continue;
  rmSync(join(root, file), { force: true });
}
// Drop directories the previous publish left empty.
for (const dir of new Set(previous.map((f) => f.split("/")[0]))) {
  const p = join(root, dir);
  if (!protectedPaths.has(dir) && existsSync(p) && statSync(p).isDirectory() && walk(p).length === 0) rmSync(p, { recursive: true });
}

const files = walk(out);
for (const file of files) cpSync(join(out, file), join(root, file));
writeFileSync(manifest, JSON.stringify(files.sort(), null, 2) + "\n");
console.log(`Published ${files.length} files to the repo root.`);
