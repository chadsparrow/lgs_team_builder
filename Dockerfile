FROM node:8-alpine

ADD server /usr/src/app/server

RUN cd /usr/src/app/server && npm install
RUN apk update && apk add bash

EXPOSE 5001

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.1/wait /wait
RUN chmod +x /wait && /wait