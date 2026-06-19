# --- Builder --- #
FROM node:24-alpine AS builder


USER node
WORKDIR /home/node

RUN npm config set proxy $http_proxy
RUN npm config set https-proxy $https_proxy

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run build && npm prune --production

# --- Final production image --- #
FROM node:24-alpine AS api

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist ./dist

CMD ["node", "dist/server.js"]

# --- ONLY USED TO LAUNCH DOCKER IN LOCAL WITH HOT-RELOAD --- #
FROM node:24-alpine AS api-local

ENV ENV=local

USER root
RUN apk add cmd:wpd2text

USER node
WORKDIR /home/node

COPY --chown=node:node . .
RUN npm i

CMD ["npm", "run", "start:watch"]