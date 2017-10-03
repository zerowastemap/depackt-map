const microcomponent = require('microcomponent')
const html = require('choo/html')
const morph = require('nanomorph')
const css = require('sheetify')

const prefix = css`
  :host button {
    text-align: inherit;
  }
`

module.exports = TranslateChooser

function TranslateChooser () {
  const component = microcomponent({
    props: {
      items: []
    },
    state: {
      open: false
    }
  })
  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)
  component.on('toggle', toggle)

  return component

  function toggle () {
    this.state.open = !this.state.open
    morph(this._element.querySelector('.dropdown-menu'), renderMenu(component.state))
  }

  function render () {
    const state = this.state

    state.items = this.props.items
    state.open = false
    state.title = this.props.title

    component._element = html`
      <li class=${prefix} tabindex=0>
        ${renderMenu(state)}
      </li>
    `

    return component._element
  }

  function renderMenu (state) {
    const { title, items, open } = state
    return html`
      <div class="h-100 dropdown-menu${open ? ' dropdown-menu--open' : ''}">
        <a href="" title="Change lang" class="flex justify-center vertical-center h-100 pa3 color-inherit relative no-underline btn-dropdown${open ? ' btn-dropdown--open' : ''}" onkeypress=${handleKeyPress} onclick=${(e) => component.emit('toggle')}>
          ${title.toUpperCase()}
        </a>
        ${open ? renderList() : ''}
      </div>
    `

    function handleKeyPress (e) {
      if (e.keyCode === 13) {
        component.emit('toggle')
      }
    }

    function renderList () {
      return html`
        <ul class="list ma0 pa0 menu">
          ${items.filter((item) => item.code !== title).map(menuItem)}
        </ul>
      `
    }

    function menuItem (item) {
      return html`
        <li>
          <button type="button" class="db ba b--transparent bg-transparent color-inherit w-100 pa3" onclick=${(e) => component.emit('choice', item)}>${item.lang}</button>
        </li>
      `
    }
  }

  function update (props) {
    return props.title !== component.props.title
  }

  function load () {
    console.log('dropdown mounted on DOM')
  }

  function unload () {
    console.log('dropdown removed from DOM')
    this._element = null
  }
}
