# File: `Dockerfile`
FROM node:20-slim

WORKDIR /app

# Enable Corepack and pin Yarn
RUN corepack enable \
 && corepack prepare yarn@4.5.2 --activate

# Copy package files and install deps from scratch
COPY package.json yarn.lock ./
RUN yarn cache clean \
 && yarn install --force --frozen-lockfile

# Copy app sources
COPY . .

# Expose ports
EXPOSE 3000 5173
ENV HOST=0.0.0.0

# Start in dev mode
CMD ["yarn", "dev"]
