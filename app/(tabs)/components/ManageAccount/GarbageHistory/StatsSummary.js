import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, Package, TrendingUp } from 'lucide-react-native';
import { styles } from '../styles/styles';

export const StatsSummary = ({ stats }) => {
  return (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>This Month Summary</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.iconCircle, styles.greenBg]}>
            <Package size={20} color="#10B981" />
          </View>
          <Text style={styles.statValue}>{stats.thisMonth.collections}</Text>
          <Text style={styles.statLabel}>Collections</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.iconCircle, styles.blueBg]}>
            <TrendingUp size={20} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>{stats.thisMonth.weight} kg</Text>
          <Text style={styles.statLabel}>Total Weight</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.iconCircle, styles.yellowBg]}>
            <Calendar size={20} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>${stats.thisMonth.cost}</Text>
          <Text style={styles.statLabel}>Total Cost</Text>
        </View>
      </View>
    </View>
  );
};