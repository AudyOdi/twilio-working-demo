// const ClientCapability = require('twilio').jwt.ClientCapability;
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const config = require('../config');

exports.tokenGenerator = function tokenGenerator(clientName) {
  let token = new AccessToken(
    config.accountSid,
    config.apiKey,
    config.apiKeySecret
  );

  // Assign the generated identity to the token.
  token.identity = clientName;

  // Grant the access token Twilio Video capabilities.
  let grant = new AccessToken.VoiceGrant({
    pushCredentialSid: config.pushCredentialSid,
    outgoingApplicationSid: config.twimlAppSid,
  });
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  return {
    identity: clientName,
    token: token.toJwt(),
  };

  // const capability = new ClientCapability({
  //   accountSid: config.accountSid,
  //   authToken: config.authToken,
  // });
  //
  // capability.addScope(new ClientCapability.IncomingClientScope(identity));
  // capability.addScope(
  //   new ClientCapability.OutgoingClientScope({
  //     applicationSid: config.twimlAppSid,
  //     clientName: identity,
  //   })
  // );
  //
  // // Include identity and token in a JSON response
  // return {
  //   identity: identity,
  //   token: capability.toJwt(),
  // };
};

exports.voiceResponse = function voiceResponse(toNumber, fromNumber) {
  // Create a TwiML voice response
  const twiml = new VoiceResponse();

  if (toNumber) {
    const dial = twiml.dial({
      callerId: isAValidPhoneNumber(fromNumber) ? fromNumber : config.callerId,
    });

    const fromNumberType = isAValidPhoneNumber(fromNumber)
      ? 'number'
      : 'client';

    if (fromNumberType === 'client') {
      const attr = isAValidPhoneNumber(toNumber) ? 'number' : 'client';
      dial[attr]({}, toNumber);
    } else {
      dial.client(toNumber);
    }
  } else {
    twiml.say('Thanks for calling!');
  }

  return twiml.toString();
};

/**
* Checks if the given value is valid as phone number
* @param {Number|String} number
* @return {Boolean}
*/
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
