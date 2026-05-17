# Pairly — Web

React + Vite frontend for **Pairly**, a swipe-based matchmaking platform with real-time chat.

> 📖 See the [main project README](https://github.com/Shreyansh163/pairly) for the full overview, screenshots, architecture, and deployment notes.

**Companion repo:** [`pairly-backend`](https://github.com/Shreyansh163/pairly-backend)

---

## Stack
React 19, Redux Toolkit, React Router v7, Tailwind CSS v4, daisyUI, `@react-spring/web` + `@use-gesture/react` (swipe gestures), Socket.IO client, Axios, Vite, Lucide icons.

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

The backend must be running at `http://localhost:7777`. Vite proxies `/api` and `/socket.io` to it — see `vite.config.js`.

## Build

```bash
npm run build        # output: dist/
```

## Project structure

```
src/
├── components/      # Login, Feed, UserCard, ChatWindow, Messages, …
├── utils/           # Redux store, slices, socket client, constants
└── App.jsx          # Router setup
```
