#!/bin/bash
export PATH="/Users/du/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

PROJECT_DIR="/Users/du/Documents/codespace/ABCgame"
cd "$PROJECT_DIR" || exit 1

# Check if server is already responding
if ! curl -s -m 1 "http://localhost:4173/" >/dev/null 2>&1; then
    # Kill any stale process on port 4173 just in case
    lsof -ti :4173 | xargs kill -9 2>/dev/null || true
    
    # Start Vite preview server in background
    nohup /Users/du/.local/bin/node "$PROJECT_DIR/node_modules/.bin/vite" preview --port 4173 --host 0.0.0.0 > /tmp/abcgame_launch.log 2>&1 &
    
    # Wait until server responds with 200 OK
    for i in {1..25}; do
        if curl -s -m 1 "http://localhost:4173/" >/dev/null 2>&1; then
            break
        fi
        sleep 0.2
    done
fi

# Open in default browser
open "http://localhost:4173/"
