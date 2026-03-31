# --- Builder --- #
FROM node:24-alpine AS builder


USER node
WORKDIR /home/node

RUN npm config set proxy $http_proxy
RUN npm config set https-proxy $https_proxy

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .


# --- Only prod dependencies --- #
FROM builder AS prod

RUN npm run build && npm prune --production


# --- Base final image with dist content --- #
FROM node:24-alpine AS api

USER node
WORKDIR /home/node

COPY --from=prod --chown=node:node /home/node/package*.json ./
COPY --from=prod --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=prod --chown=node:node /home/node/dist ./dist

CMD ["node", "dist/server.js"]

# --- ONLY USED TO LAUNCH DOCKER IN LOCAL WITH HOT-RELOAD: ---#
FROM node:24-alpine AS api-local

ENV NODE_ENV=local

USER root

USER node
WORKDIR /home/node

COPY --chown=node:node . .
RUN npm i

CMD ["npm", "run", "start:dev"]