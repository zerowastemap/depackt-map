const xhr = require('xhr')
const nanobounce = require('nanobounce')()
const dpckt = require('./lib/depackt-api')

module.exports = Store

function Store (components) {
  const {
    select,
    leaflet,
    search,
    directorySearch,
    rangeSlider,
    translateChooser
  } = components

  return (state, emitter) => {
    state.title = 'Depackt'
    state.appVersion = '2.0.0-4'
    state.lang = state.lang || 'fr'
    state.countries = state.countries || []

    state.settings = state.settings || {
      distanceKm: 150
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
      },
      {
        code: 'de',
        lang: 'Deutsch'
      },
      {
        code: 'nl',
        lang: 'Nederlands'
      }
    ] || state.langs

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

    emitter.on('log:debug', function (msg) {
      console.log(msg)
    })

    emitter.on(state.events.NAVIGATE, () => {
      if (!state.params.hash) {
        window.scrollTo(0, 0)
      }
    })

    emitter.on(state.events.NAVIGATE, () => {
      state.sideBarOpen = false
    })

    emitter.on(state.events.DOMCONTENTLOADED, () => {
      rangeSlider.on('progress', sliderProgress) // To set distanceKm when user move slider in settings
      select.on('select', onCountrySelected) // Update locations when use select a country/city in list

      translateChooser.on('choice', (props) => {
        emitter.emit('load:translations', props.code)
      })

      leaflet.on('select', onLeafletSelect) // Update selected item when user open a popup on map

      leaflet.on('locationfound', onLocationFound)

      search.on('select', onSearchSelect)

      directorySearch.on('selection', onDirectorySelection)
      directorySearch.on('search', onDirectorySearch)
      directorySearch.on('showMap', redirectToMap)

      emitter.emit('load:translations', state.lang)

      emitter.on('set:coords', setCoords)
      emitter.on('get:locations', getLocations)
      emitter.on('get:countries', getCountries)

      emitter.on('send:mail', sendMail)

      emitter.on('toggle:sidebar', () => {
        state.sideBarOpen = !state.sideBarOpen
        emitter.emit('render')
      })

      emitter.on('sw:installed', sw)

      emitter.on('toggle:tab', toggleTab)

      /*
       * Get bounds in url params
       * https://maps.depackt.be/@lat,lng
       */

      const bounds = state.params.bounds
        ? state.params.bounds.split(',').map((item) => item.includes('@') ? item.substring(1) : item)
        : state.defaultBounds

      const lat = isNaN(bounds[0]) ? state.defaultBounds.lat : bounds[0]
      const lng = isNaN(bounds[1]) ? state.defaultBounds.lng : bounds[1]

      getLocations({ lat, lng }) // init locations data

      getCountries() // loat country/city list

      getGrid() // load image grid in /directory

      window.onresize = onResize // state.isMobile
    })

    function onLocationFound (bounds) {
      const { lat, lng } = bounds
      getLocations({ lat, lng }, (err) => {
        if (err) throw err
        emitter.emit('pushState', `/@${lat},${lng}`)
      })
    }

    /*
     * Main filter/search system
     */

    function onSearchSelect (item) {
      const { lat, lng } = item.address.location
      const index = state.locations.findIndex((location) => location._id === item._id)

      state.coords = [lat, lng]
      state.selected = item
      state.selectedIndex = index

      emitter.emit('render')

      if (window.matchMedia('(max-width: 960px)').matches) {
        emitter.emit('toggle:tab', state.tab)
      }
    }

    /*
     * Leaflet component events
     */

    function onLeafletSelect (item) {
      const { lat, lng } = item.address.location
      const index = state.locations.findIndex((location) => location._id === item._id)

      state.coords = [lat, lng]
      state.selected = item
      state.selectedIndex = index

      emitter.emit('render')
    }

    /*
     * Update state.isMobile on window.resize event
     */

    function onResize () {
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

    /*
     * Directory component events
     */

    function onDirectorySelection (payload) {
      state.selection = payload
      emitter.emit('render')
    }

    function onDirectorySearch (payload) {
      state.results = payload.results
      state.search = payload.query
      emitter.emit('render')
    }

    function redirectToMap (item) {
      const { lat, lng } = item.address.location
      const index = state.locations.findIndex((location) => location._id === item._id)

      if (index !== -1) {
        state.coords = [lat, lng]
        state.selected = item
        state.selectedIndex = index

        emitter.emit('pushState', `/@${lat},${lng}`)
      } else {
        getLocations({ lat, lng }, (err) => {
          if (err) throw err
          emitter.emit('pushState', `/@${lat},${lng}`)
        })
      }
    }

    function getGrid () {
      const payload = {
        query: '', // get everything
        selection: ['grocery-store', 'market'] // pics from these should be nicer
      }

      dpckt.search(payload).then(response => {
        const { data } = response
        if (!data.length) return

        state.grid = data.map(item => ({ src: item.cover.src }))

        emitter.emit('render')
      }).catch(err => {
        if (err) console.log(err)
      })
    }

    /*
     * Country/City list
     */

    function onCountrySelected (item) {
      const { lat, lng } = item.coords
      state.coords = [lat, lng]
      state.city = item.name

      getLocations({ lat, lng })
    }

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

    /*
     * Settings
     */

    function sliderProgress (props) {
      const { value } = props
      state.settings.distanceKm = value
      getLocations({
        lat: state.coords[0],
        lng: state.coords[1]
      })
    }

    /*
     * Main drawer
     */

    function toggleTab (tab) {
      state.tab = state.tab === tab ? '' : tab
      emitter.emit('render')
    }

    /*
     * Service worker
     */

    function sw (registration) {
      if (registration.active) {
        console.log(registration)
      }
    }

    /*
     * Locations
     */

    function getLocations (payload, cb) {
      const {
        lat = 50.850340,
        lng = 4.351710,
        distanceKm = state.settings.distanceKm
      } = payload

      dpckt.getLocations({lat, lng, distanceKm}).then(response => {
        const { data } = response
        if (!data.length) return

        const selected = data[0]
        const {lat, lng} = selected.address.location
        state.coords = [lat, lng]
        state.locations = data
        state.city = selected.address.city

        const index = state.locations.findIndex((location) => location._id === selected._id)

        state.selectedIndex = index

        emitter.emit('render')

        if (typeof cb === 'function' && cb()) {
          cb()
        }
      }).catch(err => {
        if (err) console.log(err)
      })
    }

    function setCoords (options) {
      state.coords = options.coords
      state.zoom = options.zoom
      emitter.emit('render')
    }

    function sendMail (data) {
      state.submitted = true
      state.form = data.payload
      emitter.emit('render')

      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=1000'
        },
        method: 'POST',
        json: true,
        body: data.payload,
        url: `/new`
      }

      xhr(options, (err, res, body) => {
        state.sent = !err
        state.failed = !!err
        state.form = data.payload
        emitter.emit('render')
      })
    }
  }
}
