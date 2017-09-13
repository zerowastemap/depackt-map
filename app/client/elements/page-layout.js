const html = require('choo/html')
const sideBar = require('../elements/side-bar')
const icon = require('./icon.js')
const DropdownMenu = require('../elements/dropdown-menu')
const dropdownMenu = DropdownMenu()

module.exports = Pageflex

function Pageflex (View) {
  return (state, emit) => {
    dropdownMenu.on('select', (props) => {
      const { code } = props
      emit('load:translations', code)
    })
    return html`
      <main role="main" class="flex column flex-auto">
        <header class="flex bg-black fixed top-0 left-0 right-0 w-100 top-bar white">
          <div class="flex flex-auto flex-even">
            <button type="button" class="flex pa3 ba white bg-black-80 b--transparent" onclick=${(e) => emit('toggle:sidebar')} aria-label="open panel">
              ${!state.sideBarOpen ? icon('burger', {'class': 'icon icon-medium icon-burger'}) : icon('close', {'class': 'icon icon-small ph1 icon-white icon-close'})}
            </button>
            <h1 class="flex normal page-title">
              ${state.title}
            </h1>
          </div>
          <div class="flex flex-auto flex-even justify-center">
            <a href="/" class="db logo">
              ${icon('logo', {'class': 'icon icon-logo'})}
            </a>
          </div>
          <div class="flex flex-auto flex-even flex-end">
            <ul class="flex list ma0 pa0">
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
