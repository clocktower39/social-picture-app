# Mock Instagram

MERN
Material-UI
Redux
JWT
GridFS
Heroku

## Project structure

- `social-picture-app/` — React + Vite frontend
- `social-server-pic-app/` — Express + Mongoose backend

## Local development

1. `cd social-server-pic-app && npm install && npm run dev` (runs on `:3003`)
2. `cd social-picture-app && npm install && npm run dev` (runs on `:5173`)

The frontend auto-detects the backend on the same host/port (`:3003`).

## Deployment

- **Frontend** is built as a static SPA and can be hosted on any static
  host (Apache, Nginx, Netlify, Vercel, GitHub Pages, etc.).
- **Backend** is hosted on Heroku
  (`https://social-picture-app.herokuapp.com` by default).

When the frontend is built in production mode, the backend URL is
automatically baked in as the Heroku URL. To override it (e.g. pointing
at a staging backend, a custom domain, or a different port), set the
`VITE_API_URL` env var at build time:

```bash
cd social-picture-app
echo "VITE_API_URL=https://api.your-domain.com" > .env.production
npm run build
```

Or pass it inline:

```bash
VITE_API_URL=https://api.your-domain.com npm run build
```

The `.env.example` file lists all available options.

The backend on Heroku already has `app.use(cors())` configured to allow
all origins, so the Apache-hosted frontend can call it without
additional CORS configuration.

## Backend env vars (Heroku)

Set these on the Heroku app's config:

```
DBURL=<mongodb connection string>
ACCESS_TOKEN_SECRET=<random>
REFRESH_TOKEN_SECRET=<random>
SALT_WORK_FACTOR=10
PORT=8080
```
