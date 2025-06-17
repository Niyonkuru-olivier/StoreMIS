#!/bin/sh

# Start stock backend
cd /app/stock-backend
npm run start:prod &

# Start main backend
cd /app/main-backend
npm run start:prod &

# Start frontend
cd /app
serve -s frontend/dist -l 80 