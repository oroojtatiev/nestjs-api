ARG NODE_VERSION=20.10.0
ARG PNPM_VERSION=8.12.1

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

####################################
# CREATE IMAGE FOR LOCAL DEVELOPMENT
####################################
FROM base AS development

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install

COPY --chown=node:node . .

########################
# CREATE IMAGE FOR BUILD
########################
FROM development AS build

RUN pnpm run build

ENV NODE_ENV production

RUN pnpm install --prod --frozen-lockfile && pnpm store prune

USER node

#############################
# CREATE IMAGE FOR PRODUCTION
#############################
FROM base AS production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
