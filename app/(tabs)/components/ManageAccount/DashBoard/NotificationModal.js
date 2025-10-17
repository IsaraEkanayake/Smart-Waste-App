// components/NotificationModal.js
import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { X, Bell, DollarSign, Calendar } from 'lucide-react-native';
import { styles } from '../styles/dashboardStyles';
import { formatNotificationTime } from '../utils/dashboardUtils';

export const NotificationModal = ({ 
  visible, 
  notifications, 
  onClose, 
  onNotificationAction,
  onRefresh 
}) => {
  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="slide" 
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.notificationModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {notifications.length > 0 ? (
              <>
                <Text style={styles.notificationDebug}>
                  Found {notifications.length} notification(s)
                </Text>
                {notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      notification.priority === 'high' && styles.notificationItemHigh
                    ]}
                    onPress={() => onNotificationAction(notification)}
                  >
                    <View style={styles.notificationIcon}>
                      {notification.type === 'payment' ? (
                        <DollarSign size={20} color={notification.priority === 'high' ? '#EF4444' : '#10B981'} />
                      ) : (
                        <Calendar size={20} color="#5DADE2" />
                      )}
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <Text style={styles.notificationTime}>
                        {formatNotificationTime(notification.timestamp)}
                      </Text>
                    </View>
                    <View style={styles.notificationAction}>
                      <Text style={styles.notificationActionText}>›</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View style={styles.noNotifications}>
                <Bell size={48} color="#D1D5DB" />
                <Text style={styles.noNotificationsText}>No notifications</Text>
                <Text style={styles.noNotificationsSubtext}>
                  You're all caught up!
                </Text>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={onRefresh}
                >
                  <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};