const html = require('choo/html')
const Leaflet = require('../elements/leaflet.js')
const Search = require('../elements/search.js')
const leaflet = Leaflet()
const search = Search()
const icon = require('../elements/icon.js')

module.exports = (state, emit) => {
  leaflet.on('popupopen', (message) => {
    emit('leaflet:popupopen', message)
  })

  return html`
    <main>
      <div id="searchbox">
        <div class="layout column">
          <div id="topbar" class="layout sticky">
            <a class="logo flex40" href="/">
              ${icon('logo', {'class': 'icon icon-logo'})}
            </a>
            <ol role="tablist" class="layout flex space-around">
              <li id="tab1" role="tab">
                <button class="Search-btn ${state.searchVisible ? 'active' : 'inactive'}" onclick=${(e) => emit('toggle:search')}>
                  ${icon('search', {'class': 'icon icon-large icon-search'})}
                </button>
              </li>
              <li id="tab2" role="tab">
                <a href="/#locations">
                  ${icon('world-search', {'class': 'icon icon-large icon-search'})}
                </a>
              </li>
              <li id="tab3" role="tab">
                <a href="/#learn-more">
                  ${icon('book', {'class': 'icon icon-large icon-book'})}
                </a>
              </li>
            </ol>
          </div>
          <div class="layout column">
            <div id="search" role="tabpanel" aria-labelledby="tab1">
              ${search.render({
                input: '',
                data: state.locations
              })}
            </div>
            <div id="locations" role="tabpanel" aria-labelledby="tab2">Locations</div>
            <div id="learn-more" role="tabpanel" aria-labelledby="tab3">Plus d'infos</div>
          </div>
        </div>
      </div>
      <div id="mapcontainer">
        ${leaflet.render({
          coords: state.coords,
          zoom: state.zoom,
          items: state.locations,
          selectedIndex: state.selectedIndex,
          mapbox: {
            accessToken: 'pk.eyJ1IjoiYXVnZ29kIiwiYSI6ImNqMmt0emtuaDAwMDAyd2szNmp4ajR0M3gifQ._b3_qqaa1urKCkXhDE5_Qg'
          }
        })}
      </div>
    </main>
  `
}
