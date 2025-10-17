import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Bin } from '../../models/Bin';

export const binsApi = {
  // Get all bins
  async getBins(filters = {}) {
    try {
      const binsRef = collection(db, 'bins');
      let q = query(binsRef);

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.orderBy) {
        q = query(q, orderBy(filters.orderBy, filters.orderDirection || 'asc'));
      }

      const querySnapshot = await getDocs(q);
      const bins = [];
      
      querySnapshot.forEach((doc) => {
        bins.push(Bin.fromFirestore(doc));
      });

      return bins;
    } catch (error) {
      console.error('Error fetching bins:', error);
      throw error;
    }
  },

  // Get bins needing collection
  async getBinsNeedingCollection() {
    return this.getBins({ status: 'FULL' });
  },

  // Update bin status
  async updateBinStatus(binId, status, fillLevel) {
    try {
      const binDoc = doc(db, 'bins', binId);
      await updateDoc(binDoc, { 
        status,
        fillLevel,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating bin status:', error);
      throw error;
    }
  },

  // Assign collector to bin
  async assignCollectorToBin(binId, collectorId) {
    try {
      const binDoc = doc(db, 'bins', binId);
      await updateDoc(binDoc, { 
        assignedCollector: collectorId,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error assigning collector to bin:', error);
      throw error;
    }
  }
};