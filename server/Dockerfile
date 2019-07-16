FROM node:8

WORKDIR /usr/src/app/server

COPY package*.json ./

RUN npm install && npm install pm2 -g

COPY . .

EXPOSE 5001

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.1/wait /wait
RUN chmod +x /wait && /wait

CMD ["pm2-dev","ecosystem.config.js"]
