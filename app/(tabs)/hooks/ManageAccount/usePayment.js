
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { getAuth } from 'firebase/auth';
import { updatePaymentStatus, updatePendingVerification } from '../utils/paymentUtils';
import { awardPointsForPayment } from '../utils/rewardsUtils';

export const usePayment = () => {
  const auth = getAuth();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [currentBill, setCurrentBill] = useState({ amount: 0, unpaidRecords: [] });
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const fetchCurrentBill = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      
      const q = query(
        collection(db, 'garbageCollections'),
        where('status', '==', 'Unpaid'),
        where('month', '==', currentMonth)
      );
      
      const querySnapshot = await getDocs(q);
      let totalAmount = 0;
      const unpaidRecords = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalAmount += parseFloat(data.totalCost) || 0;
        unpaidRecords.push({ id: doc.id, ...data });
      });

      setCurrentBill({
        amount: totalAmount.toFixed(2),
        unpaidRecords: unpaidRecords
      });
    } catch (error) {
      console.error('Error fetching current bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const processStripePayment = async () => {
    try {
      setProcessingPayment(true);

      // Simulate successful payment (demo)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const numberOfCollections = currentBill.unpaidRecords.length;
      const earnedPoints = await awardPointsForPayment(auth, numberOfCollections);
      setPointsEarned(earnedPoints);
      
      await updatePaymentStatus(currentBill.unpaidRecords, selectedPayment);
      await fetchCurrentBill();
      setPaymentSuccess(true);
      
      Alert.alert(
        'Payment Successful!',
        `Payment processed successfully!\n\n🎉 You earned ${earnedPoints} reward point${earnedPoints > 1 ? 's' : ''}!`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const processBankTransfer = async () => {
    try {
      setProcessingPayment(true);
      
      const numberOfCollections = currentBill.unpaidRecords.length;
      const earnedPoints = await awardPointsForPayment(auth, numberOfCollections);
      setPointsEarned(earnedPoints);

      await updatePendingVerification(currentBill.unpaidRecords, selectedBank);
      await fetchCurrentBill();
      setPaymentSuccess(true);
      
      Alert.alert(
        'Transfer Recorded',
        `Your bank transfer has been recorded. Payment status will be updated once verified by our team (usually within 24-48 hours).\n\n🎉 You earned ${earnedPoints} reward point${earnedPoints > 1 ? 's' : ''}!`
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
      Alert.alert('Error', 'Failed to record transfer. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (selectedPayment === 'card') {
      await processStripePayment();
    } else if (selectedPayment === 'bank') {
      if (!selectedBank) {
        Alert.alert('Error', 'Please select a bank for transfer');
        return;
      }
      
      Alert.alert(
        'Bank Transfer Confirmation',
        `Please transfer $${currentBill.amount} to the selected bank account. After completing the transfer, your payment will be marked as pending verification.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'I Have Transferred', onPress: processBankTransfer }
        ]
      );
    }
  };

  useEffect(() => {
    fetchCurrentBill();
  }, []);

  return {
    paymentSuccess,
    selectedPayment,
    setSelectedPayment,
    selectedBank,
    setSelectedBank,
    currentBill,
    loading,
    processingPayment,
    pointsEarned,
    handleConfirmPayment,
    fetchCurrentBill,
  };
};