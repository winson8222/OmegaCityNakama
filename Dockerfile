# Stage 1: Build the application
FROM node:alpine AS node-builder

WORKDIR /backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the TypeScript configuration file
COPY tsconfig.json ./

# Copy the source files
COPY src/ ./src

# Compile TypeScript files
RUN npx tsc

# Stage 2: Copy the built files to the final image
FROM heroiclabs/nakama:3.21.1

# Create the necessary directory in the final image
RUN mkdir -p /nakama/data/modules/build

# Copy the built JavaScript files from the previous stage
COPY --from=node-builder /backend/build/*.js /nakama/data/modules/build/
COPY local.yml /nakama/data/
