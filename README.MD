[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Travis](https://img.shields.io/travis/VectraSA/gitproxy.svg?style=flat-square)](https://travis-ci.org/VectraSA/gitproxy)
[![Docker Pulls](https://img.shields.io/docker/pulls/vectra/gitproxy.svg?style=flat-square)](https://hub.docker.com/r/vectra/gitproxy)
[![](https://images.microbadger.com/badges/image/vectra/gitproxy.svg)](https://microbadger.com/images/vectra/gitproxy)
[![](https://images.microbadger.com/badges/version/vectra/gitproxy.svg)](https://microbadger.com/images/vectra/gitproxy)

# Http proxy for Git Servers

Allows Git clients you to interact with a Git server using account credentials
that are unknown to the Git clients.

Architecture: git-client ---(auth optional)--> proxy ---(auth required)--> git-server

Useful for installing NPM modules from hosted Git repositories.

#### Usage Examples
```sh
$ git clone http://localhost:3000/owner/repo.git
$ git clone https://git:secret@example.com/owner/repo.git

$ npm install git+http://localhost:3000/owner/repo.git
$ npm install git+https://git:secret@example.com/owner/repo.git
```

#### Environment Variables
| Name | Value | Example | Required |
| ------ | ------ | ------ | ------ |
| GIT_HOST | The Git Server name | bitbucket.org / github.com | Yes |
| GIT_PORT | The Git Server port | 80 / 443 |  Yes |
| GIT_USER | Your User name for the Git Server | username |  Yes |
| GIT_PASSWORD | Your Password for the Git Server | password |  Yes |
| AUTH_KEY | Your client Secret to authenticate with the Proxy | secret |  No |

##### Run in Node
```sh
$ npm install
$ GIT_HOST=bitbucket.org GIT_PORT=443 GIT_USER=user GIT_PASSWORD=password \
  npx nodemon index.js
```

##### Docker Build
```sh
$ docker build -t gitproxy .
$ docker tag gitproxy vectra/gitproxy
$ docker push vectra/gitproxy
```

##### Docker Run
```sh
$ docker run -d \
  --name gitproxy \
  --restart always \
  -p 3000:3000 \
  -e GIT_HOST='github.com' \
  -e GIT_PORT='443' \
  -e GIT_USER='username' \
  -e GIT_PASSWORD='password' \
  -e AUTH_KEY='secret' \
  vectra/gitproxy
```

##### Build with Docker Compose
```sh
$ docker-compose build
```

##### Run with Docker Compose
```sh
$ docker-compose up
```

Visit [Vectra](https://vectra.co.za)

Docker Image [Docker Hub](https://hub.docker.com/r/vectra/gitproxy)

Git Repo [GitHub](https://github.com/VectraSA/gitproxy)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
