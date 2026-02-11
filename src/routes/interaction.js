const express = require('express');
const User = require('../models/User'); // Import model User tadi

export default (oidc) => { ... }
  const router = express.Router();

  // 1. GET: Tampilkan Halaman Login
  router.get('/:uid', async (req, res, next) => {
    try {
      // Ambil detail interaksi dari OIDC Provider (Siapa clientnya? Apa scope-nya?)
      const details = await oidc.interactionDetails(req, res);
      const { uid, prompt, params } = details;

      const client = await oidc.Client.find(params.client_id);

      // Render file login.ejs
      return res.render('login', {
        uid,
        clientName: client ? client.clientName : 'Aplikasi Tidak Dikenal',
        error: details.result ? details.result.error : null,
        params
      });
    } catch (err) {
      return next(err);
    }
  });

  // 2. POST: Proses Login
  router.post('/:uid/login', async (req, res, next) => {
    try {
      const { uid } = req.params;
      const { email, password } = req.body;

      // A. Cari User di MongoDB
      const user = await User.findOne({ email });
      
      // B. Validasi Password
      if (!user || !(await user.isValidPassword(password))) {
        // Jika gagal, render ulang login.ejs dengan pesan error
        const details = await oidc.interactionDetails(req, res);
        const client = await oidc.Client.find(details.params.client_id);
        
        return res.render('login', {
          uid,
          clientName: client.clientName,
          error: 'Email atau password salah!',
          params: details.params
        });
      }

      // C. Jika Login Sukses: Beritahu OIDC Provider
      const result = {
        login: {
          accountId: user._id.toString(), // ID User dari MongoDB
        },
      };

      // Redirect user kembali ke proses OIDC (biasanya lanjut ke Consent atau callback)
      await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
      
    } catch (err) {
      next(err);
    }
  });

  // 3. GET: Batalkan Login (Abort)
  router.get('/:uid/abort', async (req, res, next) => {
    try {
      const result = {
        error: 'access_denied',
        error_description: 'User membatalkan login.',
      };
      await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
