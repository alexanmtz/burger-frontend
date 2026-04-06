# Burger Frontend 1.0™

Social platform for burger fanatics to review local burger places.

## Setup

```
cp .env.example .env.local
npm install
npm run dev
```

## Local API

```
npm install -D json-server
npm run server
```

## Architecture

See `/diagrams` for C4 Context and Container diagrams, STRUCTURE.md, and ARCHITECTURE.md for more architecture details.

## Local development

To run without Supabase auth:

```
VITE_USE_MOCK_API=true  # Mock API when true, using local db.json read-only mode, when false, development uses a json-server for the api
VITE_USE_MOCK_AUTH=true   # When true, mock auth to get the user from local db.json file, and false to have the full Supabase OIDC auth flow
```

## Demo

To log in with a demo account, switch the `VITE_USE_MOCK_AUTH` environment variable to `true` and log in with any credentials.
