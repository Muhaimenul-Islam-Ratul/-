// Bengali Digit conversion dictionary
const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toBnDigits(num, lang = 'bn') {
  if (num === null || num === undefined) return '';
  const str = num.toString();
  if (lang === 'en') return str;
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
export function formatCurrency(amount, currencySymbol = '৳', langOrUseBengali = 'bn') {
  const numericAmount = Math.abs(Number(amount) || 0);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(numericAmount);

  const useBengaliDigits = (langOrUseBengali === 'bn' || langOrUseBengali === true);
  const displayDigits = useBengaliDigits ? toBnDigits(formatted, 'bn') : formatted;
  const sign = amount < 0 ? '-' : '';

  if (currencySymbol === '৳') {
    return `${sign}৳${displayDigits}`;
  }
  return `${sign}${currencySymbol}${displayDigits}`;
}

// Month Names
export const bnMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export const enMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Days
export const bnDays = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

export const enDays = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Format YYYY-MM-DD string to formatted date
export function formatBnDate(dateString, lang = 'bn') {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  if (lang === 'en') {
    const day = date.getDate();
    const month = enMonths[date.getMonth()];
    const year = date.getFullYear();
    const dayName = enDays[date.getDay()];
    return `${month} ${day}, ${year} (${dayName})`;
  }

  const day = toBnDigits(date.getDate(), 'bn');
  const month = bnMonths[date.getMonth()];
  const year = toBnDigits(date.getFullYear(), 'bn');
  const dayName = bnDays[date.getDay()];

  return `${day} ${month} ${year}, ${dayName}`;
}

// Format Date for Short Display e.g. ২৩ জুলাই / 23 Jul
export function formatBnDateShort(dateString, lang = 'bn') {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  if (lang === 'en') {
    const day = date.getDate();
    const month = enMonths[date.getMonth()];
    return `${day} ${month}`;
  }

  const day = toBnDigits(date.getDate(), 'bn');
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

// Format 24h time to 12h time string
export function formatBnTime(timeStr, lang = 'bn') {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${toBnDigits(hours, lang)}:${toBnDigits(minutes, lang)} ${ampm}`;
}
