import mongoose from 'mongoose';

const userDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  categories: { type: Array, default: [] },
  budgets: { type: Object, default: {} },
  goals: { type: Array, default: [] },
  wallets: { type: Array, default: [] },
  debts: { type: Array, default: [] },
  recurring: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.UserData || mongoose.model('UserData', userDataSchema);
