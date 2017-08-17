const html = require('choo/html')
const icon = require('./icon.js')

module.exports = (state, emit) => {
  return html`
    <header class="layout top-bar">
      <div class="layout flex">
        <button onclick=${(e) => emit('toggle:sidebar')} class="btn btn-burger" aria-label="open panel">
          ${!state.sideBarOpen ? icon('burger', {'class': 'icon icon-medium icon-burger'}) : icon('close', {'class': 'icon icon-small icon-white icon-close'})}
        </button>
        <h1 class="layout page-title">
          ${state.title}
        </h1>
      </div>
      <div class="layout flex justify-center">
        <a href="/" class="db logo">
          ${icon('logo', {'class': 'icon icon-logo'})}
        </a>
      </div>
      <div class="layout flex flex-end">
        <ul class="layout no-style">
          <li style="position:relative;margin-right:1rem;">
            <button class="btn btn-default btn-dropdown${state.dropdownOpen ? ' open' : ''}" onclick=${(e) => emit('toggle:lang', state.lang)}>${state.lang}</button>
            ${state.dropdownOpen ? html`
              <ul class="dropdown-menu bg-white shadow-6" style="right:0;">
                ${state.langs.map(langItem)}
              </ul>
            ` : ''}
          </li>
        </ul>
      </div>
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
