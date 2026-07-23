// Bengali Digit conversion dictionary
const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toBnDigits(num) {
  if (num === null || num === undefined) return '';
  const str = num.toString();
  return str.replace(/\d/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

export function toEnDigits(str) {
  if (!str) return '';
  let result = str.toString();
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(bnDigits[i], enDigits[i]);
  }
  return result;
}

// Format Currency e.g. ৳১,২৫০ or $1,250
export function formatCurrency(amount, currencySymbol = '৳', useBengaliDigits = true) {
  const numericAmount = Math.abs(Number(amount) || 0);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(numericAmount);

  const displayDigits = useBengaliDigits ? toBnDigits(formatted) : formatted;
  const sign = amount < 0 ? '-' : '';

  if (currencySymbol === '৳') {
    return `${sign}৳${displayDigits}`;
  }
  return `${sign}${currencySymbol}${displayDigits}`;
}

// Bengali Month Names
export const bnMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

// Bengali Days
export const bnDays = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

// Format YYYY-MM-DD string to Bengali formatted date (e.g. ২৩ জুলাই ২০২৬, বৃহস্পতিবার)
export function formatBnDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = toBnDigits(date.getDate());
  const month = bnMonths[date.getMonth()];
  const year = toBnDigits(date.getFullYear());
  const dayName = bnDays[date.getDay()];

  return `${day} ${month} ${year}, ${dayName}`;
}

// Format Date for Short Display e.g. ২৩ জুলাই
export function formatBnDateShort(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = toBnDigits(date.getDate());
  const month = bnMonths[date.getMonth()];
  return `${day} ${month}`;
}

// Get current date string YYYY-MM-DD
export function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format 24h time to 12h Bengali time string e.g. "১০:৩০ AM"
export function formatBnTime(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  return `${toBnDigits(hours)}:${toBnDigits(minutes)} ${ampm}`;
}
