# Stage 1: Build the app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only copy package files first for caching)
COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the built app with a lightweight web server
FROM nginx:alpine

# Copy built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx config and copy your own if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
