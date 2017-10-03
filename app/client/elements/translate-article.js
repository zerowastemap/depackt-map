const microcomponent = require('microcomponent')
const html = require('choo/html')
const request = require('request')
const Article = require('./article')
const morph = require('nanomorph')

module.exports = TranslateArticle

function TranslateArticle () {
  const component = microcomponent({
    props: {
      lang: 'fr',
      name: 'about'
    }
  })
  component.on('render', render)
  component.on('update', update)
  component.on('load', load)
  component.on('unload', unload)
  component.on('contentloaded', contentloaded)

  return component

  function contentloaded () {
    const article = Article({
      title: component.state.title,
      content: toHtml(component.state.body)
    })

    morph(component.element.querySelector('.markdown-body'), article)
  }

  function render () {
    const state = this.state

    state.lang = this.props.lang
    state.name = this.props.name
    state.title = this.props.title

    if (!component._element) {
      component._element = html`<div class="flex2">
        <article role="article" class="markdown-body"></article>
      </div>`

      return component._element
    } else {
      _update()
      return component._element
    }
  }

  function _update () {
    const { lang, name } = component.state

    return request({uri: `/pages/${lang}/${name}`}, (err, response, body) => {
      if (!err) {
        component.state.body = body
      }
      component.emit('contentloaded', component.state.body)
    })
  }

  function update (props) {
    return props.name !== component.props.name ||
      props.lang !== component.props.lang
  }

  function load () {
    _update()
  }

  function unload () {
    console.log('dropdown removed from DOM')
    this._element = null
  }
}

function toHtml (str) {
  if (module.parent) return str
  const el = html`<div></div>`
  el.innerHTML = str
  return el
}
