const html = require('choo/html');

const TITLE = 'fastfood - main';

module.exports = view;

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE);

  return html`
    <body class="code lh-copy">
      <main class="pa3 cf center">
        hello world
        <label for="search">
    search
  </label>
  <input id="search" name="search"
    type="text"
    required
    title="Find Food"
    onchange=${handleSearchChange}
  >
  <button onclick=${handleClick}>Find food</button>
      </main>
      <ul>
    ${state.places.map(place => html`<li>${place.name}</li>`)}
    </ul>
    </body>
  `;

  function handleClick() {
    emit('maps:findNearby', state.food || 'pizza');
  }
  function handleSearchChange(e) {
    state.food = e.target.value;
  }
}
