import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  categoryId: { type: String, required: true },
  walletId: { type: String, default: 'wallet_cash' },
  date: { type: String, required: true },
  time: { type: String, default: '' },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
