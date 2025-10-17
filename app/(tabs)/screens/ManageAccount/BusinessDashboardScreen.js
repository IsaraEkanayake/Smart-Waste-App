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
}