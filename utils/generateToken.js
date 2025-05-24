import React from 'react';
import { View, Text } from 'react-native';
import { createHmac } from 'crypto-browserify'; // Compatible for React Native

function generateToken(identity) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    iss: 'YOUR_TWILIO_API_KEY',
    sub: 'YOUR_TWILIO_ACCOUNT_SID',
    identity,
    grants: {
      video: {},
    },
  };

  const secret = 'YOUR_TWILIO_API_SECRET';

  const base64UrlEncode = (obj) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);

  const signature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export default generateToken;
