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

# Create nginx user if it doesn't exist
RUN adduser -D -H -u 101 -s /sbin/nologin nginx || true

# Create necessary directories
RUN mkdir -p /var/log/nginx /var/cache/nginx /var/run

# Copy the built application from build stage
COPY --from=build /app/dist/stock /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /var/run && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /var/log/nginx && \
    chmod -R 755 /var/run

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 