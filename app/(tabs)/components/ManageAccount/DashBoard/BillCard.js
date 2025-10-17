// components/BillCard.js
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { styles } from '../styles/dashboardStyles';

export const BillCard = ({ loading, currentBill, onPayNow }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, styles.greenBg]}>
        <DollarSign size={32} color="#10B981" strokeWidth={2.5} />
      </View>
      <Text style={styles.cardLabel}>Current Bill</Text>
      
      {loading ? (
        <ActivityIndicator size="small" color="#10B981" style={styles.loader} />
      ) : (
        <>
          <Text style={styles.billAmount}>${currentBill.amount}</Text>
          {currentBill.unpaidCount > 0 && (
            <Text style={styles.billSubtext}>
              {currentBill.unpaidCount} unpaid collection{currentBill.unpaidCount > 1 ? 's' : ''}
            </Text>
          )}
          <TouchableOpacity style={styles.payButton} onPress={onPayNow}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};