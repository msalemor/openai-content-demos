# Server

## Golang Server

## Packages

- godotenv
- fiber
- logrus

## Requirements

### Create `.env` file

```bash
OPENAI_API_KEY=<KEY>
OPENAI_GPT_URI=<URI>
OPENAI_DAVINCI_URI=<URI>
Temperature=0.3
MAX_TOKENS=300
N=1
APPLICATION_PORT=3000
```

## Docker

### Build

```dockerfile
FROM golang:alpine as app-builder
RUN apk update
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go install -ldflags '-extldflags "-static"' -tags timetzdata

FROM scratch
COPY --from=app-builder /go/bin/server /server
COPY --from=app-builder /src/public /public
COPY --from=alpine:latest /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

ENTRYPOINT ["/server"]
```

### Run

```bash
docker run --rm -d -p 3000:3000 --env-file .env am8850/openaidemos:dev
```
