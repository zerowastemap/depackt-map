const html = require('choo/html')
const TITLE = 'Privacy'

module.exports = (state, emit) => {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <section role="section" id="privacy">
    </section>
  `
}
