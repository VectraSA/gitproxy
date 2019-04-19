const http = require('http')
const https = require('https')

const GIT_HOST = process.env.GIT_HOST
const GIT_PORT = process.env.GIT_PORT
const GIT_USER = process.env.GIT_USER
const GIT_PASSWORD = process.env.GIT_PASSWORD
const AUTH_KEY = process.env.AUTH_KEY
const PORT = process.env.PORT || 3000

if (!GIT_HOST || !GIT_PORT || !GIT_USER || !GIT_PASSWORD) {
  console.error('Missing environment variables')
  process.exit(1)
}

const server = http.createServer((sReq, sRes) => {
  let { headers, method, url } = sReq

  if (AUTH_KEY) {
    let auth = headers['authorization']

    if (!auth) {
      sRes.statusCode = 401
      sRes.setHeader('WWW-Authenticate', 'Basic realm="Git Proxy"')
      sRes.end('Authentication is needed')
      return
    }

    let tmp = auth.split(' ')
    let buf = Buffer.from(tmp[1], 'base64')
    let plainAuth = buf.toString('utf8')
    let creds = plainAuth.split(':')
    let key = creds[1]

    if (AUTH_KEY !== key) {
      console.warn(method + ' -> ' + headers['host'] + url + ' error: ' + 'Invalid Authentication Key')
      sRes.writeHead(401)
      sRes.end('Invalid Authentication Key')
      return
    }
  }

  // Only Allow Git Operations
  if (url.indexOf('.git') === -1) {
    console.warn(method + ' -> ' + headers['host'] + url + ' error: ' + 'Invalid URL')
    sRes.writeHead(403)
    sRes.end('Invalid URL')
    return
  }

  let host = GIT_HOST + ':' + GIT_PORT

  let rBody = []

  sReq.on('error', (error) => {
    console.error(method + ' -> ' + host + url + ' error: ' + error.message)
  }).on('data', (chunk) => {
    rBody.push(chunk)
  }).on('end', () => {
    rBody = Buffer.concat(rBody)

    headers['host'] = host
    headers['Authorization'] = 'Basic ' + Buffer.from(GIT_USER + ':' + GIT_PASSWORD).toString('base64')

    let options = {
      hostname: GIT_HOST,
      port: GIT_PORT,
      path: url,
      method: method,
      headers: headers
    }

    let client = https.request(options, (cRes) => {
      let cBody = []
      cRes.on('data', (chunk) => {
        cBody.push(chunk)
      }).on('end', () => {
        console.error(method + ' -> ' + host + url + ' status: ' + cRes.statusCode)
        cBody = Buffer.concat(cBody)
        sRes.writeHead(cRes.statusCode, cRes.headers)
        sRes.end(cBody)
      })
    })

    if (rBody.length) {
      client.write(rBody)
    }

    client.on('error', (error) => {
      console.error(method + ' -> ' + headers['host'] + url + ' error: ' + error.message)
      console.error(error)
      sRes.writeHead(500)
      sRes.end(error.message)
    })

    client.end()
  })
})

server.listen(PORT, () => {
  console.log('HTTP Server Running on Port ' + PORT)
})

server.on('error', (error) => {
  console.error('HTTP Server Error: ' + error.message)
  console.error(error)
  process.exit(1)
})
