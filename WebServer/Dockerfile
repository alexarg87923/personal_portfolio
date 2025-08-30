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
COPY ./tsconfig.json .

RUN npm run build:prod:angular

FROM node:lts-alpine
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tables ./tables
COPY --from=builder /app/init_data_scripts ./init_data_scripts

CMD ["npm", "run", "run:prod"]

EXPOSE 4000