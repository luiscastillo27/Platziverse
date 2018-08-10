'use stric'

const http = require('http')
const express = require('express')
const chalk = require('chalk')
const api = require('./api')

const port = process.env.PORT || 2715
const app = express()
const server = http.createServer(app)

app.use('/api', api)

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-api]')} server listeing on port ${port}`)
})
