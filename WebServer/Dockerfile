FROM node:lts-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Order from less likely to change to most likely to change
# so that we can take advantage of docker cache

# config files - pretty much static
COPY ./tsconfig.json .
COPY ./tsconfig.app.json .
COPY ./angular.json .
COPY ./.postcssrc.json .

# tables schemas are less likely to change due to scalable schema
COPY ./tables ./tables

# assets, and src are likely to change a lot in development
COPY ./public ./public
COPY ./src ./src

# data is likely to change in production
COPY ./init_data_scripts ./init_data_scripts

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