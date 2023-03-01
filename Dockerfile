# Source : https://github.com/nestjs/awesome-nestjs#resources boilerplates

# --- Builder --- #
FROM node:18-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

RUN npm config set proxy $http_proxy
RUN npm config set https-proxy $https_proxy

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .


# --- Dev dependencies for testing --- #
FROM builder as test

RUN npm run build


# --- Only prod dependencies --- #
FROM builder as prod

RUN npm run build && npm prune --production


# --- Base final image with only shared dist content --- #
FROM node:18-alpine as shared

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=prod --chown=node:node /home/node/package*.json ./
COPY --from=prod --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=prod --chown=node:node /home/node/dist/shared ./dist/shared


# --- Base final image with api dist content --- #
FROM shared as api

COPY --from=prod --chown=node:node /home/node/dist/api ./dist/api
CMD ["node", "dist/api/main"]


# --- Base final image with batch dist content --- #
FROM shared as batch 

USER root
RUN apk add cmd:wpd2text

USER node
COPY --from=prod --chown=node:node /home/node/dist/batch ./dist/batch
COPY batch_docker_entrypoint.sh batch_docker_entrypoint.sh

CMD ["/bin/sh", "batch_docker_entrypoint.sh"]