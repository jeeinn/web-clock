# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based clock application optimized specifically for iPhone SE (320×568px) that turns retired iPhones into practical clock displays. This is a **pure HTML/CSS/JavaScript application** with no build process or dependencies.

## File Structure

```
web-clock/
├── index.html      # Main page structure - single-page app markup
├── style.css       # All styling with CSS variables for theming
├── script.js       # WebClock class managing all application logic
└── README.md       # User-facing documentation (Chinese)
```

## Development Commands

### Local Testing
```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx http-server -p 8080
```

Then visit `http://localhost:8080` or `http://YOUR_IP:8080` on your device.

### No Build Process
This is a static site - no compilation, bundling, or build steps required. Simply edit the files and refresh the browser.

## Architecture

### WebClock Class (script.js)

The entire application logic is encapsulated in the `WebClock` class with these key lifecycle methods:

- `init()` → `initializeApp()` - Entry point, called on DOMContentLoaded
- `cacheElements()` - Caches all DOM references once at startup
- `setupEventListeners()` - Binds all user interactions
- `applySettings()` - Applies saved settings to UI state
- `startClock()` / `stopClock()` - Time update loop (1-second interval)
- `setupWakeLock()` - Multi-tier screen wake lock system

#### Key Systems

**Settings Management:** Settings stored in `localStorage` under key `webClockSettings`. Default settings defined in `loadSettings()`.

**Theme System:** Three modes via `data-theme` attribute on `<body>`:
- `auto` - Checks system preference first, then falls back to time-based (6:00-18:00 = light)
- `light` / `dark` - Manual override

**Wake Lock:** Three-tier fallback strategy:
1. Modern Wake Lock API (`navigator.wakeLock.request('screen')`)
2. Hidden 1x1px video element playback (NoSleep.js technique)
3. 30-second DOM manipulation timer (last resort)

**Time Display:** Uses `toLocaleTimeString()` with configurable options for seconds display. Date uses `toLocaleDateString()`.

### CSS Architecture (style.css)

CSS variables drive theming - all colors and sizing controlled via `:root` and `[data-theme="..."]` selectors. Font sizes use viewport units (`vw`/`vh`) for responsive scaling on the 320×568px target.

#### Key Variables
- `--time-size`: Time display font size (default 20vw)
- `--date-size`: Date display font size (default 6vw)
- Theme colors: `--primary-bg`, `--text-color`, `--accent-color`, `--panel-bg`

#### Responsive Behavior
- Portrait (default): Vertical layout, time above date
- Landscape (`@media (orientation: landscape)`): Horizontal layout with time/date side-by-side
- iPhone SE optimized: `@media (max-width: 320px)` for the smallest target device

### HTML Structure (index.html)

Single-page app with:
- `.clock-container` - Flexbox centering for time/date displays
- `.settings-btn` - Fixed-position gear icon (top-right)
- `.settings-panel` - Slide-up modal with backdrop
- `.settings-backdrop` - Click-to-close overlay

## Important Constraints

1. **No external dependencies** - Pure vanilla JS, no frameworks
2. **No build process** - Direct file editing only
3. **iPhone SE target** - Primary optimization for 320×568px, but responsive
4. **24-hour time only** - No AM/PM, configurable seconds display
5. **Screen wake lock** - Critical feature for clock display use case
6. **iOS web app capable** - `<meta name="apple-mobile-web-app-capable" content="yes">` for full-screen when added to home screen

## Theme Modification

To change the auto theme switching time (default 6:00-18:00), edit `getAutoTheme()` in script.js:282-288:

```javascript
// Current: (hour >= 6 && hour < 18) ? 'light' : 'dark';
// Modify these hour boundaries as needed
```

## Wake Lock Debugging

The app logs extensive console messages about wake lock attempts. Check browser console for:
- `🔒 尝试启用 Wake Lock...` - Initial attempt
- `✅ Wake Lock API 启用成功` - Primary success
- `📹 视频防休眠方案已启动` - Fallback 1 active
- `⏱️ 定时器防休眠方案已启动` - Fallback 2 active
