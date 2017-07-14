import { start } from './app/server'
import { log, error } from 'winston'

require('dotenv').config()

start((err, message) => {
  if (err) return error(err)
  log('info', message)
})
