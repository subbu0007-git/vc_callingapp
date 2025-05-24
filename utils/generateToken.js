import * as Crypto from 'expo-crypto';

async function generateToken(identity) {
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

    const signature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${encodedHeader}.${encodedPayload}`,
        { key: secret }
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export default generateToken;
