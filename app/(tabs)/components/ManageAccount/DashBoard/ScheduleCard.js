// components/ScheduleCard.js
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { styles } from '../styles/dashboardStyles';
import { formatDate } from '../utils/dashboardUtils';

export const ScheduleCard = ({ loading, nextSchedule, onScheduleNew }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, styles.greenBg]}>
        <Calendar size={32} color="#10B981" strokeWidth={2.5} />
      </View>
      <Text style={styles.cardLabel}>Next Pickup</Text>
      
      {loading ? (
        <ActivityIndicator size="small" color="#10B981" style={styles.loader} />
      ) : nextSchedule ? (
        <>
          <Text style={styles.pickupDate}>{formatDate(nextSchedule.preferredDate)}</Text>
          <Text style={styles.pickupTime}>{nextSchedule.preferredTime}</Text>
          <Text style={styles.pickupType}>{nextSchedule.wasteType}</Text>
          <View style={styles.scheduleActions}>
            <TouchableOpacity style={styles.scheduleButton} onPress={onScheduleNew}>
              <Text style={styles.scheduleButtonText}>New Schedule</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.noScheduleText}>No schedule yet</Text>
          <TouchableOpacity style={styles.redeemButton} onPress={onScheduleNew}>
            <Text style={styles.redeemButtonText}>Schedule Now</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};