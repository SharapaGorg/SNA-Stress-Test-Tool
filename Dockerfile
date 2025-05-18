FROM node:20-alpine

WORKDIR /app

# Install yarn
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

# Copy package files and install dependencies
COPY package.json yarn.lock* ./
RUN yarn install

# Copy the rest of the application
COPY . .

# Expose ports for server and client
EXPOSE 3000
EXPOSE 5173

# Set host to 0.0.0.0 to allow external connections
ENV HOST=0.0.0.0

# Run the dev script
CMD ["yarn", "dev"]
