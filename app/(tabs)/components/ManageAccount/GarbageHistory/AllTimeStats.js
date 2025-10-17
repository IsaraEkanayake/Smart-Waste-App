import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles';

export const AllTimeStats = ({ stats }) => {
  return (
    <View style={styles.allTimeStats}>
      <Text style={styles.allTimeTitle}>All Time Statistics</Text>
      <View style={styles.allTimeRow}>
        <Text style={styles.allTimeLabel}>Total Collections:</Text>
        <Text style={styles.allTimeValue}>{stats.totalCollections}</Text>
      </View>
      <View style={styles.allTimeRow}>
        <Text style={styles.allTimeLabel}>Total Weight:</Text>
        <Text style={styles.allTimeValue}>{stats.totalWeight} kg</Text>
      </View>
      <View style={styles.allTimeRow}>
        <Text style={styles.allTimeLabel}>Total Revenue:</Text>
        <Text style={styles.allTimeValue}>${stats.totalCost}</Text>
      </View>
    </View>
  );
};