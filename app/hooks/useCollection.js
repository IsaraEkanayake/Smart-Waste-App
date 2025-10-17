import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Collection } from '../models/Collection';

export const useCollections = (userId, filters = {}) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchCollections = async () => {
      try {
        setLoading(true);
        const collectionsRef = collection(db, 'collections');
        let q = query(collectionsRef, where('userId', '==', userId));

        if (filters.orderBy) {
          q = query(q, orderBy(filters.orderBy, filters.orderDirection || 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const collectionsData = [];
        
        querySnapshot.forEach((doc) => {
          collectionsData.push(Collection.fromFirestore(doc));
        });

        setCollections(collectionsData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [userId, filters]);

  const getUnpaidCollections = () => {
    return collections.filter(collection => !collection.isPaid());
  };

  const getTotalUnpaidAmount = () => {
    return getUnpaidCollections().reduce((total, collection) => {
      return total + collection.getTotalCost();
    }, 0);
  };

  return {
    collections,
    loading,
    error,
    unpaidCollections: getUnpaidCollections(),
    totalUnpaidAmount: getTotalUnpaidAmount(),
    refetch: () => {
      setLoading(true);
      // Re-fetch logic would go here
    }
  };
};