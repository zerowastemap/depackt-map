const microcomponent = require('microcomponent')
const html = require('choo/html')
const css = require('sheetify')
const moment = require('moment')
const translate = require('./translate')
const api = require('../lib/depackt-api')
const isEmpty = require('lodash/isEmpty')
const isEqual = require('is-equal-shallow')
const icon = require('./icon')

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
  :host .input-box {
    box-shadow: 0 3px 14px rgba(0,0,0,.4);
    position: relative;
  }
  :host .checkboxes {
    color: #fff;
    background: rgba(0, 0, 0, .75);
  }
  :host form {
    margin-bottom: 2rem;
  }
  :host form button {
    background: #222;
    font-size: 1rem;
    padding: 0 1.5rem;
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
    padding-left: 3rem;
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
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0wIC4yaDEwMFYxMDBIMCIvPjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxtYXNrIGlkPSJiIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjxwYXRoIGQ9Ik05OCA4OC42TDU5LjYgNTAuMiA5OCAxMS44YzIuNy0yLjcgMi43LTcgMC05LjYtMi42LTIuNy03LTIuNy05LjYgMEw1MCA0MC42IDExLjYgMi4yQzktLjUgNC42LS41IDIgMi4yYy0yLjcgMi42LTIuNyA3IDAgOS42bDM4LjQgMzguNEwyIDg4LjZjLTIuNyAyLjctMi43IDcgMCA5LjYgMi42IDIuNyA3IDIuNyA5LjYgMEw1MCA1OS44bDM4LjQgMzguNGMyLjcgMi43IDcgMi43IDkuNiAwIDIuNy0yLjYgMi43LTcgMC05LjYiIGZpbGw9IiMzNjM2MzYiIG1hc2s9InVybCgjYikiLz48L2c+PC9zdmc+);
  }
  :host .content {
    flex: 0 60%;
  }
  :host .cover {
    position: relative;
    overflow: hidden;
    flex: 1;
    min-height: 400px;
  }
  :host .cover > .image:hover {
    transform: scale(1.1);
    transition: transform 200ms cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
  :host .cover > .image {
    position: absolute;
    transition: transform 200ms cubic-bezier(0.755, 0.05, 0.855, 0.06);
    top: 0;
    width: 100%;
    height: 100%;
  }
`

module.exports = DirectorySearch

function DirectorySearch () {
  const component = microcomponent({
    input: '',
    data: [],
    translations: {},
    state: {
      search: {
        input: '',
        filtred: [],
        selection: []
      },
      name: 'directory-search',
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
    const state = this.state

    state.search.input = this.props.input
    state.name = this.props.name
    state.search.selection = this.props.selection
    state.translations = this.props.translations
    state.data = component.props.data

    return html`
      <div class="flex flex-column ${prefix} ${state.name}">
        <form class="flex flex-column sticky" onsubmit=${(e) => {
          e.preventDefault()

          // const oldValue = state.search.input
          const newValue = e.target.search.value
          state.search.input = newValue

          const kinds = ['market', 'supermarket', 'grocery-store', 'coop', 'webshop']
          const selection = []

          for (let item of kinds) {
            const elem = document.getElementById(item)
            if (elem.checked) selection.push(elem.value)
          }

          api.search({query: newValue, selection}).then(response => {
            if (!isEmpty(response.data)) {
              component.emit('search', {query: newValue, results: response.data})
            }
          })
        }}>
          <div class="flex input-box">
            <input
              autoFocus
              aria-label="search"
              spellcheck="false"
              autocomplete="false"
              name="search"
              placeholder=${translate(state.translations, { term: 'DIRECTORY_SEARCH_PLACEHOLDER' })}
              type="search"
              value=${state.search.input}
            />
            ${icon('search', {'class': 'icon icon-input-search'})}
            <button class="pa3 ba white bg-black-80 b--transparent" type="submit">${translate(state.translations, {term: 'SEARCH'})}</button>
          </div>
          ${renderSelection()}
        </form>
        ${renderResults()}
      </div>
    `

    function renderSelection () {
      return html`
        <div class="flex flex-wrap justify-center checkboxes">
          <div class="ma2 pa2">
            <input onchange=${updateSelection} type="checkbox" checked=${state.search.selection.includes('market')} name="market" value="market" id="market">
            <label class="pv1" for="market">${translate(state.translations, {term: 'MARKET'})}</label>
          </div>
          <div class="ma2 pa2">
            <input onchange=${updateSelection} type="checkbox" checked=${state.search.selection.includes('grocery-store')} name="grocery-store" value="grocery-store" id="grocery-store">
            <label class="pv1" for="grocery-store">${translate(state.translations, {term: 'GROCERY_STORE'})}</label>
          </div>
          <div class="ma2 pa2">
            <input onchange=${updateSelection} type="checkbox" checked=${state.search.selection.includes('supermarket')} name="supermarket" value="supermarket" id="supermarket">
            <label class="pv1" for="supermarket">${translate(state.translations, {term: 'SUPERMARKET'})}</label>
          </div>
          <div class="ma2 pa2">
            <input onchange=${updateSelection} type="checkbox" checked=${state.search.selection.includes('coop')} name="coop" value="coop" id="coop">
            <label class="pv1" for="coop">${translate(state.translations, {term: 'COOP'})}</label>
          </div>
          <div class="ma2 pa2">
            <input onchange=${updateSelection} type="checkbox" checked=${state.search.selection.includes('webshop')} name="webshop" value="webshop" id="webshop">
            <label class="pv1" for="webshop">${translate(state.translations, {term: 'WEBSHOP'})}</label>
          </div>
        </div>
      `
    }

    function updateSelection (e) {
      const index = state.search.selection.indexOf(e.target.value)
      if (index > -1) {
        state.search.selection.splice(index, 1)
      } else {
        state.search.selection.push(e.target.value)
      }
      component.emit('selection', state.search.selection)
    }

    function renderList () {
      return html`
        <ul class="search-list ma0 pa0 list">
          ${state.data.map((item, index) => {
            if (!item) return
            const { title } = item
            const { streetName, streetNumber, zip, city } = item.address
            const formattedAddress = streetName + ', ' + streetNumber + ' ' + zip + ' ' + city
            return html`
              <li class="flex search-list-item" tabindex="0">
                <div class="cover">
                  <div class="image" style="background: url(${item.cover.src}) 50% 0% / contain no-repeat rgb(255, 255, 255);"></div>
                </div>
                <div class="content">
                  <h3 class="result-title">
                    ${title}
                    <small class="pa2 b f7">${translate(state.translations, {term: item.kind.replace('-', '_').toUpperCase()})}</small>
                  </h3>
                  <div class="flex flex-wrap">
                    ${item.kind !== 'webshop' ? html`
                      <div class="result-meta flex50">
                        <span class="label">Adresse</span>
                        <div>
                          ${formattedAddress}
                        </div>
                      </div>
                    ` : ''}
                    ${item.hours ? html`
                    <div class="result-meta flex50">
                      <span class="label">Heures</span>
                    </div>
                    ` : ''}
                    ${item.openingDate ? html`
                    <div class="result-meta flex50">
                      <span class="label">Ouvert depuis</span>
                      <div>
                        ${moment(item.openingDate).format('LL')}
                      </div>
                    </div>
                    ` : ''}
                    ${item.tags.length ? html`
                      <div class="result-meta flex50">
                        <span class="label">Tags</span>
                        <ul class="flex flex-wrap list ma0 pa0">
                          ${item.tags.map((tag) => html`<li class="f7 bold ma1 pa2">${translate(state.translations, {term: tag.replace('-', '_').toUpperCase()})}</li>`)}
                        </ul>
                      </div>
                    ` : ''}
                    <div class="result-meta flex50">
                      <span class="label">Url</span>
                      <div>
                        <a target="_blank" rel="noopener noreferer" href=${item.url}>${item.url.match('facebook') ? 'Page facebook' : 'Site internet'}</a>
                      </div>
                    </div>
                    ${item.kind !== 'webshop' ? html`
                      <div class="result-meta flex50">
                        <span class="label">Carte</span>
                        <div>
                          <button class="flex pv2 ph3 ba white bg-black-80 br-pill b--transparent" type="button" onclick=${() => component.emit('showMap', item)}>
                            ${icon('marker', {'class': 'icon icon-small icon-marker icon-white pr1'})}
                            Voir sur la carte
                          </button>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </li>
            `
          })}
        </ul>
      `
    }

    function renderResults () {
      return html`
        <div class="flex flex-column results">
          ${state.data.length ? renderCount() : ''}
          ${renderList()}
        </div>
      `

      function renderCount () {
        return html`
          <div class="flex justify-center b ma3 white">
            <span class="ph2">${state.data.length}</span>
            <span>${translate(state.translations, {term: `RESULT_COUNT${state.data.length > 1 ? '_PLURAL' : ''}`})}.</span>
          </div>
        `
      }
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
      !isEqual(component.state.data, props.data) ||
      props.translations !== component.state.translations
  }
}
