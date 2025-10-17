<<<<<<< HEAD
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { Trash2, Award, Calendar, Bell, Package, X, Clock, MapPin, Edit2, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useBusinessDashboard } from '../../hooks/useBusinessDashboard';
import { formatDate, getStatusBadgeStyle, rewardIcons } from '../../utils/businessDashboardUtils';
import RewardTaskCard from '../../components/BusinessDashboard/RewardTaskCard';
import ScheduleCard from '../../components/BusinessDashboard/ScheduleCard';
import StatsCard from '../../components/BusinessDashboard/StatsCard';
import styles from '../../styles/BusinessDashboardStyles';
=======
import { useFocusEffect, useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc } from 'firebase/firestore';
import { Award, BarChart3, Bell, Calendar, Clock, Edit2, MapPin, Package, Plus, Trash2, TrendingUp, Users, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../../../firebase';
>>>>>>> b8a80e7c7e8a3db308541310e9bf0ff5f74557ed

export default function BusinessDashboardScreen() {
  const router = useRouter();
  const {
    showGarbageModal,
    setShowGarbageModal,
    showRewardModal,
    setShowRewardModal,
    editingReward,
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
    resetRewardForm
  } = useBusinessDashboard();

  const totalRevenue = garbageRecords.reduce((sum, record) => sum + parseFloat(record.totalCost || 0), 0);

  const handleViewReports = () => {
    router.push('/(tabs)/screens/ManageAccount/ReportsDashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Business Dashboard</Text>
            <View style={styles.notificationContainer}>
              <Bell size={24} color="white" />
              <View style={styles.notificationDot} />
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {/* Monthly Garbage Collection Card */}
          <View style={styles.calculatorCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, styles.greenBg]}>
                <Package size={28} color="#10B981" strokeWidth={2.5} />
              </View>
              <Text style={styles.sectionTitle}>Monthly Garbage Collection</Text>
            </View>
            
            <Text style={styles.description}>Record garbage collected from residents this month</Text>
            
            <TouchableOpacity style={styles.calculateButton} onPress={() => setShowGarbageModal(true)}>
              <Text style={styles.calculateButtonText}>+ Add Collection Record</Text>
            </TouchableOpacity>

            {garbageRecords.length > 0 && (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Total Collections: {garbageRecords.length}</Text>
                <Text style={styles.summaryText}>Total Revenue: ${totalRevenue.toFixed(2)}</Text>
              </View>
            )}
          </View>

          {/* Stats Overview */}
          <StatsCard totalRevenue={totalRevenue} activeSchedules={schedules.length} />

          {/* Reward Tasks Management Section */}
          <View style={styles.rewardsManagementCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, styles.yellowBg]}>
                <Award size={28} color="#F59E0B" strokeWidth={2.5} />
              </View>
              <Text style={styles.sectionTitle}>Reward Tasks Management</Text>
            </View>
            
            <Text style={styles.description}>Create and manage reward tasks for users to unlock</Text>
            
            <TouchableOpacity 
              style={styles.addRewardButton} 
              onPress={() => {
                resetRewardForm();
                setShowRewardModal(true);
              }}
            >
              <Plus size={20} color="white" />
              <Text style={styles.addRewardButtonText}>Create New Reward Task</Text>
            </TouchableOpacity>

            {/* Existing Reward Tasks */}
            {loading ? (
              <ActivityIndicator size="large" color="#F59E0B" style={styles.loader} />
            ) : rewardTasks.length > 0 ? (
              <View style={styles.rewardTasksList}>
                <Text style={styles.rewardTasksTitle}>Active Reward Tasks ({rewardTasks.length})</Text>
                {rewardTasks.map((reward) => (
                  <RewardTaskCard
                    key={reward.id}
                    reward={reward}
                    onEdit={handleEditReward}
                    onDelete={handleDeleteReward}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyRewardsState}>
                <Award size={32} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No reward tasks created yet</Text>
              </View>
            )}
          </View>

          {/* Scheduled Waste Pickups Section */}
          <View style={styles.pickupsSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconCircle, styles.greenBg]}>
                <Calendar size={28} color="#10B981" strokeWidth={2.5} />
              </View>
              <Text style={styles.sectionTitle}>Scheduled Waste Pickups</Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#5DADE2" style={styles.loader} />
            ) : schedules.length > 0 ? (
              schedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  formatDate={formatDate}
                  getStatusBadgeStyle={(status) => getStatusBadgeStyle(status, styles)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Trash2 size={32} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No scheduled pickups yet</Text>
              </View>
            )}
          </View>

          {/* Reports & Analytics Section */}
          <View style={styles.reportsSection}>
            <TouchableOpacity style={styles.reportsButton} onPress={handleViewReports}>
              <View style={styles.reportsButtonContent}>
                <View style={styles.reportsIconContainer}>
                  <BarChart3 size={28} color="#5DADE2" strokeWidth={2.5} />
                </View>
                <View style={styles.reportsTextContainer}>
                  <Text style={styles.reportsButtonTitle}>Reports & Analytics</Text>
                  <Text style={styles.reportsButtonSubtitle}>View system insights and performance metrics</Text>
                </View>
                <View style={styles.reportsArrow}>
                  <Text style={styles.reportsArrowText}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Garbage Collection Modal */}
        <Modal visible={showGarbageModal} transparent={true} animationType="slide" onRequestClose={() => setShowGarbageModal(false)}>
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Garbage Collection</Text>
                  <TouchableOpacity onPress={() => setShowGarbageModal(false)}>
                    <X size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionLabel}>Resident Information</Text>
                
                <Text style={styles.modalLabel}>Full Name *</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., John Silva" value={formData.residentName} onChangeText={(text) => setFormData({...formData, residentName: text})} />

                <Text style={styles.modalLabel}>Address *</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., 123 Main St, Colombo 03" value={formData.residentAddress} onChangeText={(text) => setFormData({...formData, residentAddress: text})} />

                <Text style={styles.modalLabel}>Phone Number *</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., 0771234567" keyboardType="phone-pad" value={formData.residentPhone} onChangeText={(text) => setFormData({...formData, residentPhone: text})} />

                <Text style={styles.modalLabel}>Collection Date *</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., 2024-10-15" value={formData.collectionDate} onChangeText={(text) => setFormData({...formData, collectionDate: text})} />

                <Text style={styles.sectionLabel}>Waste Details (kg)</Text>
                
                <Text style={styles.modalLabel}>Organic Waste</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., 15" keyboardType="numeric" value={formData.organicWaste} onChangeText={(text) => setFormData({...formData, organicWaste: text})} />

                <Text style={styles.modalLabel}>Recyclable Waste</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., 8" keyboardType="numeric" value={formData.recyclableWaste} onChangeText={(text) => setFormData({...formData, recyclableWaste: text})} />

                <Text style={styles.modalLabel}>Other Waste</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., 5" keyboardType="numeric" value={formData.otherWaste} onChangeText={(text) => setFormData({...formData, otherWaste: text})} />

                <Text style={styles.sectionLabel}>Pricing</Text>
                
                <Text style={styles.modalLabel}>Price per kg ($)</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., 1" keyboardType="numeric" value={formData.pricePerKg} onChangeText={(text) => setFormData({...formData, pricePerKg: text})} />

                <View style={styles.summaryBox}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Weight:</Text>
                    <Text style={styles.summaryValue}>{formData.totalWeight} kg</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Cost:</Text>
                    <Text style={styles.summaryValueLarge}>${formData.totalCost}</Text>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setShowGarbageModal(false); resetForm(); }}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveGarbageRecord}>
                    <Text style={styles.modalSaveText}>Save Record</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Reward Task Modal */}
        <Modal visible={showRewardModal} transparent={true} animationType="slide" onRequestClose={() => setShowRewardModal(false)}>
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{editingReward ? 'Edit' : 'Create'} Reward Task</Text>
                  <TouchableOpacity onPress={() => { setShowRewardModal(false); }}>
                    <X size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalLabel}>Reward Name *</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., 10% Bill Discount" value={rewardFormData.name} onChangeText={(text) => setRewardFormData({...rewardFormData, name: text})} />

                <Text style={styles.modalLabel}>Description *</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., Get 10% off your next bill" value={rewardFormData.description} onChangeText={(text) => setRewardFormData({...rewardFormData, description: text})} />

                <Text style={styles.modalLabel}>Points Required *</Text>
                <TextInput style={styles.modalInput} placeholder="e.g., 10" keyboardType="numeric" value={rewardFormData.pointsRequired} onChangeText={(text) => setRewardFormData({...rewardFormData, pointsRequired: text})} />

                <Text style={styles.modalLabel}>Reward Type *</Text>
                <View style={styles.rewardTypeButtons}>
                  <TouchableOpacity style={[styles.rewardTypeButton, rewardFormData.rewardType === 'discount' && styles.rewardTypeButtonSelected]} onPress={() => setRewardFormData({...rewardFormData, rewardType: 'discount'})}>
                    <Text style={[styles.rewardTypeButtonText, rewardFormData.rewardType === 'discount' && styles.rewardTypeButtonTextSelected]}>Discount %</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.rewardTypeButton, rewardFormData.rewardType === 'bonus_points' && styles.rewardTypeButtonSelected]} onPress={() => setRewardFormData({...rewardFormData, rewardType: 'bonus_points'})}>
                    <Text style={[styles.rewardTypeButtonText, rewardFormData.rewardType === 'bonus_points' && styles.rewardTypeButtonTextSelected]}>Bonus Points</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.rewardTypeButton, rewardFormData.rewardType === 'service' && styles.rewardTypeButtonSelected]} onPress={() => setRewardFormData({...rewardFormData, rewardType: 'service'})}>
                    <Text style={[styles.rewardTypeButtonText, rewardFormData.rewardType === 'service' && styles.rewardTypeButtonTextSelected]}>Service</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalLabel}>
                  {rewardFormData.rewardType === 'discount' ? 'Discount Percentage *' : rewardFormData.rewardType === 'bonus_points' ? 'Bonus Points *' : 'Service Value *'}
                </Text>
                <TextInput style={styles.modalInput} placeholder={rewardFormData.rewardType === 'discount' ? 'e.g., 10' : 'e.g., 50'} keyboardType="numeric" value={rewardFormData.rewardValue} onChangeText={(text) => setRewardFormData({...rewardFormData, rewardValue: text})} />

                <Text style={styles.modalLabel}>Select Icon Theme</Text>
                <View style={styles.iconGrid}>
                  {rewardIcons.map((iconOption) => (
                    <TouchableOpacity key={iconOption.id} style={[styles.iconButton, rewardFormData.icon === iconOption.id && styles.iconButtonSelected, { backgroundColor: iconOption.bg }]} onPress={() => setRewardFormData({...rewardFormData, icon: iconOption.id, bgColor: iconOption.bg, iconColor: iconOption.color})}>
                      <Award size={24} color={iconOption.color} />
                      <Text style={[styles.iconButtonLabel, { color: iconOption.color }]}>{iconOption.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setShowRewardModal(false); resetRewardForm(); }}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveReward}>
                    <Text style={styles.modalSaveText}>{editingReward ? 'Update' : 'Create'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
<<<<<<< HEAD
}
=======
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#5DADE2', paddingHorizontal: 24, paddingVertical: 32, paddingTop: 50 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  notificationContainer: { position: 'relative' },
  notificationDot: { position: 'absolute', top: 0, right: 0, width: 10, height: 10, backgroundColor: '#EF4444', borderRadius: 5 },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  calculatorCard: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  greenBg: { backgroundColor: '#D1FAE5' },
  yellowBg: { backgroundColor: '#FEF3C7' },
  blueBg: { backgroundColor: '#DBEAFE' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  description: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  calculateButton: { backgroundColor: '#10B981', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  calculateButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  summaryContainer: { marginTop: 16, padding: 16, backgroundColor: '#F0FDF4', borderRadius: 8 },
  summaryTitle: { fontSize: 14, fontWeight: '600', color: '#166534', marginBottom: 4 },
  summaryText: { fontSize: 14, color: '#166534' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, width: '48%', borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statLabel: { fontSize: 14, color: '#6B7280', marginTop: 8, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  rewardsManagementCard: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  addRewardButton: { backgroundColor: '#F59E0B', borderRadius: 8, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  addRewardButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  rewardTasksList: { marginTop: 20 },
  rewardTasksTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  rewardTaskCard: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  rewardTaskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rewardTaskIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rewardTaskInfo: { flex: 1 },
  rewardTaskName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  rewardTaskDescription: { fontSize: 13, color: '#6B7280' },
  rewardTaskDetails: { marginBottom: 12 },
  rewardTaskDetailItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rewardTaskDetailLabel: { fontSize: 13, color: '#6B7280' },
  rewardTaskDetailValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  rewardTaskActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#DBEAFE', paddingVertical: 10, borderRadius: 6 },
  editButtonText: { fontSize: 14, fontWeight: '600', color: '#3B82F6' },
  deleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FEE2E2', paddingVertical: 10, borderRadius: 6 },
  deleteButtonText: { fontSize: 14, fontWeight: '600', color: '#EF4444' },
  emptyRewardsState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, marginTop: 20 },
  pickupsSection: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pickupCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  pickupHeader: { marginBottom: 12 },
  pickupTitleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickupName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusScheduled: { backgroundColor: '#DBEAFE' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusCompleted: { backgroundColor: '#DCFCE7' },
  statusText: { fontSize: 12, fontWeight: '600', color: '#111827' },
  pickupDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  pickupAddress: { fontSize: 14, color: '#6B7280', flex: 1 },
  pickupFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  pickupInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pickupDate: { fontSize: 14, color: '#6B7280' },
  pickupTime: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  quantityInfo: { backgroundColor: '#F3F4F6', padding: 8, borderRadius: 6, marginBottom: 8 },
  quantityLabel: { fontSize: 13, fontWeight: '500', color: '#374151' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyStateText: { fontSize: 16, color: '#9CA3AF', marginTop: 12 },
  loader: { marginVertical: 20 },
  bottomPadding: { height: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center' },
  modalScrollContent: { padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '100%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 16, marginBottom: 12 },
  modalLabel: { fontSize: 14, color: '#6B7280', marginBottom: 8, marginTop: 8 },
  modalInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, backgroundColor: '#F9FAFB' },
  summaryBox: { backgroundColor: '#F0FDF4', borderRadius: 8, padding: 16, marginTop: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#166534', fontWeight: '500' },
  summaryValue: { fontSize: 16, color: '#166534', fontWeight: '600' },
  summaryValueLarge: { fontSize: 24, color: '#10B981', fontWeight: 'bold' },
  rewardTypeButtons: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  rewardTypeButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#F9FAFB', alignItems: 'center' },
  rewardTypeButtonSelected: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  rewardTypeButtonText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  rewardTypeButtonTextSelected: { color: 'white' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  iconButton: { width: '48%', padding: 16, borderRadius: 10, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  iconButtonSelected: { borderColor: '#F59E0B', borderWidth: 2 },
  iconButtonLabel: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancelButton: { flex: 1, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' },
  modalCancelText: { fontSize: 16, color: '#6B7280', fontWeight: '600' },
  modalSaveButton: { flex: 1, paddingVertical: 14, borderRadius: 8, backgroundColor: '#10B981', alignItems: 'center' },
  modalSaveText: { fontSize: 16, color: 'white', fontWeight: '600' },
  reportsSection: { marginTop: 24, marginBottom: 16 },
  reportsButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reportsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportsTextContainer: {
    flex: 1,
  },
  reportsButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  reportsButtonSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  reportsArrow: {
    marginLeft: 12,
  },
  reportsArrowText: {
    fontSize: 24,
    color: '#5DADE2',
    fontWeight: 'bold',
  },
});
>>>>>>> b8a80e7c7e8a3db308541310e9bf0ff5f74557ed
