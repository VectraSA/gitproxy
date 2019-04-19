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
ENV GIT_HOST=bitbucket.org
ENV GIT_PORT=443
ENV GIT_USER=myuser
ENV GIT_PASSWORD=mypassword
ENV AUTH_KEY=secret

CMD ["node", "index"]
