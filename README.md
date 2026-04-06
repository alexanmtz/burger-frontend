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

See `/docs` for C4 Context and Container diagrams.

## Demo

A demo account is available for testing the authenticated flow:

- Email: demo@burgerlovers.com
- Password: 1234

## Local development

To run without Supabase auth:
VITE_USE_MOCK_API=false  # full API, development using json-server
VITE_USE_MOCK_AUTH=false   # full Supabase OIDC auth flow
