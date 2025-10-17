import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Users } from 'lucide-react-native';

const StatsCard = ({ totalRevenue, activeSchedules }) => {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <View style={[styles.iconCircle, styles.blueBg]}>
          <TrendingUp size={24} color="#3B82F6" strokeWidth={2.5} />
        </View>
        <Text style={styles.statLabel}>Total Revenue</Text>
        <Text style={styles.statValue}>${totalRevenue.toFixed(2)}</Text>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.iconCircle, styles.yellowBg]}>
          <Users size={24} color="#F59E0B" strokeWidth={2.5} />
        </View>
        <Text style={styles.statLabel}>Active Schedules</Text>
        <Text style={styles.statValue}>{activeSchedules}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  blueBg: {
    backgroundColor: '#DBEAFE'
  },
  yellowBg: {
    backgroundColor: '#FEF3C7'
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827'
  }
});

export default StatsCard;