const html = require('choo/html')
const PageLayout = require('../elements/page-layout') // sub page layout

/*
 * Settings View
 */

module.exports = (components) => {
  const { rangeSlider } = components

  return (state, emit) => {
    if (state.title !== 'Settings') emit(state.events.DOMTITLECHANGE, 'Settings')

    return PageLayout((state, emit) => {
      return html`
        <section role="section" id="page" class="flex mt4 pt4 flex-column flex-auto">
          <h3 class="f6 b db ml4 mb2">Rayon en km (actuel: ${state.settings.distanceKm || 150}, default: 150, max: 1000)</h3>
          ${!module.parent ? rangeSlider.render({
            value: state.settings.distanceKm,
            name: 'slider'
          }) : ''}
        </section>
      `
    })(state, emit)
  }
}
