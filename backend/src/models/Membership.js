import mongoose from 'mongoose';
import { ROLE_VALUES, ROLES } from '../utils/constants.js';

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.MEMBER,
      required: true,
    },
  },
  { timestamps: true }
);

// --- CRITICAL: one user can be member of an org ONLY ONCE ---
membershipSchema.index({ userId: 1, orgId: 1 }, { unique: true });

// --- Query helpers: fast lookups by org ---
membershipSchema.index({ orgId: 1 });

membershipSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;