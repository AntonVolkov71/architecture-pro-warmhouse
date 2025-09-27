# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Download dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Download dependencies
RUN npm install --production

# Install necessary runtime dependencies
RUN npm install --production

CMD ["node", "dist/main.js"]
