const microcomponent = require('microcomponent')
const html = require('choo/html')
const css = require('sheetify')

const prefix = css`
  :host li.active::after {
    content: "";
    position: absolute;
    width: 3px;
    background-color: #333;
    left: 0;
    height: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  :host.sticky {
    top: 80px;
  }
`

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
      <nav class="${prefix} flex flex-column sticky">
        <ul class="list ma0 pa0">
          ${state.items.map((item) => navItem(item))}
        </ul>
      </nav>
    `

    function navItem (item) {
      const { hash, text } = item
      return html`
        <li class="relative navitem${isActive(hash) ? ' active' : ''}">
          <a class="flex db pv2 pl3 no-underline color-inherit" href="${state.pathname}#${hash}">${text}</a>
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
