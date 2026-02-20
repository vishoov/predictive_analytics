# 🩺 Urodynamics Admin Panel

A React admin portal for managing urodynamic study data — patients, diagnostic statistics, test reports, and review/verification workflows.

---

## 📋 Description

This is the client-side application for a urodynamics diagnostic center. It includes a login flow, role-based routing, an admin dashboard, diagnostics analytics, report management, and a review queue.

Key screens:

- 🏠 Dashboard with summary metrics (patients, tests, pending reviews, completion rate).
- 🔬 Diagnostics statistics with per-disease counts and percentages.
- 📄 Reports listing with filters, pagination, and per-patient disease chips.
- 👤 Individual patient report view with demographics and study metadata.
- ✅ Reviews queue to manage report verification status.
- 🔐 Login and role-based access control.

---

## ⚙️ Notable techniques

- 📌 Persistent left sidebar via CSS [`position: fixed`](https://developer.mozilla.org/en-US/docs/Web/CSS/position) with a full-height layout shell.
- 💊 Status pills and metric tiles using CSS [`flexbox`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex) and [`align-items`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) to keep badges vertically centred.
- 📊 Dense tables with text overflow controls via [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space) and [`text-overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow) to keep patient IDs readable.
- 🎨 Gradient headers and elevated cards using [`linear-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient) and [`box-shadow`](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow).
- 🔲 Responsive quick-action grids with [`grid-template-columns`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) and [`flex-wrap`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap).
- 🛡️ Route protection split across [`PrivateRoutes.jsx`](./src/utils/PrivateRoutes.jsx) (authentication) and [`RoleBasedRoutes.jsx`](./src/utils/RoleBasedRoutes.jsx) (admin vs. user separation).
- 🗂️ Centralised auth state via React Context API (see [`authContext.jsx`](./src/context/authContext.jsx)).
- 🌐 Shared Axios instance with interceptors in [`axios.utils.jsx`](./src/utils/axios.utils.jsx) for consistent API auth headers and error handling.
- ✨ Button interaction feedback using [`:hover`](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) and [`transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition).

---

## 📦 Libraries and tools

| Tool | Purpose | Link |
|------|---------|------|
| ⚛️ React | UI framework | <https://react.dev/> |
| ⚡ Vite | Build tooling and dev server | <https://vitejs.dev/> |
| 🔀 React Router | Client-side routing | <https://reactrouter.com/> |
| 🌐 Axios | HTTP client with interceptor support | <https://axios-http.com/> |
| 📈 Recharts | Analytics and disease stat charts | <https://recharts.org/> |
| 🖼️ Lucide React | Icon set used throughout the UI | <https://lucide.dev/> |
| 🔤 Inter | Primary UI typeface (Google Fonts) | <https://fonts.google.com/specimen/Inter> |
| 🔍 ESLint | Linting, configured via [`eslint.config.js`](./eslint.config.js) | <https://eslint.org/> |
| 🚀 Vercel | Deployment target via [`vercel.json`](./vercel.json) | <https://vercel.com/> |

---

## 🗂️ Project structure

```
📁 Client
├── 📁 public/              # Static assets served as-is
├── 📁 src/
│   ├── 📁 components/      # Feature-scoped UI components
│   │   ├── 📁 dashboard/   # Sidebar, navbar, summary tiles
│   │   ├── 📁 diagnostics/ # Disease stats and analytics charts
│   │   ├── 📁 reports/     # Report list, detail view, new report form
│   │   ├── 📁 reviews/     # Review queue and individual review form
│   │   └── 📁 users/       # User management UI
│   ├── 📁 context/         # React Context providers (auth state)
│   ├── 📁 pages/           # Top-level route components
│   ├── 📁 utils/           # Route guards, Axios instance, analytics helpers
│   ├── 📄 App.jsx          # Root component and route definitions
│   └── 📄 main.jsx         # App entry point
├── 📄 index.html
├── ⚙️  vite.config.js
├── ⚙️  vercel.json
└── 📝 README.md
```

- 🧩 [`src/components/`](./src/components/) is feature-scoped rather than type-scoped — each subdirectory owns the full UI surface for that domain.
- 🔑 [`src/utils/`](./src/utils/) is worth reading first — `PrivateRoutes.jsx` and `RoleBasedRoutes.jsx` define how access control is layered, and `axios.utils.jsx` centralises all API configuration.
- 🗝️ [`src/context/authContext.jsx`](./src/context/authContext.jsx) holds the auth state that drives both route guards and conditional rendering across the app.
- 📑 [`src/pages/`](./src/pages/) contains `AdminDashboard.jsx`, `UserDashboard.jsx`, `Login.jsx`, and `Settings.jsx` — thin page shells that compose components from the feature directories.
