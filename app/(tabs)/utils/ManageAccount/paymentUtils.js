import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export const updatePaymentStatus = async (unpaidRecords, paymentMethod) => {
  try {
    const updatePromises = unpaidRecords.map(async (record) => {
      const docRef = doc(db, 'garbageCollections', record.id);
      await updateDoc(docRef, {
        status: 'Paid',
        paymentDate: new Date().toISOString(),
        paymentMethod: paymentMethod
      });
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

export const updatePendingVerification = async (unpaidRecords, selectedBank) => {
  try {
    const updatePromises = unpaidRecords.map(async (record) => {
      const docRef = doc(db, 'garbageCollections', record.id);
      await updateDoc(docRef, {
        status: 'Pending Verification',
        paymentInitiatedDate: new Date().toISOString(),
        paymentMethod: 'bank',
        selectedBank: selectedBank
      });
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
