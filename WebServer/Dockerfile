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
COPY ./package.json .
COPY ./tsconfig.app.json .
COPY ./tsconfig.json .

RUN npm run build

FROM node:lts-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/portfolio/server/server.mjs"]
EXPOSE 4000
