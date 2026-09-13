# Brett's New Tab

A personal Chrome New Tab page with a clock, weather, web search, and shortcuts. Built as a lightweight Manifest V3 extension — no build step, no dependencies.

## Features

- **Greeting & clock** — time-aware "Good Morning/Afternoon/Evening, Brett" with a live 12-hour clock (AM/PM) and date in your local timezone
- **Weather** — current conditions for your chosen location (defaults to Hobart, Australia), with a °C/°F toggle and a 4-day mini forecast. Click the weather pill for a 5-day popup
- **Web search** — a search bar with a picker for Google, DuckDuckGo, YouTube, or Brave
- **Shortcuts** — a grid of tiles that auto-load each site's favicon; add, edit (right-click), or remove them as you like
- **Quick notes** — a slide-out scratchpad that saves automatically
- **Theming** — follows your system dark/light preference using a Catppuccin palette, with a soft blurred background
- **Keyboard shortcuts** — `/` focuses search, `1`–`9` open your tiles

## Install

1. Clone or download this repository
2. Open `chrome://extensions` in Google Chrome
3. Toggle **Developer mode** (top-right)
4. Click **Load unpacked** and select this folder
5. Open a new tab

## Usage

| Action | How |
| --- | --- |
| Change temperature unit | Click the `°C / °F` button on the weather pill |
| Change weather location | Click the `✎` button, then search or use your location |
| See the 5-day forecast | Click the weather pill |
| Add a shortcut | Click the `+ Add shortcut` button |
| Edit a shortcut | Right-click its tile |
| Remove a shortcut | Right-click → edit → or hover while in edit mode |
| Edit your name / emoji | Click the `⚙️` button (top-right) |
| Open quick notes | Click the `📝` button (top-right) |
| Focus search | Press `/` |
| Launch a tile | Press `1`–`9` |

All settings (shortcuts, name, emoji, notes, search engine, location, unit) are saved in `localStorage` and persist between sessions.

## Files

- `manifest.json` — extension manifest (Manifest V3)
- `newtab.html` — page structure
- `newtab.css` — styling and theme
- `newtab.js` — logic (clock, weather, search, shortcuts, notes)

## Weather data

Weather and geocoding are provided by [Open-Meteo](https://open-meteo.com/) (free, no API key required). Favicons are fetched from Google's favicon service.
