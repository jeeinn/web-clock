# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A responsive web-based clock application optimized for iPhone SE (320×568px) while supporting devices from mobile phones to desktop displays. Turns retired iPhones, iPads, or any device into practical clock displays. This is a **pure HTML/CSS/JavaScript application** with no build process or dependencies.

## File Structure

```
web-clock/
├── index.html      # Main page structure - single-page app markup
├── style.css       # All styling with CSS variables and responsive design
├── script.js       # WebClock class managing all application logic
├── README.md       # User-facing documentation (Chinese)
└── CLAUDE.md       # This file - developer guide
```

## Development Commands

### Local Testing
```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx http-server -p 8080

# PHP
php -S localhost:8080
```

Visit `http://localhost:8080` on your computer, or `http://YOUR_COMPUTER_IP:8080` on mobile devices (same WiFi network required).

### Testing on Mobile Devices

1. **Start local server** on your computer
2. **Find your computer's IP**:
   - macOS: System Preferences > Network
   - Windows: Settings > Network & Internet > Properties
   - Linux: `ip addr show` or `ifconfig`
3. **Connect mobile device** to the same WiFi
4. **Visit in mobile browser**: `http://YOUR_IP:8080`

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
- `toggleFullscreen()` - Fullscreen mode toggle (v1.2.0)
- `setupWakeLock()` - Multi-tier screen wake lock system

#### Key Systems

**Settings Management:** Settings stored in `localStorage` under key `webClockSettings`. Default settings defined in `loadSettings()`.

**Theme System:** Three modes via `data-theme` attribute on `<body>`:
- `auto` - Checks system preference first, then falls back to time-based (6:00-18:00 = light)
- `light` / `dark` - Manual override

**Fullscreen (v1.2.0):** Uses standard Fullscreen API with webkit prefix fallback. Monitors fullscreen state changes via `fullscreenchange` and `webkitfullscreenchange` events.

**Wake Lock:** Three-tier fallback strategy:
1. Modern Wake Lock API (`navigator.wakeLock.request('screen')`)
2. Hidden 1x1px video element playback (NoSleep.js technique)
3. 30-second DOM manipulation timer (last resort)

**Time Display:** Uses `toLocaleTimeString()` with configurable options for seconds display. Date uses `toLocaleDateString()`.

### CSS Architecture (style.css)

CSS variables drive theming - all colors and sizing controlled via `:root` and `[data-theme="..."]` selectors. v1.2.0 uses modern CSS features for responsive design.

#### Key Variables
- `--time-size`: Time display font size using `clamp(3rem, 18vw, 8rem)` for responsive scaling
- `--date-size`: Date display font size using `clamp(1rem, 5vw, 2.5rem)`
- Theme colors: `--primary-bg`, `--text-color`, `--accent-color`, `--panel-bg`

#### Responsive Design (v1.2.0)

7-level media query system:
1. **Small phones** (≤320px) - iPhone SE priority
2. **Medium phones** (375-414px) - iPhone 6/7/8/X/11/12
3. **Large phones** (414-768px) - Plus/Pro Max
4. **Tablets** (768-1024px) - iPad mini/iPad
5. **Desktop** (≥1024px) - Full-size browsers
6. **Landscape mode** - All devices, horizontal layout
7. **Ultra-wide landscape** - Special ratio optimization

#### Typography

Tabular numbers enforced for stable width:
```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum" 1;
```

### HTML Structure (index.html)

Single-page app with:
- `.clock-container` - Flexbox centering for time/date displays
- `.action-buttons` - Container for fullscreen and settings buttons (v1.2.0)
- `.fullscreen-btn` - Fullscreen toggle button (v1.2.0)
- `.settings-btn` - Fixed-position gear icon (top-right)
- `.settings-panel` - Slide-up modal with backdrop
- `.settings-backdrop` - Click-to-close overlay

## Important Constraints

1. **No external dependencies** - Pure vanilla JS, no frameworks
2. **No build process** - Direct file editing only
3. **Responsive first** - Optimized for iPhone SE but scales to all devices
4. **24-hour time only** - No AM/PM, configurable seconds display
5. **Screen wake lock** - Critical feature for clock display use case
6. **iOS web app capable** - `<meta name="apple-mobile-web-app-capable" content="yes">` for full-screen when added to home screen

## Theme Modification

To change the auto theme switching time (default 6:00-18:00), edit `getAutoTheme()` in script.js:

```javascript
// Line 272-289: getAutoTheme() method
// Default: (hour >= 6 && hour < 18) ? 'light' : 'dark';
// Modify these hour boundaries as needed
```

## Wake Lock Debugging

The app logs extensive console messages about wake lock attempts. Check browser console for:
- `🔒 尝试启用 Wake Lock...` - Initial attempt
- `✅ Wake Lock API 启用成功` - Primary success
- `📹 视频防休眠方案已启动` - Fallback 1 active
- `⏱️ 定时器防休眠方案已启动` - Fallback 2 active

## Responsive Testing Checklist

When making layout changes:
- [ ] iPhone SE (320×568px) - Priority target
- [ ] iPhone 6/7/8 (375×667px)
- [ ] iPhone X/11/12 (375×812px)
- [ ] iPad (768×1024px)
- [ ] Desktop (1920×1080px)
- [ ] Landscape orientation on all devices
- [ ] Both light and dark themes
- [ ] With and without seconds display
- [ ] Settings panel open/closed
