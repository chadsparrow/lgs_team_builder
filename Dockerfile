FROM node:12.16.3-alpine
RUN apk update && apk add bash

WORKDIR /usr/src/app/
COPY package*.json ./
RUN npm install

# COPY . .

EXPOSE 5000