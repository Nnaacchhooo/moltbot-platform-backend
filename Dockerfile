FROM node:20-alpine

# Install OpenClaw CLI
RUN apk add --no-cache curl bash git
RUN curl -L https://get.openclaw.ai | bash
ENV PATH="/root/.openclaw/bin:${PATH}"

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm install -g tsx
RUN npx tsc

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "dist/index.js"]
