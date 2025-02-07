# Command line arguments, such as Node version
ARG NODE_VERSION=lts

#
# --- Stage 1: Build ---
#

FROM node:${NODE_VERSION} AS build
RUN npm install -g corepack@0.31.0 && corepack enable

# Install dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile

# Copy files 
COPY . .

# Build & optimize a bit
RUN pnpm build
RUN pnpm prune --prod

#
# --- Stage 2: Run ---
#

FROM node:${NODE_VERSION}-alpine AS final

WORKDIR /usr/src/app

COPY --from=build --chown=nobody /app/package.json .
COPY --from=build --chown=nobody /app/node_modules node_modules
COPY --from=build --chown=nobody /app/dist dist

ARG BUILD_COMMIT
ARG BUILD_NUMBER
ARG BUILD_TIMESTAMP

ENV BUILD_COMMIT=$BUILD_COMMIT
ENV BUILD_NUMBER=$BUILD_NUMBER
ENV BUILD_TIMESTAMP=$BUILD_TIMESTAMP

EXPOSE 3000
