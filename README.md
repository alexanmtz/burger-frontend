# Burger Frontend 1.0™

Social platform for burger fanatics to review local burger places.

## Setup

cp .env.example .env.local
npm install
npm run dev

## Local API

npm install -D json-server
npm run server

## Architecture

See `/docs` for C4 Context and Container diagrams, STRUCTURE.md and ARCHITECTURE.md.

## Local development

To run without Supabase auth:
VITE_USE_MOCK_API=true  # full API, development using json-server
VITE_USE_MOCK_AUTH=true   # full Supabase OIDC auth flow

## Demo

To log with a demo account, switch the `VITE_USE_MOCK_AUTH` environment variable to `true` and log with any credentials.