FROM node:10.15-alpine

MAINTAINER Vectra <code@vectra.co.za>

RUN addgroup -g 500 apps && \
    adduser -D -u 1500 -G apps app

WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
USER app

ENV NODE_ENV production

CMD ["node", "index"]
