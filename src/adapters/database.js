// src/adapters/database.js
const Knex = require('knex');

// Koneksi ke Database (Sesuaikan dengan DB Anda)
const knex = Knex({
  client: 'pg', // atau 'mysql2'
  connection: process.env.DATABASE_URL
});

class DbAdapter {
  constructor(name) {
    this.name = name; // Nama model: "Session", "AccessToken", dll.
  }

  // 1. Simpan/Update Data (Upsert)
  async upsert(id, payload, expiresIn) {
    const expiresAt = new Date(Date.now() + (expiresIn * 1000));
    
    await knex('oidc_payloads')
      .insert({
        id: id,
        type: this.name,
        payload: JSON.stringify(payload),
        grantId: payload.grantId,
        userCode: payload.userCode,
        uid: payload.uid,
        expires_at: expiresAt,
      })
      .onConflict('id') // Fitur PostgreSQL (untuk MySQL gunakan logic update on duplicate)
      .merge();
  }

  // 2. Ambil Data
  async find(id) {
    const result = await knex('oidc_payloads').where({ id }).first();
    if (!result) return undefined;
    return {
      ...JSON.parse(result.payload),
      expiresAt: new Date(result.expires_at) // Format ulang tanggal
    };
  }

  // 3. Ambil Data berdasarkan User Code (Device Flow)
  async findByUserCode(userCode) {
    const result = await knex('oidc_payloads').where({ userCode }).first();
    if (!result) return undefined;
    return {
      ...JSON.parse(result.payload),
      expiresAt: new Date(result.expires_at)
    };
  }

  // 4. Hapus Data (Saat logout atau token dipakai)
  async destroy(id) {
    await knex('oidc_payloads').where({ id }).del();
  }

  // 5. Bersihkan Data Sampah (Garbage Collection)
  // Dipanggil otomatis oleh library
  async revokeByGrantId(grantId) {
    await knex('oidc_payloads').where({ grantId }).del();
  }
}

module.exports = DbAdapter;