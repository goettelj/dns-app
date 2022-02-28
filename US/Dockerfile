FROM node:17.5

RUN groupadd -g 799 nyu && \
    useradd -r -u 999 -g nyu nyu

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 8080

USER nyu

COPY --chown=nyu:nyu . .

CMD [ "node", "server.js" ]
