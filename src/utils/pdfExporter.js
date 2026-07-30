import { formatCurrency } from './formatters';

export function exportTransactionsPDF({
  transactions = [],
  categories = [],
  title = 'আমার টাকার হিসাব — ফাইনান্সিয়াল স্টেটমেন্ট',
  dateRangeStr = 'সব সময়',
  currency = '৳',
  userName = 'সম্মানিত ব্যবহারকারী'
}) {
  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.id] = c.name; });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const rowsHtml = transactions.map((t, idx) => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 8px 12px; text-align: center; color: #64748B;">${idx + 1}</td>
      <td style="padding: 8px 12px; white-space: nowrap;">${t.date || ''} ${t.time ? `(${t.time})` : ''}</td>
      <td style="padding: 8px 12px; font-weight: 600;">${t.note || 'বিবরণ নেই'}</td>
      <td style="padding: 8px 12px;">${categoryMap[t.categoryId] || 'অন্যান্য'}</td>
      <td style="padding: 8px 12px; text-align: center;">
        <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; background: ${t.type === 'income' ? '#DEF7EC' : '#FDE8E8'}; color: ${t.type === 'income' ? '#03543F' : '#9B1C1C'};">
          ${t.type === 'income' ? 'আয়' : 'খরচ'}
        </span>
      </td>
      <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: ${t.type === 'income' ? '#059669' : '#DC2626'};">
        ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount, currency)}
      </td>
    </tr>
  `).join('');

  const printContent = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
        body {
          font-family: 'Hind Siliguri', 'Segoe UI', Tahoma, sans-serif;
          color: #1E293B;
          margin: 0;
          padding: 24px;
          background: #FFFFFF;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #F74B00;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #F74B00;
        }
        .summary-box {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        .summary-card {
          flex: 1;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 12px 16px;
          text-align: center;
        }
        .summary-title {
          font-size: 12px;
          color: #64748B;
          margin-bottom: 4px;
        }
        .summary-val {
          font-size: 18px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th {
          background: #F1F5F9;
          color: #334155;
          text-align: left;
          padding: 10px 12px;
          font-weight: 700;
        }
        .footer {
          margin-top: 32px;
          text-align: center;
          font-size: 11px;
          color: #94A3B8;
          border-top: 1px solid #E2E8F0;
          padding-top: 12px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">আমার টাকার হিসাব</div>
          <div style="font-size: 12px; color: #64748B; margin-top: 4px;">প্রোফাইল: ${userName}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 14px; font-weight: bold; color: #0F172A;">${title}</div>
          <div style="font-size: 12px; color: #64748B;">সময়কাল: ${dateRangeStr}</div>
          <div style="font-size: 11px; color: #94A3B8;">তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}</div>
        </div>
      </div>

      <div class="summary-box">
        <div class="summary-card">
          <div class="summary-title">মোট জমা/আয়</div>
          <div class="summary-val" style="color: #059669;">+${formatCurrency(totalIncome, currency)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">মোট খরচ</div>
          <div class="summary-val" style="color: #DC2626;">-${formatCurrency(totalExpense, currency)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">নিট ব্যালেন্স</div>
          <div class="summary-val" style="color: #F74B00;">${formatCurrency(netBalance, currency)}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th style="width: 130px;">তারিখ ও সময়</th>
            <th>বিবরণ / নোট</th>
            <th style="width: 140px;">ক্যাটাগরি</th>
            <th style="width: 70px; text-align: center;">টাইপ</th>
            <th style="width: 110px; text-align: right;">পরিমাণ</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="6" style="text-align:center; padding: 20px; color: #94A3B8;">কোনো রেকর্ড পাওয়া যায়নি</td></tr>'}
        </tbody>
      </table>

      <div class="footer">
        স্বয়ংক্রিয়ভাবে তৈরি করা হয়েছে <strong>আমার টাকার হিসাব</strong> (amar-takar-hisab.vercel.app) থেকে।
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  } else {
    alert('পপ-আপ উইন্ডো ব্লকেড হয়ে আছে, অনুগ্রহ করে ব্রাউজারের পপ-আপ এলাউ করুন।');
  }
}
