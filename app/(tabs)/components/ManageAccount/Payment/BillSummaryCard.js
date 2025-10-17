import React from 'react';
import { View, Text } from 'react-native';
import { Clock } from 'lucide-react-native';
import { styles } from '../styles/paymentStyles';

export const BillSummaryCard = ({ currentBill }) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Text style={styles.monthLabel}>{currentMonth}</Text>
        <View style={styles.unpaidBadge}>
          <Clock size={14} color="#EF4444" />
          <Text style={styles.unpaidText}>Unpaid</Text>
        </View>
      </View>
      
      <Text style={styles.amountDue}>Amount Due</Text>
      <Text style={styles.amountValue}>${currentBill.amount}</Text>
      
      {currentBill.unpaidRecords.length > 0 && (
        <View style={styles.recordsBreakdown}>
          <Text style={styles.breakdownTitle}>Unpaid Collections:</Text>
          {currentBill.unpaidRecords.slice(0, 3).map((record) => (
            <View key={record.id} style={styles.breakdownRow}>
              <Text style={styles.breakdownDate}>{record.collectionDate}</Text>
              <Text style={styles.breakdownAmount}>${record.totalCost}</Text>
            </View>
          ))}
          {currentBill.unpaidRecords.length > 3 && (
            <Text style={styles.moreRecords}>
              +{currentBill.unpaidRecords.length - 3} more collection(s)
            </Text>
          )}
        </View>
      )}
    </View>
  );
};