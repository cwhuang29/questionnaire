FROM node:14.18.3
MAINTAINER cwhuang

WORKDIR /app

COPY . .

ARG SERVER_URL="http://127.0.0.1:9000"

# Override this value when building image. This value is used by src/config.js
ENV REACT_APP_SERVER_URL=${SERVER_URL}

RUN yarn install
RUN REACT_APP_SERVER_URL=${SERVER_URL} yarn build

ENTRYPOINT ["yarn", "serve"]
