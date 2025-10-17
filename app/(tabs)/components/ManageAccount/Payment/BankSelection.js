import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Building2, CheckCircle } from 'lucide-react-native';
import { bankOptions } from '../constants/bankData';
import { styles } from '../styles/paymentStyles';

export const BankSelection = ({ selectedBank, onSelectBank }) => {
  return (
    <>
      <Text style={styles.bankSelectionTitle}>Select Bank Account</Text>
      {bankOptions.map((bank) => (
        <TouchableOpacity
          key={bank.id}
          style={[
            styles.bankOption,
            selectedBank === bank.id && styles.bankOptionSelected
          ]}
          onPress={() => onSelectBank(bank.id)}
        >
          <Building2 size={20} color={selectedBank === bank.id ? '#5DADE2' : '#6B7280'} />
          <View style={styles.bankOptionText}>
            <Text style={[
              styles.bankName,
              selectedBank === bank.id && styles.bankNameSelected
            ]}>
              {bank.name}
            </Text>
            <Text style={styles.bankBranch}>{bank.branch}</Text>
          </View>
          {selectedBank === bank.id && (
            <CheckCircle size={20} color="#5DADE2" />
          )}
        </TouchableOpacity>
      ))}
    </>
  );
};