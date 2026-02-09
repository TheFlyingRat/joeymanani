# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static portfolio site for joeymanani.com. No build system or framework — plain HTML/CSS/JS served via Cloudflare Pages. All assets are served from `cdn.theflyingrat.com/assets/joeymanani/assets/` (mirrored from the `assets/` directory here). Quotes on the landing page are fetched from `api.theflyingrat.com/siteinfo/quotes`.

## Development

Open any HTML file directly in a browser or use VS Code Live Server. No install or build step. When editing JS/CSS, note that production serves the `.min.` versions from CDN — the unminified source files in `assets/` are the ones to edit.

## Architecture

### Page Flow

The site is a multi-page static site with directory-based routing:

1. **`/` (index.html)** — Landing page with a fake Linux terminal boot sequence. Animates shell commands, then types a random quote, then auto-redirects to `/home`. Pressing any key skips straight to `/home`.
2. **`/home/`** — Main menu. Arrow keys / Tab / mouse navigate a vertical link list with a `>` arrow indicator. Enter / click fades out and navigates to the selected page.
3. **`/developer/`, `/about/`, `/experience/`** — Content pages with Prev/Next nav buttons (handled by `menuHandler.js`). Left/right arrow keys switch between nav buttons.
4. **`/404.html`** — Error page that reuses the terminal theme, shows a shell-style error animation, then presents a retro dialog box with "Go back" / "Go home" options.

### FOUC Prevention

Every page sets `body { opacity: 0.001 }` in an inline `<style>`, then `window.onload` sets opacity to 1 (with a 600ms CSS transition on content pages). The landing page does this via JS after the animation sequence starts.

### Audio System (`functions.js`)

Dual-thread audio playback (two `Audio` elements, picks whichever is idle). Sound files are fetched from CDN as MP3, converted to base64 and cached in localStorage. Six sounds: `click`, `success`, `alert`, `enter`, `backspace`, `button`. `playSound(name)` plays from the in-memory blob URL cache.

### Terminal Shell (`shell.js` + `commands.js`)

The landing page and 404 page have a fake terminal. `shell.js` captures keydown events globally and implements a command line with history (arrow up/down). Commands are dispatched by checking `window[command]` — so command functions must be global. `commands.js` defines `ls` and `cat` (which navigates to the path if it exists).

### Navigation Interaction Patterns

- **Home page (`home.js`)**: Keyboard nav with ArrowUp/ArrowDown/Tab/Enter across `.content a` links. The `"Joey Manani"` heading text is split into individual `<span>`s on load for letter animation.
- **Content pages (`menuHandler.js`)**: Two-button Prev/Next nav with Left/Right arrow keys and Enter to navigate. Logo click goes to `/home`.
- Both use an `audioEnabled` flag that gets set to `false` on navigation to prevent sounds playing during the fade-out transition.

### CSS Structure

- `main.css` — Global styles, dark theme (#121212 bg, #ddd text), responsive breakpoints at 920px and 919px
- `fonts.css` — Custom icon font (`icon-right`, `icon-mail`, `icon-plus`, `icon-fast-fw`)
- Per-page CSS files: `home.css`, `developer.css`, `about.css`, `experience.css`, `projects.css`, `error.css`
- `loadingPage.css` — Terminal/shell styling for landing and 404 pages
- Base CSS from CDN: `normalize.min.css` + `skeleton.min.css` (Skeleton grid framework)

### Content Security Policy

The `_headers` file locks scripts and styles to `cdn.theflyingrat.com` + `'unsafe-inline'`. If adding external scripts from a new domain, the CSP in `_headers` must be updated.

## Key Constraints

- Assets in production are served from `cdn.theflyingrat.com`, not locally — test with the CDN URLs or adjust paths for local dev
- Command functions in `commands.js` must be on `window` scope (no modules) since `shell.js` dispatches via `window[command]`
- The landing page birthday calculation uses epoch `1148169600000` (May 21, 2006) — this drives the `??.??.??` version strings
