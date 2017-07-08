const server = require('./app/server')

require('dotenv').config()

server.start((err, message) => {
  if (err) {
    throw err
  }
  console.log(message)
})
