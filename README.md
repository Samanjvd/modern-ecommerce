# Zanbilak

## Requirements

- Node.js
- Yarn
- Docker / postgreSQL
- Docker Compose

## Frontend

cd frontend
yarn install
yarn dev

## Backend

cd backend
yarn install
npx prisma generate
npx prisma migrate deploy
yarn dev

## Database

docker compose up -d
