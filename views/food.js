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
    // temp:
    window.location = `https://citymapper.com/directions?startcoord=${state.position.latitude}%2C${state.position.longitude}&endcoord=${place.geometry.location.lat}%2C${place.geometry.location.lng}&endname=${place.name}&endaddress=${place.vicinity}`;
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
      <img src="${place.photo}" />
      rating: ${place.rating}
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

