# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for node-gyp
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application with production configuration
RUN npm run build -- --configuration production

# Install serve to run the application
RUN npm install -g serve

# Expose port 80
EXPOSE 80

# Start the application
CMD ["serve", "-s", "dist/stock", "-l", "80"] 