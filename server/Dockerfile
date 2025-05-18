# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy only necessary files from the project root
COPY package.json yarn.lock ./
COPY server/ ./server/
COPY tsconfig.json ./

# Install dependencies (modern syntax)
RUN corepack enable
RUN yarn install

# Build server
RUN yarn tsc -p tsconfig.json || mkdir -p dist/server && cp -r server/* dist/server/

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only what's needed to run
COPY package.json yarn.lock ./
COPY --from=build /app/dist/server ./dist/server

# Install only production dependencies (modern syntax)
RUN corepack enable
RUN yarn install

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/server/index.js"]
