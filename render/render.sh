#!/bin/sh
# Reference render of the meme design with Hyperframes (design-time only).
# The shipped entry program is main.ts (Node stdlib, no dependencies);
# this script reproduces the Hyperframes reference frame it was checked against.
#
# Requires: hyperframes CLI 0.9.88 + Chrome Headless Shell
#   (npx hyperframes browser ensure) and the project in ../hf-design/.
# Usage: sh render/render.sh   (run from the repository root)
set -e
cd "$(dirname "$0")/../../hf-design"
export HYPERFRAMES_CACHE_DIR="$PWD/../.hfcache"
export HYPERFRAMES_EXTRACT_CACHE_DIR="$PWD/../.hfcache"
npx -y hyperframes@0.9.88 check
npx -y hyperframes@0.9.88 snapshot --at 0
