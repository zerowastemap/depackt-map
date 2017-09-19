const microcomponent = require('microcomponent')
const html = require('choo/html')
const css = require('sheetify')

const prefix = css`
  :host a {
    border-radius: 50%;
    margin: 2rem;
    overflow: hidden;
  }
  :host img {
    filter: blur(20px);
    transition: filter 600ms cubic-bezier(0.55, 0.085, 0.68, 0.53);
  }
  :host img:hover {
    filter: blur(0);
  }
`

module.exports = Card

function Card () {
  const component = microcomponent({
    src: null,
    state: {
      src: null
    }
  })

  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)

  function render () {
    const state = this.state
    state.src = this.props.src
    state.href = this.props.href
    state.title = this.props.title
    state.name = this.props.name

    return html`
      <div class=${prefix}>
        <a class="flex flex-column" target="_blank" rel="noopener noreferrer" href="${state.href}" title=${state.title}>
          <img src=${state.src} alt=${state.name} />
        </a>
      </div>
    `
  }

  return component

  function load () {
    console.log('loaded')
  }

  function unload () {
    console.log('unloaded')
  }

  function update (props) {
    return props.src !== component.state.src
  }
}
