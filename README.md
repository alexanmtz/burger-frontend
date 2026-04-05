# Burger Frontend 1.0™

Social platform for burger fanatics to review local burger places.

## Setup

cp .env.example .env.local
npm install
npm run dev

## Local API

npm install -D json-server
npx json-server db.json --port 3001

## Architecture

See `/docs` for C4 Context and Container diagrams.

## Demo

A demo account is available for testing the authenticated flow:

- Email: demo@burgerlovers.com
- Password: 1234

## Local development

To run without Supabase auth:
VITE_USE_REAL_AUTH=false  # uses mock user, no login required
VITE_USE_REAL_AUTH=true   # full Supabase OIDC flow
