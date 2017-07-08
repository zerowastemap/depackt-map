/**
 * @link https://github.com/choojs/choo
 * @link https://github.com/stackcss/sheetify
 */

require('babel-polyfill')

const choo = require('choo')
const logger = require('choo-log')
const html = require('choo/html')
const css = require('sheetify')
const xhr = require('xhr')
const _findIndex = require('lodash/findIndex')

css('./styles/reset.css')
css('./styles/leaflet.css')
css('./styles/MarkerCluster.css')
css('./styles/MarkerCluster.Default.css')
css('./styles/github-markdown.css')
css('./styles/flex.css')
css('./styles/layout.css')
css('./styles/icons.css')

const apiUrl = 'https://api.depackt.be'

const AboutView = require('./views/about')
const ResourcesView = require('./views/resources')
const noop = () => {}

// we export this so tests can run
if (module.parent) {
  const app = choo()
  app.route('/', Layout(noop))
  app.route('/:bounds', Layout(noop))
  app.route('/about', Layout(AboutView))
  app.route('/about/:hash', Layout(AboutView))
  app.route('/about/:hash/*', Layout(NotFound))
  app.route('/resources', Layout(ResourcesView))
  app.route('/:bounds/*', Layout(NotFound))

  module.exports = { app, store }
} else {
  const app = choo()

  if (process.env.APP_ENV !== 'production') {
    app.use(logger())
  }

  app.use(store)

  app.route('/', Layout(require('./views/main')))
  app.route('/:bounds', Layout(require('./views/main')))
  app.route('/about', Layout(AboutView))
  app.route('/about/:hash', Layout(AboutView))
  app.route('/about/:hash/*', Layout(NotFound))
  app.route('/resources', Layout(ResourcesView))
  app.route('/:bounds/*', Layout(NotFound))

  app.mount('#app')
}

function NotFound (state, emit) {
  return html`
    <div>
      <h1>Cette page n'existe pas</h1>
    </div>
  `
}

function Layout (View) {
  return (state, emit) => {
    return html`
      <div id="app">
        ${View(state, emit)}
      </div>
    `
  }
}

function store (state, emitter) {
  state.coords = [50.850340, 4.351710]
  state.zoom = 13
  state.locations = []

  emitter.on('DOMContentLoaded', () => {
    emitter.on('set:coords', setCoords)
    emitter.on('get:locations', getLocations)
    emitter.on('leaflet:popupopen', (message) => {
      console.log(message)
    })

    emitter.emit('get:locations', {})
  })

  function getLocations (payload) {
    const {
      lat = 50.850340,
      lng = 4.351710,
      distanceKm = 1000
    } = payload

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=1000'
      },
      json: true,
      url: `${apiUrl}/locations?latitude=${lat}&longitude=${lng}&distanceKm=${distanceKm}`
    }

    xhr(options, (err, res, body) => {
      if (err) { return }
      const { data } = body

      if (!data.length) return

      const selected = data[0]
      const {lat, lng} = selected.address.location

      state.coords = [lat, lng]
      state.locations = data

      const index = _findIndex(state.locations, { _id: selected._id })
      state.selectedIndex = index

      emitter.emit('render')
    })
  }

  function setCoords (options) {
    state.coords = options.coords
    state.zoom = options.zoom
    emitter.emit('render')
  }
}
