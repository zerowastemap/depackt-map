/**
 * Component adapted from
 * @link https://github.com/yoshuawuyts/nanocomponent/blob/master/example/leaflet.js
 * Other
 * @link http://leafletjs.com/
 * @link https://github.com/yoshuawuyts/microcomponent
 */

const microcomponent = require('microcomponent')
const L = require('leaflet')
require('leaflet.markercluster')
const onIdle = require('on-idle')
const html = require('choo/html')
const _map = require('lodash/fp/map').convert({ 'cap': false })
const _flow = require('lodash/fp/flow')

module.exports = Leaflet

function Leaflet () {
  const component = microcomponent({
    coords: [50.850340, 4.351710],
    zoom: 15,
    items: [], // data items used to create markers and popups
    selectedIndex: 0,
    mapbox: {
      accessToken: '',
      background: 'light'
    },
    state: {
      map: null,
      markers: null
    }
  })

  const markersLayer = L.markerClusterGroup()

  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)

  component.on('zoomToSelected', (index) => {
    const selected = component.state.markers[index]
    markersLayer.zoomToShowLayer(selected.marker, () => {
      selected.marker.openPopup()
    })
  })

  return component

  function render () {
    if (!component.state.map) {
      component._element = html`<div id="map"></div>`
      if (component._hasWindow) {
        _createMap()
        _addMarkers()
      }
    } else {
      onIdle(function () {
        _updateMap()
      })
    }

    return component._element
  }

  function update (props) {
    return props.coords[0] !== component.props.coords[0] ||
      props.coords[1] !== component.props.coords[1]
  }

  function load () {
    component.state.map.invalidateSize()
  }

  function unload () {
    component.state.map.remove()
    component.state = {}
    component._element = null
  }

  function _addMarkers () {
    markersLayer.clearLayers()
    const { items = [] } = component.props

    const { background = 'light' } = component.props.mapbox
    const colorInvert = background === 'light' ? 'dark' : 'light'

    const customOptions = {
      'maxWidth': '240',
      'className': 'custom'
    }

    const defaultIcon = L.divIcon({
      className: 'default-marker-icon',
      html: `
        <svg viewBox="0 0 16 16" class="icon icon-large icon-${colorInvert} icon-marker">
          <use xlink:href="#icon-marker" />
        </svg>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    })

    const featuredIcon = L.divIcon({
      className: 'featured-marker-icon',
      html: `
        <svg viewBox="0 0 16 16" class="icon icon-large icon-${colorInvert} icon-marker">
          <use xlink:href="#icon-marker-star" />
        </svg>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    })

    const markers = _flow(
      _map((item, index) => {
        const { lat, lng } = item.address.location
        const marker = L.marker([lat, lng], { icon: item.featured ? featuredIcon : defaultIcon })
        marker._index = index
        marker.bindPopup(_customPopup(item), customOptions)
        markersLayer.addLayer(marker)
        return {
          item,
          marker
        }
      })
    )(items)

    component.state.markers = markers

    return markers
  }

  function _customPopup (item) {
    const { url, title, cover } = item
    const { streetName, streetNumber, zip, city } = item.address
    const template = `
      <a href=${url} target="_blank" rel="noopener" class="external">
        <div class="cover">
          <div class="image" style="background: url(${cover.src}) center center/cover no-repeat #333"></div>
        </div>
        <div class="title">
          ${title}
          <svg viewBox="0 0 16 16" class="icon icon-small icon-arrow-north-east">
            <use xlink:href="#icon-arrow-north-east" />
          </svg>
        </div>
        <div class="address">
          ${streetName}, ${streetNumber} ${zip} ${city}
        </div>
      </a>
    `

    return template
  }

  function _createMap () {
    const element = component._element
    const { coords, zoom } = component.props
    const { accessToken, background = 'light' } = component.props.mapbox

    const tiles = `https://api.mapbox.com/styles/v1/mapbox/${background}-v9/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`

    const options = {
      center: coords,
      zoom,
      zoomControl: false,
      scrollWheelZoom: false
    }

    const map = L.map(element, options)

    const tileLayer = L.tileLayer(tiles, {
      attribution: '&copy; <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
    })

    tileLayer.addTo(map)

    map.on('home', (e) => {
      _updateMap()
    })

    /**
     * Enable/disable scrollWheelZoom
     */

    map.once('focus', () => map.scrollWheelZoom.enable())

    map.on('click', () => {
      if (map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.disable()
      } else {
        map.scrollWheelZoom.enable()
      }
    })

    /**
     * Init Leaflet.markercluster
     * @link https://github.com/Leaflet/Leaflet.markercluster
     */

    markersLayer.addTo(map)

    /**
     * How to locate leaflet zoom control in a desired position
     * @link https://stackoverflow.com/questions/33614912/how-to-locate-leaflet-zoom-control-in-a-desired-position
     */

    function addControlPlaceholders (map) {
      const corners = map._controlCorners
      const l = 'leaflet-'
      const container = map._controlContainer

      function createCorner (vSide, hSide) {
        const className = l + vSide + ' ' + l + hSide

        corners[vSide + hSide] = L.DomUtil.create('div', className, container)
      }

      createCorner('verticalcenter', 'left')
      createCorner('verticalcenter', 'right')
    }

    addControlPlaceholders(map)

    /**
     * Center leaflet popup AND marker to the map
     * @link https://stackoverflow.com/questions/22538473/leaflet-center-popup-and-marker-to-the-map
     */

    map.on('popupopen', (e) => {
      component.emit('popupopen', 'Popup opened')

      const px = map.project(e.popup._latlng) // find the pixel location on the map where the popup anchor is
      px.y -= e.popup._container.clientHeight / 2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
      map.panTo(map.unproject(px), {animate: true}) //
    })

    L.control.scale({position: 'verticalcenterright'}).addTo(map)

    /**
     * Adapted Leaflet-plugin that provides a zoom control with a "Home" button to reset the view
     * @link https://github.com/torfsen/leaflet.zoomhome
     */

    L.Control.ZoomHome = L.Control.extend({
      options: {
        position: 'verticalcenterright',
        zoomInText: '+',
        zoomInTitle: 'Zoom in',
        zoomOutText: '-',
        zoomOutTitle: 'Zoom out',
        zoomHomeText: `
          <svg viewBox="0 0 16 16" class="icon icon-mini icon-home">
            <use xlink:href="#icon-home" />
          </svg>
        `,
        zoomHomeTitle: 'Zoom home'
      },

      onAdd: function (map) {
        const controlName = 'gin-control-zoom'
        const container = L.DomUtil.create('div', controlName + ' leaflet-bar')
        const options = this.options

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
          controlName + '-in', container, this._zoomIn)
        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
          controlName + '-home', container, this._zoomHome)
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
          controlName + '-out', container, this._zoomOut)

        this._updateDisabled()
        map.on('zoomend zoomlevelschange', this._updateDisabled, this)

        return container
      },

      onRemove: function (map) {
        map.off('zoomend zoomlevelschange', this._updateDisabled, this)
      },

      _zoomIn: function (e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1)
      },

      _zoomOut: function (e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1)
      },

      _zoomHome: function (e) {
        map.fire('home')
      },

      _createButton: function (html, title, className, container, fn) {
        const link = L.DomUtil.create('a', className, container)
        link.innerHTML = html
        link.href = '#'
        link.title = title

        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
          .on(link, 'click', L.DomEvent.stop)
          .on(link, 'click', fn, this)
          .on(link, 'click', this._refocusOnMap, this)

        return link
      },

      _updateDisabled: function () {
        const map = this._map
        const className = 'leaflet-disabled'

        L.DomUtil.removeClass(this._zoomInButton, className)
        L.DomUtil.removeClass(this._zoomOutButton, className)

        if (map._zoom === map.getMinZoom()) {
          L.DomUtil.addClass(this._zoomOutButton, className)
        }
        if (map._zoom === map.getMaxZoom()) {
          L.DomUtil.addClass(this._zoomInButton, className)
        }
      }
    })

    const zoomHome = new L.Control.ZoomHome()

    zoomHome.addTo(map)

    component.state.map = map
  }

  function _updateMap () {
    const { coords, zoom } = component.props
    _addMarkers()
    component.state.map.setView(coords, zoom)
  }
}
