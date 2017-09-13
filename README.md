<h1 align="center">Depackt</h1>

<div align="center">
  <strong>Zero Waste Map</strong>
</div>

<div align="center">
  :world_map: :mag: :sparkles:
</div>

<br />

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
  <!-- Standard -->
  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"
      alt="Standard" />
  </a>
</div>

## Installation

    $ npm install

## Development

    $ npm start

    or with pm2

    $ pm2 start index.js --interpreter ./node_modules/.bin/babel-node --name depackt-map --watch

## Testing

    $ npm test

## API

API repo is also available on github <https://github.com/depackt/depackt-api>

## REST API ENDPOINTS

**Get locations**
----
  Returns json data for locations

* **URL**

  https://api.depackt.be/locations

* **Method:**

  `GET`

*  **URL Params**

   **Optional:**

   `longitude=[integer]`

   `latitude=[integer]`

   `distanceKm=[integer]`

   `limit=[integer]`

* **Data Params**

  None

## Contributors

- Augustin Godiscal <hello@auggod.tech>

## See Also
- [choo](https://github.com/choojs/choo) - sturdy 4kb frontend framework
- [bankai](https://github.com/yoshuawuyts/bankai) - streaming asset compiler
- [bel](https://github.com/shama/bel) - composable DOM elements using template
  strings
- [sheetify](https://github.com/stackcss/sheetify) - modular CSS bundler for
  `browserify`

## License
[MIT](https://tldrlegal.com/license/mit-license)
