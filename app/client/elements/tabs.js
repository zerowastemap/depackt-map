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
    tab: 'search',
    tabs: [],
    state: {
      tabs: [],
      tab: 'search'
    }
  })

  const choo = window.choo

  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)

  choo.on('toggle:tab', tabtoggle)

  return component

  function tabtoggle (tab) {
    const opened = component.state.tab === tab
    component.state.tab = opened ? '' : tab
    morph(component._element.querySelector('.tabs'), renderTabs())
  }

  function renderTabs (tabs = component.state.tabs) {
    const tabItems = tabs.map((tab) => {
      // Currently don't know how to correctly diff component
      return tab.isComponent ? html`
        <div style=${isTabopen(tab.name) ? '' : 'display:none'}">
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
    return component.state.tab === tab
  }

  function render () {
    const state = this.state
    state.tabs = component.props.tabs

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
    return props.tab !== component.state.tab ||
      component.state.tab !== window.choo.state.tab
  }
}
