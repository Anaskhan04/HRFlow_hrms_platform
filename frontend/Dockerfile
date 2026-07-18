# Stage 1: Build React application
FROM node:22-alpine AS builder

WORKDIR /app

# Accept VITE_API_URL build argument so it can be baked into static bundle
ARG VITE_API_URL=http://localhost:5000/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build the Vite React application
RUN npm run build

# Stage 2: Serve production build using Nginx
FROM nginx:alpine AS runner

# Remove default Nginx website files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration for SPA routing and API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
