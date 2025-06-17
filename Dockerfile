# Build stage for frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY stock_frontend/package*.json ./
RUN npm install
COPY stock_frontend/ .
RUN npm run build -- --configuration production

# Build stage for stock backend
FROM node:18-alpine AS stock-backend-builder
WORKDIR /app/stock-backend
COPY stock_backend/package*.json ./
RUN npm install
COPY stock_backend/ .
RUN npm run build

# Build stage for main backend
FROM node:18-alpine AS main-backend-builder
WORKDIR /app/main-backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist/stock ./frontend/dist

# Copy built stock backend
COPY --from=stock-backend-builder /app/stock-backend/dist ./stock-backend/dist
COPY --from=stock-backend-builder /app/stock-backend/package*.json ./stock-backend/
RUN cd stock-backend && npm install --production

# Copy built main backend
COPY --from=main-backend-builder /app/main-backend/dist ./main-backend/dist
COPY --from=main-backend-builder /app/main-backend/package*.json ./main-backend/
RUN cd main-backend && npm install --production

# Install serve for frontend
RUN npm install -g serve

# Copy start script
COPY start.sh .
RUN chmod +x start.sh

# Expose ports
EXPOSE 80 3000 3001

# Start all services
CMD ["./start.sh"] 