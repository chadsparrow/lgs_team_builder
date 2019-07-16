FROM node:8

ADD server /usr/src/app/server

RUN cd /usr/src/app/server
RUN npm install && npm install pm2 -g
RUN pm2 install pm2-logrotate && pm2 set pm2-logrotate:retain 14

EXPOSE 5001

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.1/wait /wait
RUN chmod +x /wait && /wait