import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import { User } from '../../models/User';

export const usersApi = {
  // Get user by ID
  async getUser(userId) {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        return User.fromFirestore(userSnapshot);
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, userData.toFirestore());
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Get users by type
  async getUsersByType(userType) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('userType', '==', userType));
      const querySnapshot = await getDocs(q);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(User.fromFirestore(doc));
      });
      
      return users;
    } catch (error) {
      console.error('Error fetching users by type:', error);
      throw error;
    }
  }
};