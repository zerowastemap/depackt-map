const microcomponent = require('microcomponent')
const html = require('choo/html')
const morph = require('nanomorph')
const css = require('sheetify')
// const isEmpty = require('lodash/isEmpty')
// const slug = require('slug/slug-browser')
// const icon = require('./icon.js')
const translate = require('./translate.js')
// const api = require('../lib/depackt-api.js')

const prefix = css`
  :host {
    flex: 0 90%;
    display: flex;
    margin: 50vh auto;
    flex-direction: column;
  }
  @media(min-width:960px) {
    :host {
      flex: 0 50%;
    }
  }
  :host form {
    margin-bottom: 2rem;
    box-shadow: 0 3px 14px rgba(0,0,0,.4);
  }
  :host form button {
    background: #333;
    font-size: 1rem;
    padding: 0 1rem;
    margin: 0;
    text-transform: initial;
    color: #fff;
  }
  :host .results {
    z-index: 2;
  }
  :host .search-list li.search-list-item {
    background: #fff;
    flex-direction: column;
    margin-bottom: 2rem;
    box-shadow: 0 3px 14px rgba(0,0,0,.4);
  }
  @media(min-width: 960px) {
    :host .search-list li.search-list-item {
      flex-direction: row;
    }
  }
  :host ul li {
    list-style: none;
    margin: 0;
  }
  :host li {
    cursor: pointer;
    line-height: 48px;
    position: relative;
    padding-left: 1rem;
  }
  :host li:focus {
    outline: none;
    background: #f0f0f0;
  }
  :host .sticky {
    position: sticky;
    top: 60px;
    z-index: 100;
  }
  :host form input[type="search"] {
    appearance: none;
    border: none;
    height: 60px;
    position: relative;
    background: #fff;
    box-shadow: none;
    color: #323232;
    font-size: 1rem;
    padding-left: 1.5rem;
    width: 100%;
  }
  :host form input[type="search"]:focus {
    outline: none;
    z-index: 500;
  }
  :host input[type="search"]::-webkit-input-placeholder {
    color: #555;
    font-size: .8rem;
  }
  :host input[type="search"]::-webkit-search-cancel-button {
    appearance: none;
    height: 12px;
    width: 12px;
    color: #333;
    cursor: pointer;
    right: 1.5rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-size: 12px 12px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGcgZmlsbD0ibm9uZSI+PGcgZmlsbD0iI0ZGRiI+PHBhdGggZD0iTTU5LjYgNTBMOTggMTEuNkMxMDAuNyA4LjkgMTAwLjcgNC42IDk4IDIgOTUuNC0wLjcgOTEtMC43IDg4LjQgMkw1MCA0MC40IDExLjYgMkM5LTAuNyA0LjYtMC43IDIgMiAtMC43IDQuNi0wLjcgOSAyIDExLjZMNDAuNCA1MCAyIDg4LjRDLTAuNyA5MS0wLjcgOTUuNCAyIDk4IDQuNiAxMDAuNyA5IDEwMC43IDExLjYgOThMNTAgNTkuNiA4OC40IDk4QzkxLjEgMTAwLjcgOTUuNCAxMDAuNyA5OCA5OCAxMDAuNyA5NS40IDEwMC43IDkxIDk4IDg4LjRMNTkuNiA1MFoiLz48L2c+PC9nPjwvc3ZnPg==);
  }
  :host .content {
    flex: 0 60%;
  }
  :host .cover {
    position: relative;
    flex: 1;
    min-height: 400px;
  }
  :host .cover > .image {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
`

module.exports = Search

function Search () {
  const component = microcomponent({
    input: '',
    name: 'search-typeahead', // component name used to set a css class
    data: [],
    translations: {},
    state: {
      search: {
        input: '',
        filtred: []
      },
      name: 'search-typeahead',
      translations: {},
      data: [],
      selected: {}
    }
  })

  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)

  return component

  function render () {
    const self = this
    const state = this.state

    state.name = this.props.name
    state.translations = this.props.translations
    state.data = component.props.data

    return html`
      <div class="layout column ${prefix} ${state.name}">
        <form class="layout sticky" onsubmit=${(e) => {
          e.preventDefault()
        }}>
          <input
            autoFocus
            aria-label="search"
            autocomplete="false"
            name="search"
            oninput=${handleInput}
            placeholder=${translate(state.translations, { term: 'DIRECTORY_SEARCH_PLACEHOLDER' })}
            type="search"
            value=${state.search.input}
          />
          <button class="btn btn-default" type="submit">Search</button>
        </form>
        ${renderResults()}
      </div>
    `

    function handleInput (e) {
      const oldValue = state.search.input
      const newValue = e.target.value
      state.search.input = newValue

      if (oldValue !== newValue) {
        // morph(self._element.querySelector('.value'), renderValue(newValue))
        morph(self._element.querySelector('.results'), renderResults(newValue))
      }
    }

    function renderList () {
      return html`
        <ul class="search-list no-style">
          ${state.data.map((item, index) => {
            const { title } = item
            return html`
              <li class="layout search-list-item" tabindex="0">
                <div class="cover">
                  <div class="image" style="background: url(${item.cover.src}) 50% 50% / cover no-repeat rgb(255, 255, 255);"></div>
                </div>
                <div class="content">
                  ${title}
                </div>
              </li>
            `
          })}
        </ul>
      `
    }

    function renderResults (value = state.search.input) {
      console.log(value)

      return html`
        <div class="layout column results">
          ${renderList()}
        </div>
      `
    }
  }

  function load () {
    console.log('loaded')
  }

  function unload () {
    console.log('unloaded')
    component._element = null
  }

  function update (props) {
    return props.input !== component.state.search.input ||
      props.data.length !== component.state.data.length ||
      props.translations !== component.state.translations
  }
}
