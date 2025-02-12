FROM node:lts-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./server ./server
COPY ./client ./client
COPY ./init_data_scripts ./init_data_scripts
COPY ./tables ./tables
COPY ./shared ./shared
COPY ./angular.json .
COPY ./package.json .
COPY ./postcss.config.js .
COPY ./tailwind.config.js .
COPY ./tsconfig.app.json .
COPY ./tsconfig.json .

RUN npm run build

FROM node:lts-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/portfolio/server/server.mjs"]
EXPOSE 4000
