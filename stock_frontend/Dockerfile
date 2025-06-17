# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies for node-gyp
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install @types/node
RUN npm install --save-dev @types/node

# Copy the rest of the application
COPY . .

# Create a script to generate environment.js
RUN echo "window.env = { API_URL_BACKEND1: '${API_URL_BACKEND1}', API_URL_BACKEND2: '${API_URL_BACKEND2}' };" > src/environment.js

# Build the application with production configuration
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy the built application from build stage
COPY --from=build /app/dist/stock /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/dist/stock /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 