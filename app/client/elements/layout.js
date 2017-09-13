const html = require('choo/html')

module.exports = Layout

function Layout (View) {
  return (state, emit) => {
    return html`
      <div id="app" class="flex ${state.sideBarOpen ? 'js-sidebar--open' : 'js-sidebar--closed'}">
        ${View(state, emit)}
      </div>
    `
  }
}
