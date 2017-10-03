const html = require('choo/html')

module.exports = Article

function Article ({title, content, notice}) {
  return html`
    <article role="article" class="flex2 markdown-body">
      <header class="flex">
        <h1>${title}</h1>
      </header>
      ${notice ? html`
        <blockquote>
          ${notice}
        </blockquote>
      ` : ''}
      <section id="content">
        ${content}
      </section>
    </article>
  `
}
