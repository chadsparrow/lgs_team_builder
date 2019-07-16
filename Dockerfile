FROM node:8

ADD server /usr/src/app/server

RUN cd /usr/src/app/sercer && npm install

EXPOSE 5001

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm run start
