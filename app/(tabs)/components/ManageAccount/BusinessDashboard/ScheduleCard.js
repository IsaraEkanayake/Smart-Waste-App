import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Calendar, Clock } from 'lucide-react-native';

const ScheduleCard = ({ schedule, formatDate, getStatusBadgeStyle }) => {
  return (
    <View style={styles.pickupCard}>
      <View style={styles.pickupHeader}>
        <View style={styles.pickupTitleContainer}>
          <Text style={styles.pickupName}>{schedule.wasteType}</Text>
          <View style={getStatusBadgeStyle(schedule.status)}>
            <Text style={styles.statusText}>{schedule.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.pickupDetailRow}>
        <MapPin size={16} color="#6B7280" />
        <Text style={styles.pickupAddress}>{schedule.address}</Text>
      </View>

      <View style={styles.pickupFooter}>
        <View style={styles.pickupInfo}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.pickupDate}>{formatDate(schedule.preferredDate)}</Text>
        </View>
        <View style={styles.pickupInfo}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.pickupTime}>{schedule.preferredTime}</Text>
        </View>
      </View>

      <View style={styles.quantityInfo}>
        <Text style={styles.quantityLabel}>Quantity: {schedule.quantity} {schedule.unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickupCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  pickupHeader: {
    marginBottom: 12
  },
  pickupTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pickupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827'
  },
  pickupDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8
  },
  pickupAddress: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1
  },
  pickupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  pickupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  pickupDate: {
    fontSize: 14,
    color: '#6B7280'
  },
  pickupTime: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600'
  },
  quantityInfo: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8
  },
  quantityLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151'
  }
});

export default ScheduleCard;