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
const xhr = require('xhr')
const Slider = require('./elements/slider')
const slider = Slider()
const serialize = require('form-serialize')

/*
 * Utilities
 */

const _findIndex = require('lodash/findIndex')
// const shuffle = require('lodash/shuffle')
const Nanobounce = require('nanobounce')
const nanobounce = Nanobounce()

const dpckt = require('./lib/depackt-api')

/*
 * Elements
 */

const icon = require('./elements/icon.js')
const sideBar = require('./elements/side-bar.js')

/*
 * Components
 */

const Leaflet = require('./elements/leaflet.js')
const Search = require('./elements/search.js')
const Select = require('./elements/select.js')
const select = Select()
const leaflet = Leaflet()
const search = Search()
const Tabs = require('./elements/tabs.js')
const tabs = Tabs()
const SearchTypeahead = require('./elements/search-typeahead.js')
const searchTypeahead = SearchTypeahead()
const Header = require('./elements/header.js')
const ImageGrid = require('./elements/grid')
const imageGrid = ImageGrid()

css('./styles/reset.css')
css('tachyons')
css('./styles/leaflet.css')
css('./styles/MarkerCluster.css')
css('./styles/MarkerCluster.Default.css')
css('./styles/github-markdown.css')
css('./styles/flex.css')
css('./styles/layout.css')
css('./styles/checkbox.css')
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

app.route('/', main)
app.route('/:bounds', main)
app.route('/new', Layout(require('./views/new')))
app.route('/settings', Layout(settings))
app.route('/directory', Layout(directory))
app.route('/about', Layout(AboutView))
app.route('/about/:hash', Layout(AboutView))
app.route('/about/:hash/*', Layout(NotFound))
app.route('/resources', Layout(ResourcesView))
app.route('/resources/:hash', Layout(ResourcesView))
app.route('/resources/:hash/*', Layout(NotFound))
app.route('/privacy', Layout(require('./views/privacy')))
app.route('/impressum', Layout(require('./views/impressum')))
app.route('/:bounds/*', Layout(NotFound))

app.mount('#app')

const mainTitle = 'Carte du zéro déchet'
const directoryTitle = 'Directory'

function main (state, emit) {
  if (state.title !== mainTitle) emit(state.events.DOMTITLECHANGE, mainTitle)

  return html`
    <div id="app" class="layout ${state.sideBarOpen ? 'js-sidebar--open' : 'js-sidebar--closed'}">
      <div style=${state.sideBarOpen ? 'display:flex;' : 'display:none;'} class="layout flex25 fixed static-l">
        ${sideBar(state, emit)}
      </div>
      <main class="layout column flex" style="width:100%;position:relative;" role="main">
        ${!state.isMobile ? header() : ''}
        <div id="searchbox" class="${state.tab ? 'js-tab--open' : 'js-tab--closed'}">
          <div class="layout column">
            <div id="topbar" class="layout sticky">
              <button onclick=${(e) => emit('toggle:sidebar')} class="layout justify-center flex40 logo" title="depackt logo">
                ${icon('logo-burger', {'class': 'icon icon-logo'})}
              </button>
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
                      city: state.city,
                      translations: state.translations,
                      selected: state.selected || {},
                      radius: state.settings.distanceKm,
                      data: state.locations
                    })
                  },
                  {
                    name: 'countries',
                    isComponent: true,
                    opened: state.tab === 'countries',
                    el: select.render({
                      input: '',
                      name: 'filter-countries-component',
                      items: state.countries
                    })
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
          sideBarOpen: state.sideBarOpen, // to update/resize map when sidebar toggle
          id: 'map',
          selectedIndex: state.selectedIndex,
          tiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          mapbox: {},
          tilesAttribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })}
      </main>
    </div>
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
                <ul class="dropdown-menu bg-white shadow-6" style="right:0;">
                  ${state.langs.map(langItem)}
                </ul>
              ` : ''}
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
  if (state.title !== directoryTitle) emit(state.events.DOMTITLECHANGE, directoryTitle)

  return html`
    <main role="main" class="layout flex">
      ${Header(state, emit)}
      ${state.sideBarOpen ? sideBar(state, emit) : ''}
      <section role="section" id="directory" class="layout w-100">
        ${imageGrid.render({
          items: state.grid
        })}
        ${searchTypeahead.render({
          input: state.search || '',
          name: 'search-typeahead',
          selection: state.selection || [],
          translations: state.translations,
          data: state.results // fallback to locations if no results
        })}
      </section>
    </main>
  `
}

function store (state, emitter) {
  state.title = 'Depackt'
  state.lang = state.lang || 'fr'
  state.countries = state.countries || []

  state.settings = state.settings || {
    distanceKm: 50
  }

  state.form = {
    email: '',
    text: ''
  }

  state.langs = [
    {
      code: 'fr',
      lang: 'Français'
    },
    {
      code: 'en',
      lang: 'English'
    }
  ]

  state.dropdownOpen = false
  state.sideBarOpen = false
  state.selected = state.selected || {}
  state.defaultBounds = {lat: 50.850340, lng: 4.351710} // bruxelles
  state.grid = state.grid || []
  state.translations = state.translations || {}
  state.coords = state.coords || [50.850340, 4.351710]
  state.city = state.city || 'Bruxelles'
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

  emitter.on(state.events.DOMCONTENTLOADED, () => {
    /**
     * Set distanceKm when user move slider in settings
     */
    slider.on('progress', (percent) => {
      const max = 1000 // max distance in km

      state.settings.distanceKm = Math.round((max / 100) * percent)

      getLocations({ lat: state.coords[0], lng: state.coords[1] })
    })

    /**
     * Update locations when use select a country/city in list
     * TODO change name for componenent select
     */

    select.on('select', (item) => {
      const { lat, lng } = item.coords
      state.coords = [lat, lng]
      state.city = item.name

      getLocations({ lat, lng })
    })

    /**
     * Update selected item when user open a popup on map
     */

    leaflet.on('select', (item) => {
      const { lat, lng } = item.address.location
      state.coords = [lat, lng]
      state.selected = item
      const index = _findIndex(state.locations, { _id: item._id })
      state.selectedIndex = index

      emitter.emit('render')
    })

    /*
     * Set selection when user select a location in search/filter list
     * Auto zoom on marker on map
     */

    leaflet.on('zoomtoselected', (item) => {
      const { lat, lng } = item.address.location
      emitter.emit('pushState', `/@${lat},${lng}`)
    })

    search.on('select', (item) => {
      const { lat, lng } = item.address.location
      state.coords = [lat, lng]
      state.selected = item
      const index = _findIndex(state.locations, { _id: item._id })
      state.selectedIndex = index

      leaflet.emit('zoomtoselected', item)

      if (window.matchMedia('(max-width: 960px)').matches) {
        emitter.emit('toggle:tab', state.tab)
      }
    })

    emitter.on('toggle:sidebar', () => {
      state.sideBarOpen = !state.sideBarOpen
      emitter.emit('render')
    })

    /*
     * TODO change component name
     */

    searchTypeahead.on('selection', (payload) => {
      state.selection = payload
      emitter.emit('render')
    })

    searchTypeahead.on('search', (payload) => {
      state.results = payload.results
      state.search = payload.query
      emitter.emit('render')
    })

    searchTypeahead.on('showMap', (payload) => {
      const {lat, lng} = payload
      getLocations({ lat, lng })
      emitter.emit('pushState', `/@${lat},${lng}`)
    })

    emitter.emit('load:translations', state.lang)

    emitter.on('set:coords', setCoords)
    emitter.on('get:locations', getLocations)
    emitter.on('get:countries', getCountries)

    emitter.on('toggle:lang', () => {
      state.dropdownOpen = !state.dropdownOpen
      emitter.emit('render')
    })

    emitter.on('sw:installed', sw)

    emitter.on('toggle:tab', toggleTab)

    const bounds = state.params.bounds
      ? state.params.bounds.split(',').map((item) => item.includes('@') ? item.substring(1) : item)
      : state.defaultBounds

    const lat = isNaN(bounds[0]) ? state.defaultBounds.lat : bounds[0]
    const lng = isNaN(bounds[1]) ? state.defaultBounds.lng : bounds[1]

    getLocations({ lat, lng })

    getCountries()

    getGrid()

    /**
     * Update state.isMobile on window.resize event
     */

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

  function getGrid () {
    dpckt.search({query: '', selection: ['grocery-store', 'market']}).then((response) => {
      const { data } = response
      if (!data.length) return

      state.grid = data.map((item) => {
        return { src: item.cover.src }
      })

      emitter.emit('render')
    }).catch((err) => {
      if (err) console.log(err)
    })
  }

  /**
   * XHR for getting countries list to show in
   * select city/country list
   */

  function getCountries () {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=1000'
      },
      json: true,
      url: `/assets/countries.json`
    }

    xhr(options, (err, res, body) => {
      if (err) { return }
      const { data } = body
      state.countries = data
      emitter.emit('render')
    })
  }

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
      distanceKm = state.settings.distanceKm
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

function settings (state, emit) {
  if (state.title !== 'Settings') emit(state.events.DOMTITLECHANGE, 'Settings')
  return html`
    <main role="main" class="layout flex">
      ${Header(state, emit)}
      ${state.sideBarOpen ? html`
        <nav class="layout flex25 fixed" id="sidebar">
          ${state.isMobile ? html`
          <button class="btn-close" onclick=${(e) => emit('toggle:sidebar')}>${icon('close', {'class': 'icon icon-small icon-white icon-close'})}</button>` : ''}
          ${sideBar(state, emit)}
        </nav>` : ''}
        <section role="section" id="page" class="layout column flex">
          <form id="settings" class="pa2 mt3 w-100" onsubmit=${handleSubmit}>
            <fieldset class="ba b--transparent ph0 mh0">
              <legend class="mh3 pa3">Carte</legend>
              <div class="mh3 mb3">
                <label for="progress" class="f6 b db mb2">Rayon en km (actuel: ${state.settings.distanceKm || 50}, default: 50, max: 1000)</label>
                ${!module.parent ? slider.render({
                  progress: ((state.settings.distanceKm || 50) / 1000) * 100,
                  name: 'slider'
                }) : ''}
              </div>
            </fieldset>
          </form>
      </section>
    </main>
  `

  function handleSubmit (e) {
    e.preventDefault()
    const obj = serialize(document.querySelector('#settings'), { hash: true })

    console.log(obj)
  }
}
