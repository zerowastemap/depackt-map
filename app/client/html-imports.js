;((window, document) => {
  window.addEventListener('HTMLImportsLoaded', e => {
    const link = document.querySelector('link[id="icons"]')
    const content = link.import
    const el = content.querySelector('#svg-icons')
    const clone = document.importNode(el.content, true)
    document.body.append(clone)
  })
})(window, document)
