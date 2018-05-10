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
    if (rating === 5) {
      reaction = '😃';
    }
    return reaction;
  }

  const Place = function (place) {
    const foodItem = html`
    <div id="${place.id}" class="card bg-near-white dark-gray pa3 h-auto tl">
      <div class="pv2 w-100 h5 db" style="flex:2;background:url(${place.photo}) 50% 50% no-repeat;background-size: cover;" ></div>
      <div class="mh2 w-100">
        <h3 class="mb0 pb0 pr0 mr0 f3 helvetica mw5">${place.name}</h3>
        <h4 class="mv0 pv0 gray">${place.travelTime ? `${place.travelTime} minutes away` : 'Some ways away'}</h4>
        <h4 class="mv0 pv0 gray f1 fr">${renderRating(place.rating)}</h4>
      </div>
    </div>`;
    return foodItem;
  };

  emit('cards:reset', reject, (id) => { accept(state.places.find(place => place.id === id)); });
  return html`
    <body class="bg-light-red helvetica tc">
    <h1 class="f1 pv0 mv0">${
  state.foods.find(food => food.name === state.params.wildcard).emoji
}</h1>
    <div class="card-container">
      ${state.places.filter(place => place.ready).map(place => Place(place))}
      ${state.places.length === 0 ? 'Loading...' : html`<span>You hated all the options nearby. <a href="/" class="link navy b">Maybe try another food?</a></span>`}
    </div>
    </body>
  `;
}
