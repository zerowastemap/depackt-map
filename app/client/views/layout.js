const html = require('choo/html')

module.exports = (View) => {
  return (state, emit) => {
    return html`
      <div id="app">
        ${View(state, emit)}
      </div>
    `
  }
}
