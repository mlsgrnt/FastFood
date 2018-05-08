const cors = require('micro-cors')();
const fetch = require('node-fetch');
const parse = require('querystring').parse;


const handler = async (req, res) => {
  const query = parse(req.url);
  if (query['/image?ref']) {
    const ref = query['/image?ref'];
    const image = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&maxheight=1600&photoreference=${ref}&key=${process.env.GOOGLE}`);

    res.end(await image.buffer());
  }
  if (req.url.includes('citymapper')) {
    const request = req.url.split('/citymapper')[1];
    const response = await fetch(`https://developer.citymapper.com/api/1/traveltime/${request}&key=${process.env.CITYMAPPER}`);
    res.end(await response.buffer());
  }
  if (req.url.includes('nearby')) {
    const request = req.url.split('/nearby')[1];
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json${request}&key=${process.env.GOOGLE}`);
    res.end(await response.buffer());
  }
  res.end('fail');
};

module.exports = cors(handler);
