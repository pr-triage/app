#!/usr/bin/env node

const fs = require('fs')

const appId = process.argv[2]
if (!appId) {
  console.error(`error`)
  process.exit(1)
}

const certPath = process.argv[3]
if (!certPath || !RegExp(/\.pem$/).test(certPath) || !fs.existsSync(certPath)) {
  console.error(`error`)
  process.exit(1)
}

// Read private-key.pem
const cert   = fs.readFileSync(certPath)
// Generate the JWT
const token  = require('jsonwebtoken').sign({
  // issued at time
  iat: Math.floor(Date.now() / 1000),
  // JWT expiration time (10 minute maximum)
  exp: Math.floor(Date.now() / 1000) + 60,
  // GitHub App's identifier
  iss: appId,
}, Buffer.from(cert, 'base64').toString(), { algorithm: 'RS256' })

console.log(token)
