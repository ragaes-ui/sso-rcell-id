import mongoose from 'mongoose';
const { Schema } = mongoose;

const OidcPayloadSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  kind: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  expiresAt: { type: Date, required: true }
});

// Penambahan index untuk performa dan auto-delete data expired
OidcPayloadSchema.index({ uid: 1 });
OidcPayloadSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OidcPayload = mongoose.model('OidcPayload', OidcPayloadSchema);

export default OidcPayload;
