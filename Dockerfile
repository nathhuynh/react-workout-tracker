# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.4.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application in development mode with hot reloading
# where the necessary files are copied from the build stage.
FROM base as dev

# Use development node environment.
ENV NODE_ENV development

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the development dependencies from the deps stage.
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Install development dependencies for hot reloading
RUN npm install

# Copy the source files for hot reloading
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application in development mode with hot reloading.
CMD npm run dev
