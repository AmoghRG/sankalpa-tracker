# 🚩 Sankalpa Tracker (संकल्प)

A modern, distraction-free **Sadhana & Tapasya Journal** designed for spiritual practitioners to track sacred vows, mantra recitations, and daily discipline.

Live App: **[https://sankalpa-tracker.vercel.app](https://sankalpa-tracker.vercel.app/)**

---

## ✨ Features

- **🚩 Traditional Sadhana Presets**: Quick setup for popular spiritual disciplines:
  - **Hanuman Chalisa**: 100 recitations over 40 days
  - **Gayatri Mantra Japa**: 1008 morning recitations over 40 days
  - **Maha Mrityunjaya Mantra**: 108 recitations over 21 days
  - **Aditya Hrudayam Stotram**: 48 recitations in 48 days (1 Mandala)
  - **Vishnu Sahasranama**: 48 days of sacred chanting
  - **Bhagavad Gita**: 18 chapters in 18 days
  - **Custom Sankalpa**: Define your own personal vow, mantra, or discipline from scratch.

- **📿 Full-Screen Zen / Japa Counter**:
  - Distraction-free meditation mode with a sacred mandala tap ring.
  - 108-bead Mala counter with keyboard (`Spacebar`) and touch support.
  - Web Audio harmonic bell chime on bead count and 3-chord chord on Mala completion.
  - Mobile haptic vibration feedback (`navigator.vibrate`).

- **⚡ Multi-Chant & Mala Shortcuts**: Quick logging buttons for `+1`, `+3`, `+5`, `+11`, and `📿 108 (1 Mala)` with undo.

- **📅 Calendar Heatmap & Backfill**:
  - Monthly consistency calendar showing active Sankalpa dates and session counts.
  - Inspect timestamps for any day.
  - Backfill forgotten sessions with custom count and time.

- **📊 Sadhana Insights & Rhythm**:
  - Automatically categorizes recitations into sacred timings:
    - 🌅 **Morning / Brahma Muhurta** (4 AM – 12 PM)
    - ☀️ **Afternoon / Madhyahna** (12 PM – 5 PM)
    - 🪔 **Evening / Sandhya** (5 PM – 9 PM)
    - 🌙 **Night / Ratri** (9 PM – 4 AM)
  - 7-day activity bar chart with today highlighted in gold.
  - Average daily pace and consistency rate metrics.

- **🏆 Sankalpa Siddhi & Tapasya History**:
  - Formally seal and complete vows with dedication notes.
  - Archived history ledger of all fulfilled vows.
  - 1-click **"Start Cycle #2"** to begin subsequent rounds.
  - **📸 Downloadable Certificate**: Generates a high-definition 1200×800 digital certificate PNG with golden borders, completion stats, and sacred Sanskrit blessings.

- **📱 Progressive Web App (PWA)**:
  - Installable directly to your Home Screen on iPhone and Android as a full-screen, standalone app.

- **🔒 100% Private & Offline-First**:
  - All data is stored locally in your browser.
  - Complete JSON backup and restore capabilities.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **Audio**: Web Audio API (zero external audio files)
- **Graphics**: HTML5 Canvas API for high-resolution certificate rendering
- **Deployment**: Vercel

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/AmoghRG/sankalpa-tracker.git
cd sankalpa-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📜 License

MIT License. Designed with devotion for spiritual seekers worldwide.
