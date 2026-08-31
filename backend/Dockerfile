FROM alpine:3.20

ARG PB_VERSION=0.28.0

RUN apk add --no-cache ca-certificates unzip

WORKDIR /app

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pocketbase.zip
RUN unzip -q /tmp/pocketbase.zip -d /app && rm -f /tmp/pocketbase.zip

ENV PB_DATA_DIR=/pb_data
RUN mkdir -p /pb_data

EXPOSE 8090

VOLUME ["/pb_data"]

CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb_data"]
