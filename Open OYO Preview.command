#!/bin/zsh
cd -- "$(dirname -- "$0")"
if command -v node >/dev/null 2>&1; then
  node scripts/preview.mjs
elif [[ -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
  "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" scripts/preview.mjs
else
  echo 'Please install Node.js 22 from nodejs.org, then open this launcher again.'
  read -r '?Press Return to close.'
fi
