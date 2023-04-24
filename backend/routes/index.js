var express = require('express');
var cors = require('cors');
require('dotenv').config();
var router = express.Router();

const API_URL = "https://api.musixmatch.com/ws/1.1/";

/* Get track information. */
router.get('/track', async (req, res, next) => {
  const url = `${API_URL}track.get?track_isrc=${req.query.track_isrc}&apikey=${process.env.REACT_APP_MUSIXMATCH_API_KEY}`;
  const response = await (await fetch(url)).json();
  return res.json(response);
});

/* Get track lyrics. */
router.get('/track/lyrics', async (req, res, next) => {
  const url = `${API_URL}track.lyrics.get?track_id=${req.query.track_id}&apikey=${process.env.REACT_APP_MUSIXMATCH_API_KEY}`;
  const response = await (await fetch(url)).json();
  return res.json(response);
});

module.exports = router;
