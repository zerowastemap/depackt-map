const html = require('choo/html')
const icon = require('../elements/icon')
const mainTitle = 'Carte du zéro déchet'
const sideBar = require('../elements/side-bar')

module.exports = (components) => {
  const { leaflet, tabs, select, search, translateChooser } = components

  return (state, emit) => {
    if (state.title !== mainTitle) emit(state.events.DOMTITLECHANGE, mainTitle)

    return html`
    <div id="app" class="flex ${state.sideBarOpen ? 'js-sidebar--open' : 'js-sidebar--closed'}">
      ${state.sideBarOpen ? html`
        <div class="flex flex25 fixed static-l">
           ${sideBar(state, emit)}
        </div>
      ` : ''}
      <main class="flex flex-column flex-auto flex-even relative w-100" role="main">
        <div id="searchbox" class="${state.tab ? 'js-tab--open' : 'js-tab--closed'}">
          <div class="flex flex-column">
            <div id="topbar" class="flex sticky">
              <button class="flex justify-center flex40 logo pa0 ba white bg-transparent b--transparent" type="button" onclick=${(e) => emit('toggle:sidebar')} title="depackt logo">
                ${icon('logo-burger', {'class': 'icon icon-logo'})}
              </button>
              <ul class="list ma0 pa0 flex flex-auto">
                <li class="flex flex-auto justify-center">
                  <button type="button" class="pa0 ba white bg-transparent b--transparent ${state.tab === 'search' ? 'active' : 'inactive'}" aria-label="search" onclick=${(e) => emit('toggle:tab', 'search')}>
                    ${icon('search', {'class': 'icon icon-large icon-search'})}
                  </button>
                </li>
                <li class="flex flex-auto justify-center">
                  <button type="button" class="pa0 ba white bg-transparent b--transparent ${state.tab === 'countries' ? 'active' : 'inactive'}" aria-label="countries" onclick=${(e) => emit('toggle:tab', 'countries')}>
                    ${icon('world-search', {'class': 'icon icon-large icon-search'})}
                  </b>
                </li>
                <li class="flex flex-auto justify-center">
                  <button type="button" class="pa0 ba white bg-transparent b--transparent ${state.tab === 'info' ? 'active' : 'inactive'}" aria-label="info" onclick=${(e) => emit('toggle:tab', 'info')}>
                    ${icon('book', {'class': 'icon icon-large icon-book'})}
                  </button>
                </li>
              </ul>
            </div>
            <div class="flex flex-column">
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
                    el: require('./info')(state, emit)
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
        ${!state.isMobile ? header() : ''}
      </main>
    </div>
  `

    function header () {
      return html`
      <header class="flex absolute top-1 right-1 right-top-bar">
        <nav role="navigation" class="flex secondary-navigation">
          <ul class="flex list ma0 pa0">
            <li>
              <a class="db pa3" title="facebook" href="https://www.facebook.com/depackt" rel="noopener noreferrer" target="_blank">
                ${icon('facebook', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            <li>
              <a class="db pa3" title="tweets" href="https://twitter.com/depackt_" rel="noopener noreferrer" target="_blank">
                ${icon('twitter', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            <li>
              <a class="db pa3" title="contribute" href="https://github.com/depackt" rel="noopener noreferrer" target="_blank">
                ${icon('github', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            <li>
              <a class="db pa3" title="crypto" href="https://keybase.io/auggod" rel="noopener noreferrer" target="_blank">
                ${icon('keybase', {'class': 'icon icon-small icon-social'})}
              </a>
            </li>
            ${!module.parent ? translateChooser.render({
              title: state.lang || 'fr',
              items: state.langs
            }) : ''}
          </ul>
        </nav>
      </header>
    `
    }
  }
}
