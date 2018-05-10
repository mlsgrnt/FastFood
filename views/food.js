const html = require('choo/html');

module.exports = view;

function view(state, emit) {
  function reject() {
    // TODO: no more currentpalce idnex :(
    state.places[state.currentPlaceIndex].ready = false; // no longer render!
    state.currentPlaceIndex++;
    emit('maps:getDetail', state.currentPlaceIndex + 2); // always be a few ahead!
  }
  function accept(place) {
    state.chosenPlace = place;
    // temp:
    window.location = `https://citymapper.com/directions?startcoord=${
      state.position.latitude
    }%2C${state.position.longitude}&endcoord=${place.geometry.location.lat}%2C${
      place.geometry.location.lng
    }&endname=${place.name}&endaddress=${place.vicinity}`;
    console.log('celebrate!');
  }

  const Place = function (place) {
    const foodItem = html`
    <div id="${place.id}"class="card" bad="bg-near-white dark-gray shadow-2 br2 pa3 h-auto min-vh-75 ma1 tl">
      <img class="w-100 pv2 h-max-5" src="${place.photo}" />
      <div class="mh2">
        <h3 class="mb0 pb0 helvetica">${place.name}</h3>
        <h4 class="mv0 pv0 gray">${place.rating} stars</h4>
        ${
  place.travelTime
    ? html`<h4 class="mv0 pv0 gray">${place.travelTime} minutes away</h4>`
    : ''
}
      </div>
      <div>
        <button onclick=${reject}>reject</button>
        <button onclick=${() => accept(place)}>accept</button>
      </div>
    </div>`;
    return foodItem;
  };

  emit('cards:reset', reject, (id) => { accept(state.places.find(place => place.id === id)); });
  return html`
    <body class="bg-light-red helvetica tc">
    <h1>${
  state.foods.find(food => food.name === state.params.wildcard).emoji
}</h1>
    <div class="card-container">
      ${state.places.filter(place => place.ready).map(place => Place(place))}
      loading or no more cards message!
    </div>
    </body>
  `;
}
