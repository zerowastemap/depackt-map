const html = require('choo/html')
const Leaflet = require('../elements/leaflet.js')
const Search = require('../elements/search.js')
const leaflet = Leaflet()
const search = Search()
const icon = require('../elements/icon.js')
const Tabs = require('../elements/tabs.js')
const tabs = Tabs()
const translate = require('../elements/translate.js')

search.on('itemselected', (item) => {
  leaflet.emit('zoomtoselected', item)
  if (window.matchMedia('(max-width: 960px)').matches) {
    window.choo.emit('toggletab', window.choo.state.tab)
  }
})

module.exports = (state, emit) => {
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
                <button class="${state.tab === 'search' ? 'active' : 'inactive'}" aria-label="search" onclick=${(e) => emit('toggletab', 'search')}>
                  ${icon('search', {'class': 'icon icon-large icon-search'})}
                </button>
              </li>
              <li>
                <button class="${state.tab === 'countries' ? 'active' : 'inactive'}" aria-label="countries" onclick=${(e) => emit('toggletab', 'countries')}>
                  ${icon('world-search', {'class': 'icon icon-large icon-search'})}
                </b>
              </li>
              <li>
                <button class="${state.tab === 'info' ? 'active' : 'inactive'}" aria-label="info" onclick=${(e) => emit('toggletab', 'info')}>
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
                    placeholder: translate(state.translations, { term: 'SEARCH_PLACEHOLDER' }),
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
                  el: html`<div>Info</div>`
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
              <a class="btn btn-social" title="depackt sur facebook" href="https://www.facebook.com/depackt" rel="noopener noreferrer" target="_blank">
                ${icon('facebook', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            <li>
              <a class="btn btn-social" title="depackt sur twitter" href="https://twitter.com/depackt_" rel="noopener noreferrer" target="_blank">
                ${icon('twitter', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            <li>
              <a class="btn btn-default" href="/about">A propos</a>
            </li>
            <li>
              <a class="btn btn-default" href="/resources">Resources</a>
            </li>
          </ul>
        </nav>
      </header>
    `
  }
}
