const html = require('choo/html')
const PageLayout = require('../elements/page-layout') // sub page layout
const directoryTitle = 'Directory'

module.exports = (components) => {
  const { directorySearch, imageGrid } = components

  return (state, emit) => {
    if (state.title !== directoryTitle) emit(state.events.DOMTITLECHANGE, directoryTitle)

    return PageLayout((state, emit) => {
      return html`
      <section role="section" id="directory" class="flex w-100">
        ${imageGrid.render({
          items: state.grid
        })}
        ${directorySearch.render({
          input: state.search || '',
          name: 'directory-search',
          selection: state.selection || [],
          translations: state.translations,
          data: state.results // fallback to locations if no results
        })}
      </section>
    `
    })(state, emit)
  }
}
