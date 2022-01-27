FROM node:14.18.3
MAINTAINER cwhuang

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000

# ENV WEB_SERVER_URL= # Backend URL

ENTRYPOINT ["yarn", "serve"]
