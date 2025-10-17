export const calculateGarbageStats = (garbageRecords) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  let totalWeight = 0;
  let totalCost = 0;
  let thisMonthCollections = 0;
  let thisMonthWeight = 0;
  let thisMonthCost = 0;

  garbageRecords.forEach(record => {
    const weight = parseFloat(record.totalWeight) || 0;
    const cost = parseFloat(record.totalCost) || 0;

    totalWeight += weight;
    totalCost += cost;

    if (record.month === currentMonth) {
      thisMonthCollections++;
      thisMonthWeight += weight;
      thisMonthCost += cost;
    }
  });

  return {
    totalCollections: garbageRecords.length,
    totalWeight: totalWeight.toFixed(2),
    totalCost: totalCost.toFixed(2),
    thisMonth: {
      collections: thisMonthCollections,
      weight: thisMonthWeight.toFixed(2),
      cost: thisMonthCost.toFixed(2)
    }
  };
};