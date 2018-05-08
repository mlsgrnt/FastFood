var html = require('choo/html')

var TITLE = 'fastfood - route not found'

module.exports = view

function view (state, emit) {
  return html`
    <body class="sans-serif pa3">
      <h1>Route not found.</h1>
      <a class="pt2" href="/">Back to main.</a>
    </body>
  `
}
