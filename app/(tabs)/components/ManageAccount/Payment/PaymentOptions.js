import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CreditCard, Landmark } from 'lucide-react-native';
import { styles } from '../styles/paymentStyles';

export const PaymentOptions = ({ selectedPayment, onSelectPayment }) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Payment Options</Text>

      <TouchableOpacity 
        style={[
          styles.paymentOption,
          selectedPayment === 'card' && styles.paymentOptionSelected
        ]}
        onPress={() => onSelectPayment('card')}
      >
        <View style={styles.paymentOptionContent}>
          <CreditCard size={24} color="#374151" strokeWidth={2} />
          <View style={styles.paymentOptionTextContainer}>
            <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
            <Text style={styles.paymentOptionSubtext}>Pay securely via Stripe</Text>
          </View>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.paymentOption,
          selectedPayment === 'bank' && styles.paymentOptionSelected
        ]}
        onPress={() => onSelectPayment('bank')}
      >
        <View style={styles.paymentOptionContent}>
          <Landmark size={24} color="#374151" strokeWidth={2} />
          <View style={styles.paymentOptionTextContainer}>
            <Text style={styles.paymentOptionText}>Bank Transfer</Text>
            <Text style={styles.paymentOptionSubtext}>Transfer to our bank account</Text>
          </View>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </>
  );
};
