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
    <nav class="flex flex-column flex25 fixed white" id="sidebar">
      <div id="sidebar-topbar" class="flex flex-end sticky">
        ${state.isMobile ? toggleSidebar() : ''}
      </div>
      <span class="absolute top-1 left-1 f7">
        ${'depackt-map v.' + state.appVersion}
      </span>
      <ul class="flex flex-column list mt5 pb5 h-max pl0 w-100">
        <li class="lh-copy">
          <a class="db color-inherit pa3 no-underline" href="/">
            <h4 class="f4 normal mv1 lh-copy">${translate(state.translations, {term: 'MAP'})}</h4>
            <small>${translate(state.translations, {term: 'DEPACKT_DESC'})}</small>
          </a>
        </li>
        <li class="lh-copy">
          <a class="db color-inherit pa3 no-underline" href="/directory">
            <h4 class="f4 normal mv1 lh-copy">Directory</h4>
            <small>${translate(state.translations, {term: 'DIRECTORY_DESC'})}</small>
          </a>
        </li>
        <li class="lh-copy">
          <a class="db color-inherit pa3 no-underline" href="/settings">
            <h4 class="f4 normal mv1 lh-copy">${translate(state.translations, {term: 'SETTINGS'})}</h4>
            <small>${translate(state.translations, {term: 'UPDATE_MAX_DISTANCE'})}</small>
          </a>
        </li>
        <li class="lh-copy">
          <a class="db color-inherit pa3 no-underline" href="/new">
            <h4 class="f4 normal mv1 lh-copy">${translate(state.translations, {term: 'ADD_POINT'})}</h4>
            <small>${translate(state.translations, {term: 'ADD_POINT_DESC'})}</small>
          </a>
        </li>
        <li class="lh-copy pa2 f6">
          Infos
        </li>
        <li class="lh-copy">
          <a class="db color-inherit pa3 no-underline" href="/about">
            <h4 class="f4 normal mv1 lh-copy">${translate(state.translations, {term: 'ABOUT'})}</h4>
            <small>${translate(state.translations, {term: 'WHAT_IS_DEPACKT'})}</small>
          </a>
        </li>
        <li class="lh-copy">
          <a class="db color-inherit pa3 no-underline" href="/resources">
            <h4 class="f4 normal mv1 lh-copy">${translate(state.translations, {term: 'RESOURCES'})}</h4>
            <small>${translate(state.translations, {term: 'RESOURCES_DESC'})}</small>
          </a>
        </li>
        <li class="lh-copy pa2 f6">
          Compte
        </li>
        <li class="lh-copy">
          <a class="db pa3 color-inherit no-underline" href="/auth/login">
            <h4 class="f4 normal mv1 lh-copy">Se connecter</h4>
            <small>Accéder à votre compte depackt</small>
          </a>
        </li>
        <li class="lh-copy">
          <a class="db color-inherit pa3 no-underline" href="/auth/signup">
            <h4 class="f4 normal mv1 lh-copy">S'enregistrer</h4>
            <small>Créer un nouveau compte depackt</small>
          </a>
        </li>
        <li class="lh-copy pa2 f6">
          Legal
        </li>
        <li class="lh-copy">
          <a class="db f4 color-inherit pa3 no-underline" href="/privacy">${translate(state.translations, {term: 'PRIVACY'})}</a>
        </li>
        <li class="lh-copy">
          <a class="db f4 color-inherit pa3 no-underline" href="/impressum">Impressum</a>
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
      <button class="flex pa3 h-100 ba white bg-transparent b--transparent" onclick=${(e) => emit('toggle:sidebar')}>
        ${icon('close', {'class': 'icon icon-small icon-white icon-close'})}
      </button>
    `
  }
}
