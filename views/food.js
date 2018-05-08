const html = require('choo/html');

module.exports = view;

function view(state, emit) {
  function reject() {
    state.currentPlaceIndex++;
    emit(state.events.RENDER);
    emit('maps:getDetail', state.currentPlaceIndex + 2); // always be a few ahead!
  }
  function accept(place) {
    state.chosenPlace = place;
    console.log('celebrate!');
  }

  const Place = function (place) {
    if (place === undefined) {
      return 'loading';
    }
    console.log(place);
    return html`
    <div>
      ${place.name}
      <button onclick=${reject}>reject</button>
      <button onclick=${() => accept(place)}>accept</button>
    </div>`;
  };
  return html`
    <body class="helvetica">
    <h1>${state.foods.find(food => food.name === state.params.wildcard).emoji}</h1>
    ${Place(state.places[state.currentPlaceIndex])}
    </body>
  `;
}

