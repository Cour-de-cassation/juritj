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
COPY --from=prod --chown=node:node /home/node/dist/scripts ./dist/scripts

# --- Base final image with batch dist content --- #
FROM shared as batch 

USER root
RUN apk add cmd:wpd2text

USER node
COPY --from=prod --chown=node:node /home/node/dist/batch ./dist/batch
COPY --chown=node:node batch_docker_entrypoint.sh batch_docker_entrypoint.sh

ENTRYPOINT ["/bin/sh", "batch_docker_entrypoint.sh"]

# --- Base final image with api dist content --- #
FROM shared as api

USER node
COPY --from=prod --chown=node:node /home/node/dist/api ./dist/api
COPY --from=prod --chown=node:node /home/node/secrets/dev ./secrets/dev

CMD ["node", "dist/api/main"]


# --- DEBUG / TESTING PURPOSE --- #
FROM node:18-bullseye as debug 

ENV NODE_ENV production

USER node
WORKDIR /home/node

ENTRYPOINT ["/bin/sh", "batch_docker_entrypoint.sh"]
COPY --from=prod --chown=node:node /home/node/package*.json ./
COPY --from=prod --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=prod --chown=node:node /home/node/dist ./dist
COPY --chown=node:node batch_docker_entrypoint.sh batch_docker_entrypoint.sh
RUN chmod +x batch_docker_entrypoint.sh

USER root
RUN apt update
RUN apt install libwpd-tools -y

USER node
CMD ["node", "dist/api/main"]

# --- ONLY USED TO LAUNCH DOCKER IN LOCAL WITH HOT-RELOAD: ---#

# --- Base image with only shared content --- #
FROM node:18-alpine as shared-local

ENV NODE_ENV local

USER root
RUN apk add cmd:wpd2text

USER node
WORKDIR /home/node

COPY --chown=node:node . .
RUN npm i

# --- Base image with batch content --- #
FROM shared-local as batch-local

USER node

CMD ["npm", "run", "batch:start:watch"]

# --- Base image with api content --- #
FROM shared-local as api-local

USER node

CMD ["npm", "run", "start:dev"]