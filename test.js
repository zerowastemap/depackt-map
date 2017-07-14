const tape = require('tape')

const client = require('./app/server/render-client')

tape('page should render on the server', function (t) {
  const state = {}

  t.plan(1)

  const res = client.app.toString('/about', state)

  t.equal(typeof res, 'string')

  t.end()
})
