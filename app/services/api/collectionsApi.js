import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Collection } from '../../models/Collection';

export const collectionsApi = {
  // Get collections by user
  async getCollectionsByUser(userId, options = {}) {
    try {
      const collectionsRef = collection(db, 'collections');
      let q = query(collectionsRef, where('userId', '==', userId));

      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
      }

      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }

      const querySnapshot = await getDocs(q);
      const collections = [];
      
      querySnapshot.forEach((doc) => {
        collections.push(Collection.fromFirestore(doc));
      });

      return collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },

  // Create new collection
  async createCollection(collectionData) {
    try {
      const collectionsRef = collection(db, 'collections');
      const docRef = await addDoc(collectionsRef, collectionData.toFirestore());
      return docRef.id;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  // Update collection status
  async updateCollectionStatus(collectionId, status) {
    try {
      const collectionDoc = doc(db, 'collections', collectionId);
      await updateDoc(collectionDoc, { 
        status,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating collection status:', error);
      throw error;
    }
  },

  // Get unpaid collections
  async getUnpaidCollections(userId) {
    return this.getCollectionsByUser(userId, { status: 'Unpaid' });
  }
};