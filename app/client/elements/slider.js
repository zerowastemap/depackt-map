const microcomponent = require('microcomponent')
const html = require('choo/html')
const morph = require('nanomorph')
const css = require('sheetify')
const Nanobounce = require('nanobounce')
const nanobounce = Nanobounce()
// const isEmpty = require('lodash/isEmpty')
// const slug = require('slug/slug-browser')
// const icon = require('./icon.js')
// const translate = require('./translate.js')

const prefix = css('./slider.css')

module.exports = Slider

function Slider () {
  const component = microcomponent({
    progress: 0,
    value: 100,
    state: {
      progress: 0,
      value: 100,
      name: 'slider',
      translations: {}
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
    state.translations = this.props.translations
    state.progress = this.props.progress

    function rangeSlider () {
      return html`
        <div class="range-slider">
          <input type="range" id="progress" name="percent" onmousedown=${_mouseDown} onmouseup=${_mouseUp} onmouseout=${_mouseOut} onclick=${_seek} step='0.01' class="seek-bar" value=${state.progress} />
          <div class="range-slider--fill" style=${_computeCss('width', 100 - state.progress)}></div>
          <div class="range-slider--handle" style=${_computeCss('left', state.progress)}></div>
          <div class="range-slider--background"></div>
        </div>
      `
    }

    return html`
      <div class="${prefix} ma3 ${state.name}">
        ${rangeSlider()}
      </div>
    `
  }

  function _mouseDown (e) {
    e.target.addEventListener('mousemove', _seek)
  }

  function _mouseUp (e) {
    e.target.removeEventListener('mousemove', _seek)
  }

  function _mouseOut (e) {
    e.target.removeEventListener('mousemove', _seek)
  }

  function _computeCss (prop, progress) {
    return `${prop}:${progress}%;`
  }

  function _seek (e) {
    e.preventDefault()

    if (e.offsetX < 0) return false

    const percent = (e.offsetX / e.target.offsetWidth || (e.layerX - e.target.offsetLeft) / e.target.offsetWidth) * 100

    if (percent > 100) return false

    component.state.progress = percent

    nanobounce(function () {
      component.emit('progress', percent)
    })

    component._element.querySelector('.seek-bar').value = component.state.progress
    morph(component._element.querySelector('.range-slider--fill'), html`<div class="range-slider--fill" style=${_computeCss('width', 100 - component.state.progress)}></div>`)
    morph(component._element.querySelector('.range-slider--handle'), html`<div class="range-slider--handle" style=${_computeCss('left', component.state.progress)}></div>`)
  }

  function load () {
    console.log('loaded')
  }

  function unload () {
    console.log('unloaded')
    component._element = null
  }

  function update (props) {
    return props.progress !== component.state.progress
  }
}
