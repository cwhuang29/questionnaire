FROM ubuntu:18.04 as builder

RUN apt-get update && apt-get install -y --no-install-recommends \
        g++ \
        ca-certificates \
        wget && \
    rm -rf /var/lib/apt/lists/*

ENV GO_VERSION 1.16.3
ENV GO_PATH /go
RUN wget -nv -O - https://storage.googleapis.com/golang/go${GO_VERSION}.linux-amd64.tar.gz \
    | tar -C /usr/local -xz
ENV PATH $GO_PATH/bin:/usr/local/go/bin:$PATH

WORKDIR /app
COPY . .
RUN go build -o web /app/cmd/main.go
ENTRYPOINT ["/app/web"]

FROM golang:1.15.6

COPY --from=builder /app/web /app/web
COPY --from=builder /app/config.yml /app/config.yml

WORKDIR /app

EXPOSE 9000

ENV WEB_DB_PORT=3306
ENV WEB_DB_HOST=db 
ENV WEB_APP_HTTP_PORT=9000
ENV WEB_APP_MODE=prod
# ENV WEB_APP_URL= # Frontend URL
# ENV APP_HTTPS_PORT=443
# ENV WEB_EMAIL_SENDER=
# ENV WEB_EMAIL_REGION=

ENTRYPOINT ["/app/web"]
