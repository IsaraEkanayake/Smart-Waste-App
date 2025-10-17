import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { getAuth } from 'firebase/auth';

export const useSchedule = () => {
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    unit: 'kg',
    preferredDate: '',
    preferredTime: '',
    specialInstructions: '',
    address: '',
  });

  const wasteTypes = ['Organic', 'Recyclable', 'Electronic', 'Furniture', 'Mixed', 'Other'];
  const units = ['kg', 'bag', 'bucket', 'box'];

  const handleConfirmPickup = async () => {
    if (!formData.wasteType || !formData.quantity || !formData.preferredDate || !formData.preferredTime || !formData.address) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const scheduleData = {
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || 'unknown',
        wasteType: formData.wasteType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        specialInstructions: formData.specialInstructions || 'None',
        address: formData.address,
        status: 'Scheduled',
        createdAt: new Date().toISOString(),
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      };

      await addDoc(collection(db, 'schedules'), scheduleData);

      Alert.alert('Success', 'Pickup Scheduled Successfully!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            router.back();
          }
        }
      ]);
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      Alert.alert('Error', 'Failed to schedule pickup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const resetForm = () => {
    setFormData({
      wasteType: '',
      quantity: '',
      unit: 'kg',
      preferredDate: '',
      preferredTime: '',
      specialInstructions: '',
      address: '',
    });
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    loading,
    formData,
    wasteTypes,
    units,
    handleConfirmPickup,
    handleBackPress,
    updateFormData,
    resetForm
  };
};