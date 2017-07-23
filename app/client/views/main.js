const html = require('choo/html')
const css = require('sheetify')
const Leaflet = require('../elements/leaflet.js')
const Search = require('../elements/search.js')
const leaflet = Leaflet()
const search = Search()
const icon = require('../elements/icon.js')
const Tabs = require('../elements/tabs.js')
const tabs = Tabs()
const translate = require('../elements/translate.js')

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

const prefix = css`
  :host {
    padding: 1rem 2rem;
  }
  :host blockquote {
    font-size: 1rem;
  }
`

const info = html`
  <div class=${prefix}>
    <article role="article" class="markdown-body">
      <blockquote>
        Depackt est une carte des initiatives zéro déchet (épiceries et marchés bio) en Belgique et ailleurs. <a href="/about">En savoir plus</a>
    </blockquote>
      <h2>Liens</h2>

      <li>
        <a href="/resources">Resources</a>
      </li>
      <li>
        <a href="/legal">Legal</a>
      </li>
      <li>
        <a href="/privacy">Privacy</a>
      </li>

    <h2>Ailleurs</h2>

    <ul class="layout no-style social-icons">
      <li>
        <a class="btn btn-social" href="https://www.facebook.com/depackt" title="facebook" rel="noopener" target="_blank">
          ${icon('facebook', {'class': 'icon icon-large icon-social'})}
        </a>
      </li>
      <li>
        <a class="btn btn-social" href="https://twitter.com/depackt_" title="tweets" rel="noopener" target="_blank">
          ${icon('twitter', {'class': 'icon icon-large icon-social'})}
        </a>
      </li>
      <li>
        <a class="btn btn-social" href="https://github.com/depackt" title="contribute" rel="noopener" target="_blank">
          ${icon('github', {'class': 'icon icon-large icon-social'})}
        </a>
      </li>
      <li>
        <a class="btn btn-social" href="https://keybase.io/auggod" title="crypto" rel="noopener" target="_blank">
          ${icon('keybase', {'class': 'icon icon-large icon-social'})}
        </a>
      </li>
    </ul>
    </article>
  </div>
`

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
                  el: info
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
