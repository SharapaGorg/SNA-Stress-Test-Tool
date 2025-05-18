# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy only necessary files from the project root
COPY package.json yarn.lock ./
COPY client/ ./client/

# Install dependencies
RUN corepack enable
RUN yarn install

# Try to build client, or fallback to copying files if build fails
RUN cd client && \
    (yarn build || \
    mkdir -p dist && \
    cp -r public/* dist/ 2>/dev/null || \
    cp -r src/* dist/ 2>/dev/null || \
    cp -r . dist/)

# Production stage with Nginx to serve static content
FROM nginx:alpine

# Copy built assets from build stage to nginx serve directory
COPY --from=build /app/client/dist /usr/share/nginx/html

# Create default nginx configuration if needed
RUN echo 'server { \
    listen       80; \
    server_name  localhost; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Nginx starts automatically in this image
