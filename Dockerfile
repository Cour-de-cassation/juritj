# Source : https://github.com/nestjs/awesome-nestjs#resources boilerplates

### BUILD ###
FROM node:18-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

RUN npm config set proxy $http_proxy
RUN npm config set https-proxy $https_proxy

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

### TEST ###
FROM builder as test

RUN npm run build

### PROD ###
FROM builder as prod

RUN npm run build && npm prune --production

# ### RUN API ###
FROM node:18-alpine as api

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=prod --chown=node:node /home/node/package*.json ./
COPY --from=prod --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=prod --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/api/main"]

# ### BATCH ###
FROM api as batch 
USER root
RUN apk add cmd:wpd2text
USER node
COPY batch_docker_entrypoint.sh batch_docker_entrypoint.sh
CMD ["/bin/sh", "batch_docker_entrypoint.sh"]