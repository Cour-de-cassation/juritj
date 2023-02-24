# Source : https://github.com/nestjs/awesome-nestjs#resources boilerplates
FROM node:18-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

RUN npm config set proxy $http_proxy
RUN npm config set https-proxy $https_proxy

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:18-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/api/main"]


# todo : je fixe quelle version de node ?