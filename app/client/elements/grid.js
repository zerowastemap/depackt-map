const microcomponent = require('microcomponent')
const html = require('choo/html')
const css = require('sheetify')
const isEqual = require('is-equal-shallow')
const _take = require('lodash/take')

const prefix = css`
  :host {
    width: 100%;
    height: calc(100vh - 60px);
    position: fixed;
    top: 60px;
    right: 0;
    left: 0;
    bottom: 0;
    overflow: hidden;
  }

  :host li {
    list-style: none;
    position: relative;
  }

  :host li .image {
    height: calc(100vw / 4);
    width: calc(100vw / 4);
  }

  :host li .image:hover::after {
    background: rgba(0, 0, 0, 0);
    transition: background 200ms ease;
  }

  :host li .image::after {
    content: "";
    transition: background 200ms ease;
    background: rgba(0, 0, 0, .75);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
  }

  @media(min-width:960px) {
    :host li .image {
      height: calc(100vw / 6);
      width: calc(100vw / 6);
    }
  }
`

module.exports = imageGrid

function imageGrid () {
  const component = microcomponent({
    props: {
      items: []
    },
    state: {
      items: [],
      max: 30
    }
  })

  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)

  return component

  function render () {
    const state = this.state

    state.items = this.props.items

    return html`
      <ul class="${prefix} layout row-wrap list">
        ${_take(state.items, state.max).map(gridItem)}
      </ul>
    `

    function gridItem (item) {
      const { src } = item
      return html`
        <li>
          <div class="image" style="background: url(${src}) 50% 50% / cover no-repeat rgb(255, 255, 255);"></div>
        </li>
      `
    }
  }

  function update (props) {
    return !isEqual(component.state.items, props.items)
  }

  function load () {
    console.log('mounted on DOM')
  }

  function unload () {
    console.log('removed from DOM')
    component._element = null
  }
}
