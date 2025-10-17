import { useState, useEffect } from 'react';
import { CollectionService } from '../services/collectionService';

export const useCollections = (month) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCollections();
  }, [month]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await CollectionService.getUnpaidCollections(month);
      setCollections(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => loadCollections();

  return { collections, loading, error, refresh };
};