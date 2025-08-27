FROM node:lts-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./init_data_scripts ./init_data_scripts
COPY ./public ./public
COPY ./src ./src
COPY ./tables ./tables
COPY ./.postcssrc.json .
COPY ./angular.json .
COPY ./tsconfig.app.json .
COPY ./tsconfig.server.json .
COPY ./tsconfig.node.json .
COPY ./tsconfig.json .

RUN npm run build:prod:client
RUN npm run build:prod:server
RUN npm run build:prod:node

FROM node:lts-alpine
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/node/server.mjs"]

EXPOSE 4000