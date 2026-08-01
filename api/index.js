import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Transaction from './models/Transaction.js';
import UserData from './models/UserData.js';

const app = express();

app.use(cors());
app.use(express.json());

// Connection caching for Serverless environment
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  const mongoURI = process.env.MONGODB_URI || "mongodb+srv://ratul:Ratul12345@cluster0.mongodb.net/amar_takar_hisab?retryWrites=true&w=majority";
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log("MongoDB Atlas Connected Successfully!");
  } catch (err) {
    console.warn("MongoDB Atlas connection warning:", err.message);
  }
};

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  await connectDB();
  res.json({
    status: 'online',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// GET User Data (Transactions + Settings)
app.get('/api/userData', async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 }).lean();
    let userData = await UserData.findOne({ userId }).lean();

    if (!userData) {
      userData = {
        userId,
        categories: [],
        budgets: {},
        goals: [],
        wallets: [],
        debts: [],
        recurring: []
      };
    }

    res.json({
      transactions: transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        categoryId: t.categoryId,
        walletId: t.walletId,
        date: t.date,
        time: t.time,
        note: t.note
      })),
      categories: userData.categories || [],
      budgets: userData.budgets || {},
      goals: userData.goals || [],
      wallets: userData.wallets || [],
      debts: userData.debts || [],
      recurring: userData.recurring || []
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST Create Single or Bulk Transactions
app.post('/api/transactions', async (req, res) => {
  try {
    await connectDB();
    const { userId, transaction, transactions } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (transactions && Array.isArray(transactions)) {
      if (transactions.length === 0) {
        return res.json({ success: true, count: 0 });
      }
      const ops = transactions.map(tx => ({
        updateOne: {
          filter: { id: tx.id, userId },
          update: {
            $set: {
              id: tx.id,
              userId,
              amount: Number(tx.amount),
              type: tx.type,
              categoryId: tx.categoryId,
              walletId: tx.walletId || 'wallet_cash',
              date: tx.date,
              time: tx.time || '',
              note: tx.note || ''
            }
          },
          upsert: true
        }
      }));
      await Transaction.bulkWrite(ops);
      return res.json({ success: true, count: transactions.length });
    }

    if (transaction && transaction.id) {
      const newTx = await Transaction.findOneAndUpdate(
        { id: transaction.id, userId },
        {
          id: transaction.id,
          userId,
          amount: Number(transaction.amount),
          type: transaction.type,
          categoryId: transaction.categoryId,
          walletId: transaction.walletId || 'wallet_cash',
          date: transaction.date,
          time: transaction.time || '',
          note: transaction.note || ''
        },
        { upsert: true, new: true }
      );
      return res.json({ success: true, transaction: newTx });
    }

    res.status(400).json({ error: 'Valid transaction or transactions array required' });
  } catch (err) {
    console.error('Error saving transaction:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT Update Transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { userId, transaction } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      { id, userId },
      { ...transaction },
      { new: true }
    );

    res.json({ success: true, transaction: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { userId } = req.query;

    await Transaction.deleteOne({ id, userId });
    res.json({ success: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Save User Settings (Wallets, Budgets, Goals, Debts, Recurring, Categories)
app.post('/api/userData', async (req, res) => {
  try {
    await connectDB();
    const { userId, categories, budgets, goals, wallets, debts, recurring } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const updated = await UserData.findOneAndUpdate(
      { userId },
      {
        userId,
        categories: categories || [],
        budgets: budgets || {},
        goals: goals || [],
        wallets: wallets || [],
        debts: debts || [],
        recurring: recurring || [],
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, userData: updated });
  } catch (err) {
    console.error('Error saving user data settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Export Express App for Vercel Serverless Functions
export default app;
