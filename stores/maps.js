import 'whatwg-fetch';

module.exports = store;

function store(state, emitter) {
  state.places = [];
  emitter.on('DOMContentLoaded', () => {
    const id = 'VR1LIQ4AZU0XBE1ZM1FWDPQL1IC21ZOBBL3WVCQDMOWDWSVD';
    const secret = '3NPGRCWARESB1X5E3XCU45ZE4H555JSWV0UQ3CFQUQ4OS4HE';
    const citymapperKey = '2e296a1adf84ab1134be98c5921d3f04';

    emitter.on('maps:findNearby', (food) => {
      fetch(`https://api.foursquare.com/v2/venues/search?ll=${state.position.latitude},${state.position.longitude}&intent=browse&radius=1500&query=${food}&client_id=${id}&client_secret=${secret}&v=20180507`, { mode: 'cors' }).then((data) => {
        data.json().then((json) => {
          state.places = json.response.venues;
          emitter.emit('maps:getTravelTime', state.places[0].location.labeledLatLngs[0]); // TODO
          emitter.emit(state.events.RENDER);
        });
      });
    });

    emitter.on('maps:getTravelTime', (endCoord) => {
      fetch(`https://cors.now.sh/https://developer.citymapper.com/api/1/traveltime?startcoord=${state.position.latitude},${state.position.longitude}&endcoord=${endCoord.lat},${endCoord.lng}&key=${citymapperKey}`).then((data) => {
        data.json().then((json) => {
          console.log(json);
        });
      });
    });
  });
}

