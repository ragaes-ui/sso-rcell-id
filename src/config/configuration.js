import MongoAdapter from '../adapters/mongodb-adapter.js'; 
import Account from '../support/account.js';

export default {
  adapter: MongoAdapter,
  findAccount: Account.findAccount,

  scopes: ['openid', 'profile', 'email'],
  claims: {
    openid: ['sub'], 
    profile: ['name'],
    email: ['email'],
  },

  // Daftarkan aplikasi rcellfest kamu di sini
  clients: [{
    client_id: 'app-rcellfest',
    client_secret: 'rahasia-fest-123',
    grant_types: ['authorization_code'],
    redirect_uris: ['https://rcellfest.vercel.app/api/auth/callback/oidc'], 
    scope: 'openid profile email'
  }],

  features: {
    devInteractions: { enabled: false }, 
  },
  
  pkce: { required: () => false },
  cookies: { keys: ['kunci-rahasia-sso-rcell-id'] },
  
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
