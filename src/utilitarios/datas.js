const formatDateForQuery = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayDateString = () => formatDateForQuery(new Date());

export const getMonthRange = (year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = formatDateForQuery(new Date(year, month, 0));
  return { startDate, endDate };
};

export const getCurrentMonthInfo = (referenceDate = new Date()) => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;
  const monthLabel = referenceDate.toLocaleString('pt-PT', {
    month: 'long',
    year: 'numeric',
  });
  const lastDayOfMonth = new Date(year, month, 0);

  return {
    month,
    year,
    monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
    startDate: `${year}-${String(month).padStart(2, '0')}-01`,
    endDate: formatDateForQuery(lastDayOfMonth),
  };
};

export default getCurrentMonthInfo;
