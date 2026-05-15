# Pairly — Web

React + Vite frontend for Pairly, a swipe-based matchmaking platform with real-time chat.

See the project-level [`README.md`](../README.md) for the full overview, features, architecture, and deployment notes.

## Stack
React 19, Redux Toolkit, React Router v7, Tailwind CSS v4, daisyUI, `@react-spring/web` + `@use-gesture/react`, Socket.IO client, Axios, Vite, Lucide icons.

## Run locally
```bash
npm install
npm run dev          # http://localhost:5173
```

The backend must be running on `http://localhost:7777`. Vite proxies `/api` and `/socket.io` to it — see `vite.config.js`.

## Build
```bash
npm run build        # output: dist/
```
