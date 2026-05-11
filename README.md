# HI-FI Prototype — HCI Project

An interactive hi-fi prototype built with React + Vite, simulating a tablet-based assistant interface for Italian public health services (Sanità pubblica). The prototype features a dual-panel layout: the left panel shows a guided assistant with contextual highlights, and the right panel is the interactive screen.

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

---

## How to Run

1. Open a terminal and navigate to the project folder:

```bash
cd hi-fi_proto_hci
```

2. Install dependencies (only needed the first time):

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and go to the local URL shown in the terminal (usually `http://localhost:5173`).



---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Dev server & bundler |
| Lucide React | Icons |
| CSS-in-JS (inline styles) | Styling |

---

## Notes

- No backend is required — all data is mocked locally.
- The prototype is designed for a **tablet screen** (1180×820px) and scales automatically to fit the browser window.
