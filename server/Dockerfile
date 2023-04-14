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