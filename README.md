# Global Positive Notes Exchange

A 3D interactive experience where users send anonymous positive messages to random locations on Earth.

## 🌍 Features

- **Epic 3D Globe** - Powered by react-globe.gl with smooth camera controls
- **Arc Animations** - Watch notes travel as glowing projectiles across the globe
- **Glassmorphism UI** - Premium frosted-glass aesthetic inspired by Google Research
- **Real-time Updates** - See notes landing and accumulating worldwide
- **Geolocation** - Notes originate from your location (or random if denied)

## 🚀 Quick Start

### Option 1: StackBlitz (Recommended - No Install)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/YOUR_USERNAME/global-positive-notes)

### Option 2: Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

- **Next.js 14** - React framework
- **React Three Fiber** via react-globe.gl - 3D rendering
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## 🎨 Design Inspiration

Inspired by [Google Research Language Explorer](https://sites.research.google/languages/language-explorer):
- Point-cloud globe architecture
- Fresnel rim lighting for atmospheric glow
- High-damping camera controls for cinematic feel
- Glassmorphism UI overlays

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Design tokens & utilities
│   ├── layout.tsx       # Root layout with SEO
│   └── page.tsx         # Main page composition
├── components/
│   ├── GlobeScene.tsx   # 3D globe with arcs & points
│   ├── NoteInput.tsx    # Glassmorphism input
│   ├── Header.tsx       # Top navigation
│   └── ActiveNotes.tsx  # Flying/landed notes display
└── store/
    └── notesStore.ts    # Zustand state management
```

## License

MIT
