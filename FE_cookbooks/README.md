# CookBook Frontend

React + TypeScript + Vite frontend for the CookBook app.

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file only if your backend URL is different from the default:

```bash
cp .env.example .env.local
```

Default API URL:

```env
VITE_API_BASE_URL=http://localhost:4000
```

The app already falls back to `http://localhost:4000`, so a new developer can run it without creating an env file when the backend uses the default port.

## Development

Start the frontend:

```bash
npm run dev
```

Start the backend separately from `../BE_node`.

## Checks

```bash
npm run build
npm run lint
```
