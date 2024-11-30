FROM node:20.11.1-alpine as node


# Install dependencies
RUN apk update && apk add python3 make g++ ffmpeg bash


# Verify installation
RUN node -v

RUN corepack enable

# Set the working directory
WORKDIR /usr/src/app

RUN pnpm config set store-dir /root/.pnpm-store

#COPY ~/Library/pnpm/store /root/.pnpm-store

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

COPY patches patches

COPY packages packages

RUN pnpm fetch

COPY worker worker

RUN pnpm install -r --prefer-offline

WORKDIR /usr/src/app/worker

CMD tail -f /dev/null