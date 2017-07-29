const html = require('choo/html')
const SearchTypeahead = require('../elements/search-typeahead.js')
const searchTypeahead = SearchTypeahead()

module.exports = (state, emit) => {
  return html`
    <main role="main" class="layout column">
      <ul class="layout row-wrap no-style image-grid">
         ${state.locations.map((item) => {
           return html`
              <li class="image-grid-item">
                <div class="image" style="background: url(${item.cover.src}) 50% 50% / cover no-repeat rgb(255, 255, 255);"></div>
              </li>
           `
         })}
      </ul>
      ${searchTypeahead.render({
        input: '',
        name: 'search-typeahead',
        translations: state.translations,
        data: state.locations // always set data if available
      })}
    </main>
  `
}
