const microcomponent = require('microcomponent')
const html = require('choo/html')
const rangesliderJs = require('rangeslider-js')

module.exports = RangeSlider

function RangeSlider () {
  const component = microcomponent({
    value: 100,
    state: {
      value: 100,
      name: 'slider'
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

    state.name = this.props.name
    state.value = this.props.value

    if (!component.state.slider) {
      component._element = html`
        <div class="ma3 ${state.name}">
          <input id="slider1" type="range">
        </div>
      `
    }

    return component._element
  }

  function load () {
    const slider = component._element.querySelector('#slider1')
    rangesliderJs.create(slider, {
      min: 0,
      max: 1000,
      value: component.state.value,
      step: 1,
      onSlideEnd: (value, percent, position) => {
        component.emit('progress', {value, percent, position})
      }
    })
    component.state.slider = slider['rangeslider-js']
    console.log('loaded')
  }

  function unload () {
    console.log('unloaded')
    component.state = {}
    component._element = null
  }

  function update (props) {
    return props.value !== component.state.value
  }
}
