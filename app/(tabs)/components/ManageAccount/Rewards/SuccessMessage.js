import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award } from 'lucide-react-native';

const SuccessMessage = ({ claimedReward }) => {
  if (!claimedReward) return null;

  return (
    <View style={styles.successCard}>
      <View style={styles.successIcon}>
        <Award size={32} color="#10B981" />
      </View>
      <View style={styles.successContent}>
        <Text style={styles.successTitle}>Reward Claimed!</Text>
        <Text style={styles.successSubtitle}>{claimedReward.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  successCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default SuccessMessage;