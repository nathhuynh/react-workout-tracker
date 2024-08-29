# syntax=docker/dockerfile:1
FROM node:22.4.1-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy prisma directory
COPY prisma ./prisma/

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Run migrations and start the application in development mode
CMD ["npm", "run", "start:migrate:dev"]