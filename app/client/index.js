require('babel-polyfill')

const app = require('choo')()
const components = {
  leaflet: require('./elements/leaflet')(),
  search: require('./elements/search')(),
  select: require('./elements/select')(),
  tabs: require('./elements/tabs')(),
  directorySearch: require('./elements/directory-search')(),
  imageGrid: require('./elements/grid')(),
  rangeSlider: require('./elements/range-slider')(),
  translateChooser: require('./elements/translate-chooser')()
}

if (process.env.APP_ENV !== 'production') {
  app.use(require('choo-log')())
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}

app.use(require('choo-service-worker')())
app.use(require('./lib/translations')())

app.use(require('./store')(components))

require('./style')
require('./routes')(app, components)

app.mount('#app')
