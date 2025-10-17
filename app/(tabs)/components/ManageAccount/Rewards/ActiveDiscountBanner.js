import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Percent } from 'lucide-react-native';

const ActiveDiscountBanner = ({ activeDiscount }) => {
  if (!activeDiscount) return null;

  return (
    <View style={styles.activeDiscountBanner}>
      <View style={styles.activeDiscountIcon}>
        <Percent size={24} color="#F59E0B" />
      </View>
      <View style={styles.activeDiscountInfo}>
        <Text style={styles.activeDiscountTitle}>Active Discount</Text>
        <Text style={styles.activeDiscountText}>
          {activeDiscount.rewardValue}% off - {activeDiscount.rewardName}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activeDiscountBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  activeDiscountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeDiscountInfo: {
    flex: 1,
  },
  activeDiscountTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  activeDiscountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D97706',
  },
});

export default ActiveDiscountBanner;