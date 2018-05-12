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
    // citymapper://directions
    // https://citymapper.com/directions
    window.location = `citymapper://directions?startcoord=${
      state.position.latitude
    }%2C${state.position.longitude}&endcoord=${place.geometry.location.lat}%2C${
      place.geometry.location.lng
    }&endname=${place.name}&endaddress=${place.vicinity}`;
    console.log('celebrate!');
  }

  function renderRating(rating) {
    let reaction = '🤷';
    if (rating > 0) {
      reaction = '😷';
    }
    if (rating > 1) {
      reaction = '😨';
    }
    if (rating > 2) {
      reaction = '😕';
    }
    if (rating > 3) {
      reaction = '😐';
    }
    if (rating > 4) {
      reaction = '🙂';
    }
    if (rating > 4.5) {
      reaction = '😀';
    }
    if (rating > 4.8) {
      reaction = '😃';
    }
    return state.showTrueRating ? rating : reaction;
  }

  const Place = function (place) {
    // TODO: TODO TODO

    function toggleTrueRating() {
      state.showTrueRating = !state.showTrueRating;
      emit(state.events.RENDER);
    }

    const foodItem = html`
    <div id="${place.id}" class="card mt0 pt0 mb7 bg-near-white dark-gray h-auto tl">
      <div class="pv2 w-100 h5 db" style="flex:2;background:url(${place.photo}) 50% 50% no-repeat;background-size: cover;border-radius:3px 3px 0 0 " ></div>
      <div class="cardInfo pt3 pb4 ph3">
        <div class="cardText ma0 pa0">
          <h3 class="f3 pa0 ma0 helvetica cardTitle">${place.name}</h3>
          <h4 class="gray pa0 ma0 cardSubtitle">${place.travelTime ? `${place.travelTime}` : 'A few'} minutes away</h4>
        </div>
        <div class="cardRating ma0 pa0">
          <span class="gray f1 pa0 ma0" ontouchend=${toggleTrueRating} ontap=${toggleTrueRating} onclick=${toggleTrueRating}>${renderRating(place.rating)}</span>
        </div>
      </div>
    </div>`;
    return foodItem;
  };

  emit('cards:reset', reject, (id) => { accept(state.places.find(place => place.id === id)); });

  return html`
    <body class=" helvetica tc">
    <span class="f-headline pv0 mv0 emojiTitle">${
  state.foods.find(food => food.name === state.params.wildcard).emoji
}</span>
    <div class="card-container ph3">
      ${state.places.filter(place => place.ready).map(place => Place(place))}
      ${state.places.length === 0 ? 'Loading...' : html`<span>You hated all the options nearby. <a href="/" class="link navy b">Maybe try another food?</a></span>`}
    </div>
    </body>
  `;
}
