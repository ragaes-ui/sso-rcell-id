const MongoAdapter = require('../adapters/mongodb-adapter'); 
const Account = require('../support/account');

module.exports = {
  adapter: MongoAdapter,
  findAccount: Account.findAccount,

  scopes: ['openid', 'profile', 'email'],
  claims: {
    openid: ['sub'], 
    profile: ['name'],
    email: ['email'],
  },

  clients: [{
    client_id: 'app-klien-satu',
    client_secret: 'rahasia',
    grant_types: ['authorization_code'], 
    redirect_uris: ['http://localhost:8080/cb'],
    scope: 'openid profile email' 
  }],

  features: {
    devInteractions: { enabled: false }, 
  },
  
  pkce: { required: () => false },
  cookies: { keys: ['kunci-rahasia-rcell-123'] },
  
  // BAGIAN INI YANG TADI ERROR: Sudah diperbaiki filenya
  jwks: {
    keys: [
      {
        kty: 'RSA',
        n: '0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78L-G_AXT' +
           'r327S8V6S9q62Y1x-8z1X-fF6O0fF6O0fF6O0fF6O0fF6O0fF6O0',
        e: 'AQAB',
        d: 'XpS7t699t699t699t699t699t699t699t699t699t699t699t699',
        p: '9ce_p-7M7M7M7M7M7M7M7M7M7M7M7M7M7M7M7M7M7M7M7M7M7M7',
        q: '2fF_q-8N8N8N8N8N8N8N8N8N8N8N8N8N8N8N8N8N8N8N8N8N8N8',
        dp: '1aA_dp-9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O',
        dq: '3bB_dq-0P0P0P0P0P0P0P0P0P0P0P0P0P0P0P0P0P0P0P0P0P0',
        qi: '4cC_qi-1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1',
        use: 'sig',
        kid: 'kunci-utama-rcell'
      }
    ]
  },
};