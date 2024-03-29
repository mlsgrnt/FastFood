import 'whatwg-fetch';

module.exports = store;

function store(state, emitter) {
  state.places = [];
  emitter.on('DOMContentLoaded', () => {
    emitter.on('maps:findNearby', (food) => {
      state.places = []; // reset in case this is a second food
      // ""
      fetch(
        `https://coral-biplane.glitch.me/nearby?location=${
          state.position.latitude
        },${state.position.longitude}&keyword=${food}&rankby=distance`,
        { mode: 'cors' },
      ).then((data) => {
        // fetch(`https://api.foursquare.com/v2/venues/search?ll=${state.position.latitude},${state.position.longitude}&intent=browse&radius=1500&query=${food}&client_id=${id}&client_secret=${secret}&v=20180507`, { mode: 'cors' }).then((data) => {
        data.json().then((json) => {
          state.places = json.results.filter(place => (place.opening_hours ? place.opening_hours.open_now : true));
          state.currentPlaceIndex = 0;
          emitter.emit('maps:getDetails', 0, 2);
          emitter.emit(state.events.RENDER);
        });
      });
    });

    emitter.on('maps:getDetail', (placeIndex) => {
      if (placeIndex > state.places.length - 1) {
        return; // we good
      }
      // set loaded flag
      state.places[placeIndex].ready = true;

      const endCoord = state.places[placeIndex].geometry.location;
      // fetch(`https://coral-biplane.glitch.me/citymapper?startcoord=${
      //   state.position.latitude
      // },${state.position.longitude}&endcoord=${endCoord.lat},${endCoord.lng}`).then((data) => {
      //   data.json().then((json) => {
      //     state.places[placeIndex].travelTime = json.travel_time_minutes;
      //     if (placeIndex === state.currentPlaceIndex) {
      //       emitter.emit(state.events.RENDER);
      //     }
      //   });
      // });
      fetch(`https://coral-biplane.glitch.me/graphhopper/route?point=${state.position.latitude},${state.position.longitude}&point=${endCoord.lat},${endCoord.lng}&vehicle=foot&debug=false&type=json&calc_points=false&instructions=false`)
      .then(data => data.json().then(json => {
        state.places[placeIndex].travelTime = json.paths[0].time / 1000 / 60
        if (placeIndex === state.currentPlaceIndex) {
                emitter.emit(state.events.RENDER);
              }
      }))
      if (state.places[placeIndex].photos) {
        fetch(
          `https://coral-biplane.glitch.me/image?ref=${
            state.places[placeIndex].photos[0].photo_reference
          }`,
          { mode: 'cors' },
        )
          .then(response => response.blob())
          .then((imageBlob) => {
            state.places[placeIndex].photo = URL.createObjectURL(imageBlob);
            if (placeIndex === state.currentPlaceIndex) {
              emitter.emit(state.events.RENDER);
            }
          });
      }
    });

    emitter.on('maps:getDetails', (startIndex, endIndex) => {
      for (let i = startIndex; i < endIndex + 1; i++) {
        emitter.emit('maps:getDetail', i);
      }
    });
  });
}
