// components/DashboardHeader.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, Bell } from 'lucide-react-native';
import { styles } from '../styles/dashboardStyles';

export const DashboardHeader = ({ 
  userName, 
  hasUnreadNotifications, 
  onProfilePress, 
  onNotificationPress 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.headerTitle}>Smart Waste Management</Text>
          <Text style={styles.headerSubtitle}>Welcome, {userName || 'User'}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={onProfilePress}
          >
            <User size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.notificationContainer}
            onPress={onNotificationPress}
          >
            <Bell size={24} color="white" />
            {hasUnreadNotifications && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};