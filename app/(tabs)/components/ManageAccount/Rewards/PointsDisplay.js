import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PointsDisplay = ({ currentPoints }) => {
  return (
    <View style={styles.pointsContainer}>
      <Text style={styles.pointsValue}>{currentPoints}</Text>
      <Text style={styles.pointsLabel}>Total Points</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pointsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 20,
  },
  pointsValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 72,
  },
  pointsLabel: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default PointsDisplay;