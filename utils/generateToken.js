const twilio = require('twilio');

const accountSid = 'your_account_sid'; // Replace with your Account SID
const apiKey = 'your_api_key'; // Replace with your API Key
const apiSecret = 'your_api_secret'; // Replace with your API Secret

const token = new twilio.jwt.AccessToken(accountSid, apiKey, apiSecret);
token.identity = 'testUser';
const videoGrant = new twilio.jwt.AccessToken.VideoGrant({ room: 'testRoom' });
token.addGrant(videoGrant);

console.log(token.toJwt());