FROM node:20-alpine AS base

# Builder
FROM base AS builder
RUN apk update
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune client --docker
 
#  Installer
FROM base AS installer
RUN apk update
WORKDIR /app
 
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .

RUN mv ./apps/client/.env.docker ./apps/client/.env
RUN yarn turbo build --filter=client...

# Runner
FROM base AS runner

WORKDIR /app

COPY --from=installer /app .

EXPOSE 3000

CMD yarn start
