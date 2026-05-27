# ==========================================
# Stage 1: Build React App with Node & Vite
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors for dependency caching
COPY package*.json ./

# Install packages
RUN npm ci

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# ==========================================
# Stage 2: Serve Application with Nginx
# ==========================================
FROM nginx:stable-alpine

# Set labels for OCI image specifications
LABEL org.opencontainers.image.title="Dinh Cong Duyen - DevOps Portfolio" \
  org.opencontainers.image.description="Production container serving static React portfolio app" \
  org.opencontainers.image.version="1.0.0"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (HTTP)
EXPOSE 80

# Health check to ensure the server is serving traffic
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/index.html || exit 1

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
