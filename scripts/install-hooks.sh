#!/bin/sh
# Install git hooks (e.g. commit-msg to strip Made-with: Cursor).
cd "$(git rev-parse --show-toplevel)" || exit 1
cp scripts/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
echo "Hooks installed. .git/hooks/commit-msg will strip Made-with: Cursor from commit messages."
