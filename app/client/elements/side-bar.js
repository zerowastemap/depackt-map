const html = require('choo/html')
const translate = require('./translate')
const icon = require('./icon')

module.exports = (state, emit) => {
  return html`
    <nav class="layout flex25 fixed" id="sidebar">
      ${state.isMobile ? html`<button class="btn-close" onclick=${(e) => emit('toggle:sidebar')}>${icon('close', {'class': 'icon icon-small icon-white icon-close'})}</button>` : ''}
      <ul class="layout column list mt5 pb5 h-max pl0 w-100">
        <li class="lh-copy">
          <a class="db pa3 no-underline" href="/">
            <h4>${translate(state.translations, {term: 'MAP'})}</h4>
            <small>${translate(state.translations, {term: 'DEPACKT_DESC'})}</small>
          </a>
        </li>
        <li class="lh-copy">
          <a class="db pa3 no-underline" href="/directory">
            <h4>Directory</h4>
            <small>${translate(state.translations, {term: 'DIRECTORY_DESC'})}</small>
          </a>
        </li>
        <li class="lh-copy">
          <a class="db pa3 no-underline" href="/settings">
            <h4>${translate(state.translations, {term: 'SETTINGS'})}</h4>
            <small>${translate(state.translations, {term: 'UPDATE_MAX_DISTANCE'})}</small>
          </a>
        </li>
        <li class="lh-copy">
          <a class="db pa3 no-underline" href="/new">
            <h4>${translate(state.translations, {term: 'ADD_POINT'})}</h4>
            <small>${translate(state.translations, {term: 'ADD_POINT_DESC'})}</small>
          </a>
        </li>
        <li class="lh-copy pa2 f6">
          Infos
        </li>
        <li class="lh-copy">
          <a class="db pa3 no-underline" href="/about">
            <h4>${translate(state.translations, {term: 'ABOUT'})}</h4>
            <small>${translate(state.translations, {term: 'WHAT_IS_DEPACKT'})}</small>
          </a>
        </li>
        <li class="lh-copy">
          <a class="db pa3 no-underline" href="/resources">
            <h4>${translate(state.translations, {term: 'RESOURCES'})}</h4>
            <small>${translate(state.translations, {term: 'RESOURCES_DESC'})}</small>
          </a>
        </li>
        <li class="lh-copy pa2 f6">
          Legal
        </li>
        <li class="lh-copy">
          <a class="db pa3 no-underline" href="/privacy">${translate(state.translations, {term: 'PRIVACY'})}</a>
        </li>
        <li class="lh-copy">
          <a class="db pa3 no-underline" href="/impressum">Impressum</a>
        </li>
        <li class="lh-copy pa2 f6">
          ${translate(state.translations, {term: 'UPDATE_LANG'})}
        </li>
        <li style="position:relative;">
            <button class="w-100 tc btn-dropdown ${state.dropdownOpen ? ' open' : ''}" onclick=${(e) => emit('toggle:lang', state.lang)}>${state.lang}</button>
            ${state.dropdownOpen ? html`
              <ul class="list pl0">
                ${state.langs.map(langItem)}
              </ul>
            ` : ''}
          </li>

      </ul>
    </nav>
  `
  function langItem (item) {
    if (state.lang !== item.code) {
      return html`
        <li>
          <button class="w-100 tc" onclick=${(e) => lang(item.code)}>${item.lang}</button>
        </li>
      `
    }
  }

  function lang (lang) {
    emit('load:translations', lang)
    emit('toggle:lang', lang)
  }
}
