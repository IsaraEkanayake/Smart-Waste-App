import { useState, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { collection, addDoc, getDocs, query, orderBy, where, limit, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

export const useBusinessDashboard = () => {
  const [showGarbageModal, setShowGarbageModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [garbageRecords, setGarbageRecords] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [rewardTasks, setRewardTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    residentName: '',
    residentAddress: '',
    residentPhone: '',
    collectionDate: '',
    organicWaste: '',
    recyclableWaste: '',
    otherWaste: '',
    totalWeight: '',
    pricePerKg: '1',
    totalCost: '0',
    status: 'Unpaid',
  });

  const [rewardFormData, setRewardFormData] = useState({
    name: '',
    description: '',
    pointsRequired: '',
    rewardType: 'discount',
    rewardValue: '',
    icon: 'percent',
    bgColor: '#FEF3C7',
    iconColor: '#F59E0B',
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchAllData();
    }, [])
  );

  useEffect(() => {
    const organic = parseFloat(formData.organicWaste) || 0;
    const recyclable = parseFloat(formData.recyclableWaste) || 0;
    const other = parseFloat(formData.otherWaste) || 0;
    const pricePerKg = parseFloat(formData.pricePerKg) || 1;
    
    const total = organic + recyclable + other;
    const cost = total * pricePerKg;
    
    setFormData(prev => ({
      ...prev,
      totalWeight: total.toFixed(2),
      totalCost: cost.toFixed(2)
    }));
  }, [formData.organicWaste, formData.recyclableWaste, formData.otherWaste, formData.pricePerKg]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchGarbageRecords(),
        fetchSchedules(),
        fetchRewardTasks()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGarbageRecords = async () => {
    try {
      const q = query(collection(db, 'garbageCollections'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });
      setGarbageRecords(records);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const q = query(collection(db, 'schedules'), limit(50));
      const querySnapshot = await getDocs(q);
      const scheduleList = [];
      
      querySnapshot.forEach((doc) => {
        const scheduleData = { id: doc.id, ...doc.data() };
        if (scheduleData.status === 'Scheduled') {
          scheduleList.push(scheduleData);
        }
      });
      
      scheduleList.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      setSchedules(scheduleList.slice(0, 20));
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchRewardTasks = async () => {
    try {
      const q = query(collection(db, 'rewardTasks'), orderBy('pointsRequired', 'asc'));
      const querySnapshot = await getDocs(q);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      setRewardTasks(tasks);
    } catch (error) {
      console.error('Error fetching reward tasks:', error);
    }
  };

  const handleSaveGarbageRecord = async () => {
    if (!formData.residentName || !formData.residentAddress || !formData.residentPhone || 
        !formData.collectionDate || !formData.totalWeight || parseFloat(formData.totalWeight) === 0) {
      Alert.alert('Validation Error', 'Please fill in all required fields and add waste weight');
      return;
    }

    try {
      await addDoc(collection(db, 'garbageCollections'), {
        ...formData,
        createdAt: new Date().toISOString(),
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      });

      Alert.alert('Success', 'Garbage collection record saved successfully');
      setShowGarbageModal(false);
      resetForm();
      fetchGarbageRecords();
    } catch (error) {
      console.error('Error saving record:', error);
      Alert.alert('Error', 'Failed to save garbage record');
    }
  };

  const handleSaveReward = async () => {
    if (!rewardFormData.name || !rewardFormData.description || !rewardFormData.pointsRequired || !rewardFormData.rewardValue) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const rewardData = {
        ...rewardFormData,
        pointsRequired: parseInt(rewardFormData.pointsRequired),
        rewardValue: parseFloat(rewardFormData.rewardValue),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingReward) {
        await updateDoc(doc(db, 'rewardTasks', editingReward.id), rewardData);
        Alert.alert('Success', 'Reward task updated successfully');
      } else {
        await addDoc(collection(db, 'rewardTasks'), rewardData);
        Alert.alert('Success', 'Reward task created successfully');
      }

      setShowRewardModal(false);
      setEditingReward(null);
      resetRewardForm();
      fetchRewardTasks();
    } catch (error) {
      console.error('Error saving reward:', error);
      Alert.alert('Error', 'Failed to save reward task');
    }
  };

  const handleEditReward = (reward) => {
    setEditingReward(reward);
    setRewardFormData({
      name: reward.name,
      description: reward.description,
      pointsRequired: reward.pointsRequired.toString(),
      rewardType: reward.rewardType,
      rewardValue: reward.rewardValue.toString(),
      icon: reward.icon,
      bgColor: reward.bgColor,
      iconColor: reward.iconColor,
    });
    setShowRewardModal(true);
  };

  const handleDeleteReward = async (rewardId) => {
    Alert.alert(
      'Delete Reward',
      'Are you sure you want to delete this reward task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'rewardTasks', rewardId));
              Alert.alert('Success', 'Reward task deleted successfully');
              fetchRewardTasks();
            } catch (error) {
              console.error('Error deleting reward:', error);
              Alert.alert('Error', 'Failed to delete reward task');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      residentName: '',
      residentAddress: '',
      residentPhone: '',
      collectionDate: '',
      organicWaste: '',
      recyclableWaste: '',
      otherWaste: '',
      totalWeight: '',
      pricePerKg: '1',
      totalCost: '0',
      status: 'Unpaid',
    });
  };

  const resetRewardForm = () => {
    setRewardFormData({
      name: '',
      description: '',
      pointsRequired: '',
      rewardType: 'discount',
      rewardValue: '',
      icon: 'percent',
      bgColor: '#FEF3C7',
      iconColor: '#F59E0B',
    });
  };

  return {
    showGarbageModal,
    setShowGarbageModal,
    showRewardModal,
    setShowRewardModal,
    editingReward,
    setEditingReward,
    garbageRecords,
    schedules,
    rewardTasks,
    loading,
    formData,
    setFormData,
    rewardFormData,
    setRewardFormData,
    handleSaveGarbageRecord,
    handleSaveReward,
    handleEditReward,
    handleDeleteReward,
    resetForm,
    resetRewardForm,
    fetchAllData
  };
};