/**
 * Adapted Leaflet-plugin that provides a zoom control with a "Home" button to reset the view
 * @link https://github.com/torfsen/leaflet.zoomhome
 */

((L) => {
  L.Control.ZoomHome = L.Control.extend({
    options: {
      position: 'verticalcenterright',
      zoomInText: '+',
      zoomInTitle: 'Zoom in',
      zoomOutText: '-',
      zoomOutTitle: 'Zoom out',
      zoomHomeTitle: 'Zoom home',
      zoomHomeText: `
        <svg viewBox="0 0 16 16" class="icon icon-mini icon-home">
          <use xlink:href="#icon-home" />
        </svg>
      `
    },

    initialize: function (options) {
      L.Util.setOptions(this, options)
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
      this._map.fire('zoomhome')
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
})(window.L)
