FROM node:17.5

RUN apt-get update \
  && apt-get -y install vim

RUN groupadd -g 799 nyu && \
    useradd -r -u 999 -g nyu nyu

WORKDIR /usr/src/app

RUN touch data.txt

RUN chown nyu:nyu data.txt

COPY package*.json ./

RUN npm install

EXPOSE 53533

USER nyu

COPY --chown=nyu:nyu . .

# RUN su - nyu -c "touch data.txt"

CMD [ "node", "server.js" ]
