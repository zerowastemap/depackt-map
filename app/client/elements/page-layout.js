const html = require('choo/html')
const sideBar = require('../elements/side-bar')
const icon = require('./icon.js')
const DropdownMenu = require('../elements/dropdown-menu')
const dropdownMenu = DropdownMenu()

module.exports = PageLayout

function PageLayout (View) {
  return (state, emit) => {
    dropdownMenu.on('select', (props) => {
      const { code } = props
      emit('load:translations', code)
    })
    return html`
      <main role="main" class="layout column flex">
        <header class="layout top-bar white">
          <div class="layout flex">
            <button type="button" onclick=${(e) => emit('toggle:sidebar')} class="ph3" aria-label="open panel">
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
            <ul class="layout list ma0 pa0">
              ${!module.parent ? dropdownMenu.render({
                title: state.lang || 'fr',
                items: state.langs
              }) : ''}
            </ul>
          </div>
        </header>
        ${state.sideBarOpen ? sideBar(state, emit) : ''}
        ${View(state, emit)}
      </main>
      `
  }
}
