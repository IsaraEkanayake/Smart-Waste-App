import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { User } from '../models/User';

export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          setUser(User.fromFirestore(userSnapshot));
        } else {
          setError(new Error('User not found'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUser = async (userData) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, userData.toFirestore());
      
      // Update local state
      setUser(userData);
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    updateUser,
    refetch: () => {
      setLoading(true);
      // Re-fetch logic would go here
    }
  };
};