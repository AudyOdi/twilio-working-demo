const Router = require('express').Router;

const {tokenGenerator, voiceResponse} = require('./handler');

const router = new Router();

let clientName;

/**
 * Generate a Capability Token for a Twilio Client user - it generates a random
 * username for the client requesting a token.
 */
router.get('/token', (req, res) => {
  let result = tokenGenerator(req.query.client || 'kodefox');
  console.log('client identity', result);
  clientName = result.identity;
  res.send(result);
});

router.post('/voice', (req, res) => {
  res.set('Content-Type', 'text/xml');
  console.log('req.body', req.body);
  res.send(
    voiceResponse(
      clientName === req.body.To.substring(1) ? clientName : req.body.To,
      req.body.From
    )
  );
});

module.exports = router;
