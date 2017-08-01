/**
 * @link https://github.com/choojs/choo
 * @link https://github.com/stackcss/sheetify
 */

// require('babel-polyfill')

const choo = require('choo')
const html = require('choo/html')
const logger = require('choo-log')
const persist = require('choo-persist')
const expose = require('choo-expose')
const css = require('sheetify')

/*
 * Utilities
 */

const _findIndex = require('lodash/findIndex')
// const shuffle = require('lodash/shuffle')
const Nanobounce = require('nanobounce')

const dpckt = require('./lib/depackt-api')

/*
 * Elements
 */

const icon = require('./elements/icon.js')

/*
 * Components
 */

const Leaflet = require('./elements/leaflet.js')
const Search = require('./elements/search.js')
const leaflet = Leaflet()
const search = Search()
const Tabs = require('./elements/tabs.js')
const tabs = Tabs()
const translate = require('./elements/translate.js')
const SearchTypeahead = require('./elements/search-typeahead.js')
const searchTypeahead = SearchTypeahead()

const langs = [
  {
    code: 'fr',
    lang: 'Français'
  },
  {
    code: 'en',
    lang: 'English'
  },
  {
    code: 'de',
    lang: 'Deutsch'
  },
  {
    code: 'nl',
    lang: 'Nederlands'
  }
]

css('./styles/reset.css')
css('./styles/leaflet.css')
css('./styles/MarkerCluster.css')
css('./styles/MarkerCluster.Default.css')
css('./styles/github-markdown.css')
css('./styles/flex.css')
css('./styles/layout.css')
css('./styles/icons.css')

const Layout = require('./views/layout')
const NotFound = require('./views/404')
const AboutView = require('./views/about')
const ResourcesView = require('./views/resources')

const app = choo()

if (process.env.APP_ENV !== 'production') {
  app.use(logger())
  app.use(expose())
  app.use(require('choo-service-worker/clear')())
}

app.use(require('choo-service-worker')())
app.use(require('./lib/translations')())

app.use(persist())
app.use(store)

app.route('/', Layout(main))
app.route('/:bounds', Layout(main))
app.route('/new', Layout(main))
app.route('/directory', Layout(directory))
app.route('/about', Layout(AboutView))
app.route('/about/:hash', Layout(AboutView))
app.route('/about/:hash/*', Layout(NotFound))
app.route('/resources', Layout(ResourcesView))
app.route('/resources/:hash', Layout(ResourcesView))
app.route('/resources/:hash/*', Layout(NotFound))
app.route('/:bounds/*', Layout(NotFound))

app.mount('#app')

function main (state, emit) {
  return html`
    <main role="main">
      ${!state.isMobile ? header() : ''}
      <div id="searchbox" class="${state.tab ? 'tab-open' : 'tab-closed'}">
        <div class="layout column">
          <div id="topbar" class="layout sticky">
            <a href="/" class="logo flex40" title="depackt logo">
              ${icon('logo', {'class': 'icon icon-logo'})}
            </a>
            <ul class="layout flex space-around">
              <li>
                <button class="${state.tab === 'search' ? 'active' : 'inactive'}" aria-label="search" onclick=${(e) => emit('toggle:tab', 'search')}>
                  ${icon('search', {'class': 'icon icon-large icon-search'})}
                </button>
              </li>
              <li>
                <button class="${state.tab === 'countries' ? 'active' : 'inactive'}" aria-label="countries" onclick=${(e) => emit('toggle:tab', 'countries')}>
                  ${icon('world-search', {'class': 'icon icon-large icon-search'})}
                </b>
              </li>
              <li>
                <button class="${state.tab === 'info' ? 'active' : 'inactive'}" aria-label="info" onclick=${(e) => emit('toggle:tab', 'info')}>
                  ${icon('book', {'class': 'icon icon-large icon-book'})}
                </button>
              </li>
            </ul>
          </div>
          <div class="layout column">
            ${tabs.render({
              tab: state.tab,
              tabs: [
                {
                  name: 'search',
                  isComponent: true,
                  opened: state.tab === 'search',
                  el: search.render({
                    input: '',
                    name: 'search-filter-component',
                    translations: state.translations,
                    data: state.locations
                  })
                },
                {
                  name: 'countries',
                  opened: state.tab === 'countries',
                  el: html`<div>Countries</div>`
                },
                {
                  name: 'info',
                  opened: state.tab === 'info',
                  el: require('./views/info')(state, emit)
                }
              ]
            })}
          </div>
        </div>
      </div>
      ${leaflet.render({
        coords: state.coords,
        zoom: state.zoom,
        items: state.locations,
        tiles: state.tiles, // undefined by default if not set if not set by user
        tilesAttribution: state.tilesAttribution,
        selectedIndex: state.selectedIndex,
        mapbox: {
          accessToken: 'pk.eyJ1IjoiYXVnZ29kIiwiYSI6ImNqMmt0emtuaDAwMDAyd2szNmp4ajR0M3gifQ._b3_qqaa1urKCkXhDE5_Qg',
          background: state.mapBackground
        }
      })}
    </main>
  `

  function header () {
    return html`
      <header class="layout">
        <nav role="navigation" class="layout">
          <ul class="layout no-style">
            <li>
              <a class="btn btn-social" title="facebook" href="https://www.facebook.com/depackt" rel="noopener noreferrer" target="_blank">
                ${icon('facebook', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            <li>
              <a class="btn btn-social" title="tweets" href="https://twitter.com/depackt_" rel="noopener noreferrer" target="_blank">
                ${icon('twitter', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            <li>
              <a class="btn btn-social" title="contribute" href="https://github.com/depackt" rel="noopener noreferrer" target="_blank">
                ${icon('github', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            <li>
              <a class="btn btn-social" title="crypto" href="https://keybase.io/auggod" rel="noopener noreferrer" target="_blank">
                ${icon('keybase', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            <li>
              <button class="btn btn-default btn-dropdown${state.dropdownOpen ? ' open' : ''}" onclick=${(e) => emit('toggle:lang', state.lang)}>${state.lang}</button>
              ${state.dropdownOpen ? html`
                <ul class="dropdown-menu">
                  ${langs.map(langItem)}
                </ul>
              ` : ''}
            </li>
            <li>
              <a class="btn btn-default" href="/directory">Directory</a>
            </li>
            <li>
              <a class="btn btn-default" href="/about">${translate(state.translations, {term: 'ABOUT'})}</a>
            </li>
            <li>
              <a class="btn btn-default" href="/resources">${translate(state.translations, {term: 'RESOURCES'})}</a>
            </li>
          </ul>
        </nav>
      </header>
    `

    function langItem (item) {
      if (state.lang !== item.code) {
        return html`
          <li>
            <button class="btn btn-default" onclick=${(e) => lang(item.code)}>${item.lang}</button>
          </li>
        `
      }
    }

    function lang (lang) {
      emit('load:translations', lang)
      emit('toggle:lang', lang)
    }
  }
}

function directory (state, emit) {
  return html`
    <main role="main" class="layout">
      <header class="layout top-bar">
        <div class="layout flex">
          <button class="btn btn-burger" aria-label="open panel">
            ${icon('burger', {'class': 'icon icon-medium icon-burger'})}
          </button>
          <h1 class="layout page-title">
            Directory
          </h1>
        </div>
        <div class="flex">
          <a href="/" class="layout justify-center" style="padding-top:12px;overflow:hidden;height:60px;">
            ${icon('logo', {'class': 'icon icon-logo'})}
          </a>
        </div>
        <div class="layout flex flex-end">
          <ul class="layout no-style">
            <li>
              <a class="btn btn-default" href="/about">${translate(state.translations, {term: 'ABOUT'})}</a>
            </li>
            <li>
              <a class="btn btn-default" href="/resources">${translate(state.translations, {term: 'RESOURCES'})}</a>
            </li>
            <li style="position:relative;margin-right:1rem;">
              <button class="btn btn-default btn-dropdown${state.dropdownOpen ? ' open' : ''}" onclick=${(e) => emit('toggle:lang', state.lang)}>${state.lang}</button>
              ${state.dropdownOpen ? html`
                <ul class="dropdown-menu" style="right:0;">
                  ${langs.map(langItem)}
                </ul>
              ` : ''}
            </li>
          </ul>
        </div>
      </header>
      <ul class="layout row-wrap no-style image-grid">
         ${state.locations.map((item) => {
           return html`
              <li class="image-grid-item">
                <div class="image" style="background: url(${item.cover.src}) 50% 50% / cover no-repeat rgb(255, 255, 255);"></div>
              </li>
           `
         })}
      </ul>
      ${searchTypeahead.render({
        input: state.search || '',
        name: 'search-typeahead',
        selection: state.selection || [],
        translations: state.translations,
        data: state.results // fallback to locations if no results
      })}
    </main>
  `

  function langItem (item) {
    if (state.lang !== item.code) {
      return html`
        <li>
          <button class="btn btn-default" onclick=${(e) => lang(item.code)}>${item.lang}</button>
        </li>
      `
    }
  }

  function lang (lang) {
    emit('load:translations', lang)
    emit('toggle:lang', lang)
  }
}

function store (state, emitter) {
  state.lang = state.lang || 'fr'

  state.form = {
    email: '',
    text: ''
  }

  state.dropdownOpen = state.dropdownOpen || false
  state.translations = state.translations || {}
  state.coords = [50.850340, 4.351710]
  state.zoom = 13
  state.locations = state.locations || []
  state.results = state.results || []
  state.search = state.search || ''
  state.tab = 'search'
  state.isMobile = !window.matchMedia('(min-width:960px)').matches
  state.tiles = state.tiles || undefined
  state.tilesAttribution = state.tilesAttribution || undefined
  state.mapBackground = state.mapBackground || 'light'
  state.selection = state.selection || []

  emitter.on('DOMContentLoaded', () => {
    search.on('itemselected', (item) => {
      leaflet.emit('zoomtoselected', item)
      if (window.matchMedia('(max-width: 960px)').matches) {
        emitter.emit('toggle:tab', state.tab)
      }
    })

    searchTypeahead.on('selection', (payload) => {
      state.selection = payload
      emitter.emit('render')
    })

    searchTypeahead.on('search', (payload) => {
      console.log(payload)
      state.results = payload.results
      state.search = payload.query
      emitter.emit('render')
    })

    emitter.emit('load:translations', state.lang)
    emitter.on('set:coords', setCoords)
    emitter.on('get:locations', getLocations)
    emitter.on('toggle:lang', () => {
      state.dropdownOpen = !state.dropdownOpen
      emitter.emit('render')
    })

    emitter.on('sw:installed', sw)

    emitter.on('toggle:tab', toggleTab)

    getLocations({})

    const nanobounce = Nanobounce()

    window.onresize = callback

    function callback () {
      const prev = Object.assign({}, state)
      nanobounce(() => {
        emitter.emit('log:debug', 'Called onResize event')
        state.isMobile = !window.matchMedia('(min-width:960px)').matches
        if (prev.isMobile !== state.isMobile) {
          state.header = !state.isMobile
        }
        emitter.emit('render')
      })
    }
  })

  function toggleTab (tab) {
    const opened = state.tab === tab
    state.tab = opened ? '' : tab
    emitter.emit('render')
  }

  function sw (registration) {
    if (registration.active) {
      console.log(registration)
    }
  }

  function getLocations (payload) {
    const {
      lat = 50.850340,
      lng = 4.351710,
      distanceKm = 1000
    } = payload

    dpckt.getLocations({lat, lng, distanceKm}).then((response) => {
      const { data } = response
      if (!data.length) return

      const selected = data[0]
      const {lat, lng} = selected.address.location
      state.coords = [lat, lng]
      state.locations = data

      const index = _findIndex(state.locations, { _id: selected._id })
      state.selectedIndex = index

      emitter.emit('render')
    }).catch((err) => {
      if (err) console.log(err)
    })
  }

  function setCoords (options) {
    state.coords = options.coords
    state.zoom = options.zoom
    emitter.emit('render')
  }
}
