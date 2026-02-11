import express from 'express';
import User from '../models/User.js'; // Wajib pakai .js di ESM

export default (oidc) => {
  const router = express.Router();

  // GET: Menampilkan Halaman Login
  router.get('/:uid', async (req, res, next) => {
    try {
      const details = await oidc.interactionDetails(req, res);
      const { uid, prompt, params } = details;
      const client = await oidc.Client.find(params.client_id);

      return res.render('login', {
        uid,
        clientName: client ? client.clientName : 'Aplikasi RCell',
        error: details.result ? details.result.error : null,
        params
      });
    } catch (err) {
      return next(err);
    }
  });

  // POST: Memproses Tombol "Masuk"
  router.post('/:uid/login', async (req, res, next) => {
    try {
      const { uid } = req.params;
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user || !(await user.isValidPassword(password))) {
        const details = await oidc.interactionDetails(req, res);
        const client = await oidc.Client.find(details.params.client_id);
        
        return res.render('login', {
          uid,
          clientName: client ? client.clientName : 'Aplikasi RCell',
          error: 'Email atau Password salah!',
          params: details.params
        });
      }

      const result = {
        login: { accountId: user._id.toString() },
      };

      await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      next(err);
    }
  });

  return router;
}; 
