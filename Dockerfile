FROM node:14-alpine AS build

# Create App dir
RUN mkdir -p /app

# Set working directory to App dir
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

ENTRYPOINT ["scripts/web-docker-entrypoint.sh"]

FROM node:14-alpine as app

## Copy built node modules and binaries without including the toolchain
COPY --from=build /app .

WORKDIR /app

ENTRYPOINT ["scripts/web-docker-entrypoint.sh"]
