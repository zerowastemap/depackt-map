const tape = require('tape')

const client = require('./app/client')

tape('page should render on the server', function (t) {
  const state = {}

  t.plan(1)

  const res = client.app.toString('/about', state)

  t.equal(typeof res, 'string')

  t.end()
})

tape('store should be a function', function (t) {
  t.plan(1)

  const store = client.store

  t.equal(typeof store, 'function')

  t.end()
})
