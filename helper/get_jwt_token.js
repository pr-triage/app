#!/usr/bin/env node

const app_id = process.argv[2]
if (!app_id) {
  console.error(`error: missing required argument GitHub App ID.`)
  process.exit(1)
}

// Read private-key.pem
const cert   = require('fs').readFileSync(`${__dirname}/../private-key.pem`)
// Generate the JWT
const token  = require('jsonwebtoken').sign({
  // issued at time
  iat: Math.floor(Date.now() / 1000),
  // JWT expiration time (10 minute maximum)
  exp: Math.floor(Date.now() / 1000) + 60,
  // GitHub App's identifier
  iss: app_id,
}, Buffer.from(cert, 'base64').toString(), { algorithm: 'RS256' })

console.log(token)
