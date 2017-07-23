const microcomponent = require('microcomponent')
const html = require('choo/html')

module.exports = Nav

function Nav () {
  const component = microcomponent({
    items: [],
    hash: '',
    state: {
      items: [],
      hash: null
    }
  })

  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)

  return component

  function render () {
    // const self = this
    const state = this.state
    state.items = this.props.items
    state.hash = this.props.hash
    state.pathname = window.location.pathname

    return html`
      <nav id="docnav" class="layout column sticky">
        <ul>
          ${state.items.map((item) => navItem(item))}
        </ul>
      </nav>
    `

    function navItem (item) {
      const { hash, text } = item
      return html`
        <li class="navitem${isActive(hash) ? ' active' : ''}">
          <a href="${state.pathname}#${hash}">${text}</a>
        </li>
      `
    }

    function isActive (hash) {
      return component.state.hash === hash
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
    return props.items.length !== component.state.items.length ||
      props.hash !== component.state.hash
  }
}
