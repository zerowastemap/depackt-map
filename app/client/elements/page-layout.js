const html = require('choo/html')
const sideBar = require('../elements/side-bar.js')
const Header = require('../elements/header')

module.exports = PageLayout

function PageLayout (View) {
  return (state, emit) => {
    return html`
      <main role="main" class="layout flex">
        ${Header(state, emit)}
        ${state.sideBarOpen ? sideBar(state, emit) : ''}
        ${View(state, emit)}
      </main>
      `
  }
}
