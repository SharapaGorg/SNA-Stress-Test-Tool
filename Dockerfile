# Dockerfile
FROM node:20-slim

# 1. Set working directory
WORKDIR /app

# 2. Copy only package manifest (and lockfile if you have one already)
COPY package.json package-lock.json* ./

# 3. Install all dependencies (this will pull in the correct @rollup/linux-arm64 & @esbuild/linux-arm64)
RUN npm install

# 4. Copy your application source (no host node_modules, thanks to .dockerignore)
COPY . .

# 5. Rebuild any native modules just to be safe
RUN npm rebuild

# 6. Expose ports & set host
EXPOSE 3000 5173
ENV HOST=0.0.0.0

# 7. Default command
CMD ["npm", "run", "dev"]
