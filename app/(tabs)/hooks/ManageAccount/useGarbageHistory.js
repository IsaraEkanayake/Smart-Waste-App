import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { calculateGarbageStats } from '../utils/statsCalculator';

export const useGarbageHistory = () => {
  const [garbageRecords, setGarbageRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('All');
  const [stats, setStats] = useState({
    totalCollections: 0,
    totalWeight: 0,
    totalCost: 0,
    thisMonth: { collections: 0, weight: 0, cost: 0 }
  });

  useEffect(() => {
    fetchGarbageRecords();
  }, []);

  useEffect(() => {
    const calculatedStats = calculateGarbageStats(garbageRecords);
    setStats(calculatedStats);
  }, [garbageRecords]);

  const fetchGarbageRecords = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'garbageCollections'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });
      setGarbageRecords(records);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRecords = () => {
    if (filterMonth === 'All') return garbageRecords;
    return garbageRecords.filter(record => record.month === filterMonth);
  };

  const uniqueMonths = [...new Set(garbageRecords.map(record => record.month))];
  const filteredRecords = getFilteredRecords();

  return {
    garbageRecords,
    loading,
    filterMonth,
    setFilterMonth,
    stats,
    uniqueMonths,
    filteredRecords,
    refetch: fetchGarbageRecords
  };
};