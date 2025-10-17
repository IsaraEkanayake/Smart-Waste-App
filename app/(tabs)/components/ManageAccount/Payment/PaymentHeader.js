import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { styles } from '../styles/paymentStyles';

export const PaymentHeader = ({ onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <ArrowLeft size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Pay Bill</Text>
      <View style={styles.notificationContainer}>
        <Bell size={24} color="white" />
        <View style={styles.notificationDot} />
      </View>
    </View>
  );
};