# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install openssl required by Prisma binary engine on Alpine Linux
RUN apk add --no-cache openssl

# Copy package configuration and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies needed for TypeScript compiler)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code and TypeScript configuration
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript to JavaScript in dist directory
RUN npm run build

# Stage 2: Production server stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install openssl required for Prisma runtime on Alpine Linux
RUN apk add --no-cache openssl

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies and generate Prisma client for runtime
RUN npm ci --omit=dev && npx prisma generate

# Copy compiled JavaScript output from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership to non-root node user for container hardening
RUN chown -R node:node /app

# Switch to non-root user for security best practice (CIS Docker Benchmark)
USER node

# Expose backend server port
EXPOSE 5000

# Health check to verify API responsiveness
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1

# Start production server
CMD ["npm", "start"]
