const microcomponent = require('microcomponent')
const html = require('choo/html')
const morph = require('nanomorph')
const css = require('sheetify')

const prefix = css`
  :host .tab.hidden {
    display: none;
  }
`

module.exports = Tabs

function Tabs () {
  const component = microcomponent({
    tab: null,
    tabs: [],
    state: {
      tabs: [],
      tab: 'search'
    }
  })

  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)

  return component

  function renderTabs (tabs = component.state.tabs) {
    const tabItems = tabs.map((tab) => {
      // Currently don't know how to correctly diff component
      return tab.isComponent ? html`
        <div style=${tab.opened ? '' : 'display:none'}">
          ${tab.el}
        </div>
      ` : isTabopen(tab.name) ? tab.el : ''
    })

    return html`
      <div class="${prefix} tabs">
        ${tabItems}
      </div>
    `
  }

  function isTabopen (tab) {
    return component.props.tab === tab
  }

  function render () {
    const state = this.state
    state.tabs = component.props.tabs
    state.tab = component.props.tab

    return html`
      <div>
        ${renderTabs()}
      </div>
    `
  }

  function load () {
    console.log('loaded')
  }

  function unload () {
    console.log('unloaded')
    component.state.tabs = []
    component._element = null
  }

  function update (props) {
    return props.tab !== component.state.tab
  }
}
