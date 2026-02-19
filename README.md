# Japhařy System

<p align="center">
  <strong>A modern, full-featured Project Management Dashboard</strong>
</p>

<p align="center">
  Built with vanilla HTML, CSS & JavaScript — no frameworks. Dark mode, live analytics, calendar, and more.
</p>

<p align="center">
  <a href="https://pixellinx.co.tz/">Pixellinx</a> •
  <a href="#features">Features</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#getting-started">Getting Started</a>
</p>

---

## Overview

**Japhařy System** is a professional project management dashboard UI with a clean, modern design. It started as a college project and has been enhanced into a fully functional single-page application: search, add/edit/delete projects, live analytics tied to your project progress, calendar view, settings, dark mode, and persistent data in the browser.

---

## Screenshots

Screenshots are loaded from `Assets/screenshot/`. Use any of the options below.

### Option A — One main preview

Add a single image as **`Assets/screenshot/preview.png`**:

![Japhařy System](Assets/screenshot/preview.png)

### Option B — Multiple views

Add separate images for each section and they will show in the table:

| Home — Projects & Messages | Analytics — Live from dashboard |
|:--------------------------:|:--------------------------------:|
| ![Dashboard Home](Assets/screenshot/home.png) | ![Analytics](Assets/screenshot/analytics.png) |

| Calendar | Settings |
|:--------:|:--------:|
| ![Calendar](Assets/screenshot/calendar.png) | ![Settings](Assets/screenshot/settings.png) |

**Suggested filenames:** `preview.png`, `home.png`, `analytics.png`, `calendar.png`, `settings.png` (PNG or JPG both work).

---

## Features

### Dashboard (Home)
- **Project cards** — Grid or list view, with progress bars, due dates, and participant placeholders
- **Add project** — Modal to create projects (name, subtitle, progress %, days left)
- **Project actions** — Update progress or delete from the card menu (⋮)
- **Live stats** — In Progress, Upcoming, and Total counts update automatically
- **Search** — Filter projects and messages by name or content
- **Personal messages** — Star conversations; order and state persist in `localStorage`
- **Theme** — Light/dark mode with persisted preference

### Analytics
- **Hero metrics** — Total projects, completed this month, in progress (synced with Home)
- **Projects overview** — Bar chart **live from your dashboard**: each bar = one project, height = progress %
- **This month summary** — Completed, in progress, upcoming counts
- Chart and stats styled to match the rest of the app

### Calendar
- **Month view** — Navigate with previous/next; today highlighted
- **Hash routing** — Shareable URL (e.g. `#calendar`)

### Settings
- **Appearance** — Explains theme persistence
- **Profile** — Signed-in user (Japhařy)
- **Data** — Notes that projects and starred messages are stored locally

### UX & polish
- **Hash-based pages** — `#home`, `#analytics`, `#calendar`, `#settings` for direct links and back/forward
- **Keyboard** — `Ctrl+K` to focus search, `Escape` to close modals/notifications
- **Toasts** — Feedback for add/update/delete actions
- **Notifications dropdown** — Bell icon with sample notifications
- **Responsive** — Layout adapts to smaller screens; messages panel becomes overlay on narrow view
- **Footer** — Credit and link to Pixellinx

---

## Tech stack

| Layer   | Tech |
|--------|------|
| Markup | HTML5 |
| Style  | CSS3 (custom properties, flexbox, grid), [Normalize](https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css), [DM Sans](https://fonts.googleapis.com/css?family=DM+Sans:400,500,700) |
| Logic  | Vanilla JavaScript (no dependencies) |
| Data   | `localStorage` (theme, starred messages) |

---

## Getting started

### Prerequisites
- A modern browser (Chrome, Firefox, Safari, Edge)
- Optional: a local server (e.g. [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)) if you want to avoid file-protocol limitations

### Run locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Web-level-4-main.git
   cd Web-level-4-main
   ```

2. **Open the app**
   - Double-click `index.html`, or  
   - Serve the folder (e.g. `npx serve .` or VS Code Live Server) and open the URL (e.g. `http://localhost:3000`)

3. **Use the dashboard**
   - **Home** — Add projects with the **+** button, switch list/grid view, search, star messages
   - **Analytics** — View live project stats and the progress bar chart
   - **Calendar** — Use arrows to change month
   - **Settings** — Read about theme and data
   - Toggle **dark mode** with the moon icon in the header

### Project structure

```
.
├── index.html          # Single-page app (all views)
├── style.css           # Global + page-specific styles
├── script.js           # App logic, routing, chart, persistence
├── Assets/
│   ├── screenshot/     # Add screenshots here for the README
│   │   ├── home.png
│   │   ├── analytics.png
│   │   ├── calendar.png
│   │   └── settings.png
│   └── 1.jpg           # Profile image (Japhařy)
├── README.md
└── ...
```

---

## License

This project is open source. Use and adapt it as you like; attribution is appreciated.

---

## Author

**Coded by japhary from [Pixellinx](https://pixellinx.co.tz/)**

---

<p align="center">
  <sub>Japhařy System — Project Management Dashboard</sub>
</p>
