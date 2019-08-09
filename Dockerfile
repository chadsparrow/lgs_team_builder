FROM node:8-alpine
RUN apk update && apk add bash

WORKDIR /usr/src/app/
COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 5001

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.1/wait /wait
RUN chmod +x /wait && /wait