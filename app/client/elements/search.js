const microcomponent = require('microcomponent')
const html = require('choo/html')
const morph = require('nanomorph')
const css = require('sheetify')
// const _flow = require('lodash/fp/flow')
const _filter = require('lodash/filter')
const slug = require('slug/slug-browser')
const icon = require('./icon.js')

const prefix = css`
  :host li {
    list-style: none;
    cursor: pointer;
    line-height: 48px;
    position: relative;
    padding-left: 1rem;
  }
  :host li .list-icon {
    height: 48px;
    width: 48px;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    top: 0;
  }
  :host input.sticky {
    top: 60px;
  }
  @media(min-width: 960px) {
    :host input.sticky {
      top: 100px;
    }
  }
  :host input[type="search"] {
    appearance: none;
    border: none;
    box-shadow: none;
    font-size: 1rem;
    width: 100%;
    z-index: 1;
    background: #fff;
    padding-left: 1rem;
  }
  :host input[type="search"]::-webkit-input-placeholder {
    color: #808080;
    font-size: .8rem;
  }
  :host input[type="search"]::-webkit-search-cancel-button {
    appearance: none;
    height: 12px;
    width: 12px;
    color: #333;
    cursor: pointer;
    margin-right: 18px;
    background-size: 12px 12px;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIxMDBweCIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+QXJ0Ym9hcmQ8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGZpbGw9IiMwMDAwMDAiPiAgICAgICAgICAgIDxwYXRoIGQ9Ik01OS42MDIyMjUsNDkuOTk5ODg3NSBMOTguMDExMjI1LDExLjU5MTAxMjMgQzEwMC42NjI2MjUsOC45Mzk2MjA5NCAxMDAuNjYzMjI1LDQuNjQwMjM0OTIgOTguMDExMjI1LDEuOTg4ODQzNTQgQzk1LjM1OTgyNSwtMC42NjI5NDc4NDUgOTEuMDYwNjI1LC0wLjY2MjU0Nzg0NyA4OC40MDkwMjUsMS45ODg4NDM1NCBMNTAuMDAwMDI1LDQwLjM5NzkxODcgTDExLjU5MTIyNSwxLjk4ODg0MzU0IEM4LjkzOTIyNSwtMC42NjI5NDc4NDUgNC42NDA0MjUsLTAuNjYyOTQ3ODQ1IDEuOTg4ODI1LDEuOTg4ODQzNTQgQy0wLjY2Mjk3NDk5OSw0LjY0MDIzNDkyIC0wLjY2Mjk3NDk5OSw4LjkzOTIyMDk1IDEuOTg5MDI1LDExLjU5MTAxMjMgTDQwLjM5ODAyNSw0OS45OTk4ODc1IEwxLjk4ODgyNSw4OC40MDg1NjI3IEMtMC42NjI5NzQ5OTksOTEuMDYwOTU0IC0wLjY2Mjc3NDk5OSw5NS4zNTkzNDAxIDEuOTg5MDI1LDk4LjAxMTczMTQgQzQuNjQwNDI1LDEwMC42NjI5MjMgOC45MzkwMjUsMTAwLjY2MjkyMyAxMS41OTA4MjUsOTguMDEwNzMxNCBMNTAuMDAwMDI1LDU5LjYwMjI1NjMgTDg4LjQwOTAyNSw5OC4wMTA3MzE0IEM5MS4wNjA2MjUsMTAwLjY2MjEyMyA5NS4zNTk4MjUsMTAwLjY2MjkyMyA5OC4wMTEyMjUsOTguMDEwNzMxNCBDMTAwLjY2MzIyNSw5NS4zNTkzNDAxIDEwMC42NjI2MjUsOTEuMDYwMTU0IDk4LjAxMTIyNSw4OC40MDg1NjI3IEw1OS42MDIyMjUsNDkuOTk5ODg3NSBaIj48L3BhdGg+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=);
  }
`

module.exports = Search

function Search () {
  const component = microcomponent({
    input: '',
    data: [],
    state: {
      search: {
        input: '',
        filtred: []
      },
      data: []
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

    state.data = component.props.data

    return html`
      <div class="${prefix}">
        <input
          autoFocus
          autocomplete="false"
          id="searchinput"
          class="sticky"
          name="search"
          oninput=${handleInput}
          placeholder="Filtrer par nom, code postal, commune"
          type="search"
          value=${state.search.input}
        />
        ${renderValue()}
        ${renderResults()}
      </div>
    `

    function handleInput (e) {
      const oldValue = state.search.input
      const newValue = e.target.value
      state.search.input = newValue

      // if (newValue.length < 3) { return }

      if (oldValue !== newValue) {
        morph(self._element.querySelector('.value'), renderValue(newValue))
        morph(self._element.querySelector('.results'), renderResults(newValue))
      }
    }

    function renderValue (value) {
      return html`
        <span class="value">
          ${value}
        </span>
      `
    }

    function renderResults (value = state.search.input) {
      const { data } = component.props
      const filtred = _filter(data, (item) => {
        const { title } = item
        const { zip, city } = item.address
        const s1 = slug(`${title} ${city} ${zip}`, {replacement: ' ', lower: true})
        const s2 = slug(value, {replacement: ' ', lower: true})
        return s1.includes(s2)
      })

      state.search.filtred = filtred

      const items = filtred.map((item) => {
        return html`
          <li tabindex="0">
            ${item.title}
            <div class="layout list-icon">
              ${icon(item.featured ? 'marker-star' : 'marker', {'class': 'icon icon-medium icon-marker'})}
            </div>
          </li>
        `
      })

      return html`
        <div class="results ${prefix}">
          ${items}
          ${state.search.filtred.length === 0 ? html`
            <div>
              Aucune correspondance pour ${value}
            </div>
          ` : ''
          }
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
      props.data.length !== component.state.data.length
  }
}
