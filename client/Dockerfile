# Use a lightweight Node.js base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the entire project
COPY . .

# Expose port
ENV PORT=3000
EXPOSE 3000

# Start Next.js in development mode
CMD ["npm", "run", "dev"]