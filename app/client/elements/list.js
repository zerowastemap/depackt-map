const microcomponent = require('microcomponent')
const html = require('choo/html')
const isEqual = require('is-equal-shallow')
const slug = require('slug/slug-browser')
const morph = require('nanomorph')

module.exports = listComponent

function listComponent () {
  const component = microcomponent({
    props: {
      items: []
    },
    state: {
      filter: {
        input: ''
      },
      selected: {},
      items: []
    }
  })
  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)
  return component

  function render () {
    const state = this.state
    const self = this
    state.items = this.props.items

    function renderForm () {
      return html`
        <form class="black-80 w-100 bg-white">
          <input
            placeholder="Filter"
            id="filter"
            class="input-text input-filter ba b--black-20 pa2 mb2 db w-100"
            type="search"
            aria-describedby="name-desc"
            autoFocus
            aria-label="filter"
            autocomplete="false"
            spellcheck="false"
            name="filter"
            oninput=${handleInput}
            value=${state.filter.input}
          >
        </form>
      `
    }

    function handleInput (e) {
      const oldValue = state.filter.input
      const newValue = e.target.value
      state.filter.input = newValue

      if (oldValue !== newValue) {
        morph(component.element.querySelector('.results'), renderResults(newValue))
      }
    }

    function renderResults (value = state.filter.input) {
      return html`
        <ul class="results list pl0">
          ${renderFiltred()}
        </ul>
      `

      function renderFiltred () {
        const filtred = state.items.filter((item) => {
          const string = self.props.model.map((s) => byString(item, s)).join()
          const s1 = slug(string, {replacement: ' ', lower: true})
          const s2 = slug(value, {replacement: ' ', lower: true})
          return s1.includes(s2)
        })

        const items = filtred.map((item) => {
          return html`
            <li onkeypress=${(e) => handleKeypress(e, item)} onclick=${(e) => select(item)} tabindex=0 class="focusable lh-copy pa3 ba bl-0 bt-0 br-0 b--solid b--black-30">
              ${self.props.listItemTpl(item)}
            </li>
          `
        })

        return items

        function handleKeypress (e, item) {
          if (e.keyCode === 13) {
            select(item)
          }
        }

        function select (item) {
          state.selected = item
          component.emit('select', item)
        }

        function byString (o, s) {
          s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
          s = s.replace(/^\./, '')           // strip a leading dot
          var a = s.split('.')
          for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i]
            if (k in o) {
              o = o[k]
            } else {
              return
            }
          }
          return o
        }
      }
    }

    return html`
      <div class="flex75 center full-bleed">
        <div class="layout sticky">
          <div class="flex">
            ${renderForm()}
          </div>
          <div class="layout flex-end">
            <button type="button" class="f6 link dim br1 ph3 pv2 mb2 dib white bg-black" onclick=${(e) => component.emit('new')}>New</button>
          </div>
        </div>
        ${renderResults()}
      </div>
    `
  }

  function update (props) {
    return !isEqual(component.state.items, props.items)
  }

  function load () {
    console.log('mounted on DOM')
  }

  function unload () {
    console.log('removed from DOM')
  }
}
