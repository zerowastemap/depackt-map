var EventEmitter = require('events').EventEmitter
var spok = require('spok')
var tape = require('tape')

var app = require('./app/client')
var appStore = app.appStore

var html = require('choo/html')
var choo = require('choo')

tape('should render on the server', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    return html`
      <p>Hello filthy planet</p>
    `
  })
  var res = app.toString('/')
  var exp = '<p>Hello filthy planet</p>'
  t.equal(res.toString(), exp, 'result was OK')
  t.end()
})

tape('should initialize empty state', function (t) {
  var emitter = new EventEmitter()
  var state = {}
  appStore(state, emitter)
  spok(t, state, {
    form: {
      email: '',
      text: ''
    }
  })
  t.end()
})
