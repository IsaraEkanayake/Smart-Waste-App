// screens/DashboardScreen.js
import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

// Hooks
import { useDashboardData } from '../hooks/useDashboardData';

// Components
import { DashboardHeader } from '../components/DashboardHeader';
import { BillCard } from '../components/BillCard';
import { WasteHistoryCard } from '../components/WasteHistoryCard';
import { RewardCard } from '../components/RewardCard';
import { ScheduleCard } from '../components/ScheduleCard';
import { NotificationModal } from '../components/NotificationModal';
import { ProfileModal } from '../components/ProfileModal';
import { EditProfileModal } from '../components/EditProfileModal';

// Styles
import { styles } from '../styles/dashboardStyles';

export default function DashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Custom hook for data management
  const {
    latestCollection,
    nextSchedule,
    currentBill,
    currentPoints,
    nextReward,
    loading,
    notifications,
    hasUnreadNotifications,
    userData,
    fetchUserData,
    refreshData,
  } = useDashboardData(params);

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  // Form state
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  // Update form data when userData changes
  React.useEffect(() => {
    if (userData) {
      setEditFormData({
        fullName: userData.fullName || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
    }
  }, [userData]);

  // Fetch data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('Dashboard focused - fetching data...');
      fetchUserData();
      refreshData();
    }, [])
  );

  // Navigation handlers
  const handlePayNow = () => {
    router.push('/(tabs)/screens/ManageAccount/PaymentScreen');
  };

  const handleViewHistory = () => {
    router.push('/(tabs)/screens/ManageAccount/GarbageHistoryScreen');
  };

  const handleRedeem = () => {
    router.push('/(tabs)/screens/ManageAccount/RewardsScreen');
  };

  const handleScheduleNew = () => {
    router.push('/(tabs)/screens/ManageAccount/ScheduleScreen');
  };

  const handleNotificationAction = (notification) => {
    setShowNotificationModal(false);
    if (notification.type === 'payment') {
      router.push('/(tabs)/screens/ManageAccount/PaymentScreen');
    } else if (notification.type === 'schedule') {
      router.push('/(tabs)/screens/ManageAccount/ScheduleScreen');
    }
  };

  // Profile handlers
  const handleUpdateProfile = async () => {
    if (!editFormData.fullName || !editFormData.phone || !editFormData.address) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const userId = auth.currentUser?.uid || params.uid;
      if (!userId) return;

      await updateDoc(doc(db, 'users', userId), {
        fullName: editFormData.fullName,
        phone: editFormData.phone,
        address: editFormData.address,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Profile updated successfully');
      setShowEditModal(false);
      fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/(tabs)/screens/ManageAccount/LoginScreen');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    setShowProfileModal(false);
    setShowEditModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <DashboardHeader
          userName={userData?.fullName}
          hasUnreadNotifications={hasUnreadNotifications}
          onProfilePress={() => setShowProfileModal(true)}
          onNotificationPress={() => setShowNotificationModal(true)}
        />

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* First Row */}
          <View style={styles.row}>
            <BillCard
              loading={loading}
              currentBill={currentBill}
              onPayNow={handlePayNow}
            />
            <WasteHistoryCard
              loading={loading}
              latestCollection={latestCollection}
              onViewHistory={handleViewHistory}
            />
          </View>

          {/* Second Row */}
          <View style={styles.row}>
            <RewardCard
              loading={loading}
              nextReward={nextReward}
              currentPoints={currentPoints}
              onRedeem={handleRedeem}
            />
            <ScheduleCard
              loading={loading}
              nextSchedule={nextSchedule}
              onScheduleNew={handleScheduleNew}
            />
          </View>
        </ScrollView>

        {/* Modals */}
        <NotificationModal
          visible={showNotificationModal}
          notifications={notifications}
          onClose={() => setShowNotificationModal(false)}
          onNotificationAction={handleNotificationAction}
          onRefresh={refreshData}
        />

        <ProfileModal
          visible={showProfileModal}
          userData={userData}
          onClose={() => setShowProfileModal(false)}
          onEditProfile={handleEditProfile}
          onSignOut={handleSignOut}
        />

        <EditProfileModal
          visible={showEditModal}
          formData={editFormData}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateProfile}
          onFormChange={setEditFormData}
        />
      </View>
    </SafeAreaView>
  );
}