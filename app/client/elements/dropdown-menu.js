const microcomponent = require('microcomponent')
const html = require('choo/html')
const isEqual = require('is-equal-shallow')
// const morph = require('nanomorph')

module.exports = dropdownMenu

function dropdownMenu () {
  const component = microcomponent({
    props: {
      open: false,
      class: '', // list  of class to apply to dropdown-menu
      items: [],
      selected: {}
    },
    state: {
      open: false,
      selected: {},
      items: []
    }
  })
  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)
  component.on('toggle', toggle)
  component.on('select', select)

  return component

  function select (item) {
    component.state.selected = item
  }

  function toggle () {
    component.state.open = !component.state.open
  }

  function render () {
    const state = this.state

    state.items = this.props.items

    function renderMenu () {
      return html`
         <ul>
          ${state.items.map(menuItem)}
         </ul>
      `

      function menuItem (item) {
        return html`
          <li tabindex=0 class=${item.name === state.selected.name ? 'selected' : ''}>
            <button onclick=${(e) => component.emit('select', item)}>${item.name}</button>
          </li>
        `
      }
    }

    return html`
      <div>
        <button type="button" onclick=${(e) => component.emit('toggle')}></button>
        ${renderMenu()}
      </div>
    `
  }

  function update (props) {
    return !isEqual(component.state.items, props.items) ||
      props.open !== component.state.open
  }

  function load () {
    console.log('mounted on DOM')
  }

  function unload () {
    console.log('removed from DOM')
    component._element = null
  }
}
