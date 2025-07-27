FROM node:22-alpine

WORKDIR /app

# Install build dependencies (e.g., for Prisma)
# RUN apk add --no-cache python3 make g++ postgresql-dev

# Copy package files and install all dependencies (including development dependencies)
COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

# Copy the entire project
COPY . .

# Generate Prisma client
# RUN npx prisma generate

# Expose port
ENV PORT=5000
EXPOSE 5000

# Start server in development mode (using TypeScript)
CMD ["npm", "run", "dev"]
