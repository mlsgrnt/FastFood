const fetch = require('node-fetch');
const parse = require('querystring').parse;

const googleKey = 'AIzaSyDOX1gyFUS9hWFzDAR_Jt6yhVbxvtA0LFM';

module.exports = async (req, res) => {
  const query = parse(req.url);
  const ref = query['/image?ref'];
  const image = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&maxheight=1600&photoreference=${ref}&key=${googleKey}`);

  res.end(await image.text());
};
