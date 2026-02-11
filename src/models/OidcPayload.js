// src/models/OidcPayload.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OidcPayloadSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  kind: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  expiresAt: { type: Date, required: true }
});

OidcPayloadSchema.index({ uid: 1 });
OidcPayloadSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OidcPayload', OidcPayloadSchema);