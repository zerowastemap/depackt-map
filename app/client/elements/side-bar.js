const html = require('choo/html')
const translate = require('./translate')
const icon = require('./icon')
const DropdownMenu = require('../elements/dropdown-menu')
const dropdownMenu = DropdownMenu()

module.exports = (state, emit) => {
  dropdownMenu.on('select', (props) => {
    const { code } = props
    emit('load:translations', code)
  })
  return html`
    <nav class="layout flex25 fixed" id="sidebar">
      ${state.isMobile ? toggleSidebar() : ''}
      <span class="absolute top-1 left-1 f7">
        ${'depackt-map v.' + state.appVersion}
      </span>
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
        ${!module.parent ? dropdownMenu.render({
          title: state.lang || 'fr',
          items: state.langs
        }) : ''}
      </ul>
    </nav>
  `

  function toggleSidebar () {
    return html`
      <button class="btn-close" onclick=${(e) => emit('toggle:sidebar')}>
        ${icon('close', {'class': 'icon icon-small icon-white icon-close'})}
      </button>
    `
  }
}
