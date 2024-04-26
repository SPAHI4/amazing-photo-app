FROM node:20.12.1-alpine as node

RUN apk update && apk add curl

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add pnpm -g

FROM node AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM build AS server-prune
COPY ./client/src/__generated__/persisted-documents.json /usr/src/app/client/src/__generated__/persisted-documents.json
RUN pnpm --filter server run schema:documents
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter=server --prod deploy server-prune

FROM node AS server
COPY --from=server-prune /usr/src/app/server-prune /usr/src/app/server
WORKDIR /usr/src/app/server
EXPOSE 443
CMD ["pnpm", "start"]

FROM build AS worker-prune
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter=worker --prod deploy worker-prune

FROM node AS worker
RUN apk add python3 make g++ ffmpeg bash
COPY --from=worker-prune /usr/src/app/worker-prune /usr/src/app/worker
WORKDIR /usr/src/app/worker
CMD ["pnpm", "start"]

FROM build AS migrate-prune
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter=db --prod deploy migrate-prune

FROM node AS migrate
COPY --from=migrate-prune /usr/src/app/migrate-prune /usr/src/app/migrate
WORKDIR /usr/src/app/migrate
CMD ["pnpm", "migrate"]