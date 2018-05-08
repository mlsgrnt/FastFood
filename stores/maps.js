import 'whatwg-fetch';

module.exports = store;

function store(state, emitter) {
  state.places = [];
  emitter.on('DOMContentLoaded', () => {
    const id = 'VR1LIQ4AZU0XBE1ZM1FWDPQL1IC21ZOBBL3WVCQDMOWDWSVD';
    const secret = '3NPGRCWARESB1X5E3XCU45ZE4H555JSWV0UQ3CFQUQ4OS4HE';
    const citymapperKey = '2e296a1adf84ab1134be98c5921d3f04';

    emitter.on('maps:findNearby', (food) => {
      // ""
      fetch(`https://cors.now.sh/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${state.position.latitude},${state.position.longitude}&keyword=${food}&rankby=distance&key=AIzaSyDOX1gyFUS9hWFzDAR_Jt6yhVbxvtA0LFM`, { mode: 'cors' }).then((data) => {
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
      const endCoord = state.places[placeIndex].geometry.location;
      fetch(`https://cors.now.sh/https://developer.citymapper.com/api/1/traveltime?startcoord=${state.position.latitude},${state.position.longitude}&endcoord=${endCoord.lat},${endCoord.lng}&key=${citymapperKey}`).then((data) => {
        data.json().then((json) => {
          state.places[placeIndex].travelTime = json.travel_time_minutes;
        });
      });
      if (state.places[placeIndex].photos.length > 0) {
        fetch(`https://cors.now.sh/https://maps.googleapis.com/maps/api/place/photo?photoreference=${state.places[placeIndex].photos[0].photo_reference}`)
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

