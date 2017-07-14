import { start } from './app/server'

require('dotenv').config()

start((err, message) => {
  if (err) {
    throw err
  }
  console.log(message)
})
