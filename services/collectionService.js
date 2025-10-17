import { collection, addDoc, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

export const CollectionService = {
  async saveGarbageCollection(collectionData) {
    return await addDoc(collection(db, 'garbageCollections'), {
      ...collectionData,
      createdAt: new Date().toISOString(),
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    });
  },

  async getUnpaidCollections(month) {
    const q = query(
      collection(db, 'garbageCollections'),
      where('status', '==', 'Unpaid'),
      where('month', '==', month)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async markAsPaid(collectionIds, paymentMethod) {
    const updatePromises = collectionIds.map(async (id) => {
      const docRef = doc(db, 'garbageCollections', id);
      await updateDoc(docRef, {
        status: 'Paid',
        paymentDate: new Date().toISOString(),
        paymentMethod
      });
    });
    await Promise.all(updatePromises);
  }
};