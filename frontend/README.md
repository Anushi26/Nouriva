# Nouriva Frontend

React + Vite frontend for Nouriva.

## Local

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then:

```bash
npm install
npm run dev
```

## Vercel

Deploy this folder as its own Vercel project.
Set this environment variable in Vercel:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

Then redeploy. The frontend will use the deployed backend instead of localhost.
