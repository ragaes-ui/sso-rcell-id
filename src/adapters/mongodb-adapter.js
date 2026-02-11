// src/adapters/mongodb-adapter.js
const OidcPayload = require('../models/OidcPayload');

class MongoAdapter {
  constructor(name) {
    this.name = name;
  }

  async upsert(id, payload, expiresIn) {
    const expiresAt = new Date(Date.now() + (expiresIn * 1000));
    await OidcPayload.updateOne(
      { uid: id, kind: this.name },
      { data: payload, expiresAt: expiresAt },
      { upsert: true }
    );
  }

  async find(id) {
    const found = await OidcPayload.findOne({ uid: id, kind: this.name });
    if (!found) return undefined;
    return { ...found.data, expiresAt: found.expiresAt };
  }

  // 👇 INI FUNGSI YANG TADI HILANG DAN BIKIN ERROR
  async findByUid(uid) {
    const found = await OidcPayload.findOne({ uid, kind: this.name });
    if (!found) return undefined;
    return { ...found.data, expiresAt: found.expiresAt };
  }

  async findByUserCode(userCode) {
    const found = await OidcPayload.findOne({ "data.userCode": userCode, kind: this.name });
    if (!found) return undefined;
    return { ...found.data, expiresAt: found.expiresAt };
  }

  async destroy(id) {
    await OidcPayload.deleteOne({ uid: id, kind: this.name });
  }

  async consume(id) {
    await OidcPayload.updateOne({ uid: id, kind: this.name }, { "data.consumed": true });
  }

  async revokeByGrantId(grantId) {
    await OidcPayload.deleteMany({ "data.grantId": grantId });
  }
}

module.exports = MongoAdapter;