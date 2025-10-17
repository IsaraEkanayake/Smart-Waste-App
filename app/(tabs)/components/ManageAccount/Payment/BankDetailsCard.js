import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Copy } from 'lucide-react-native';
import { bankOptions } from '../constants/bankData';
import { copyToClipboard } from '../utils/clipboardUtils';
import { styles } from '../styles/paymentStyles';

export const BankDetailsCard = ({ selectedBank, amount }) => {
  const bank = bankOptions.find(b => b.id === selectedBank);
  
  if (!bank) return null;

  return (
    <View style={styles.bankDetailsCard}>
      <Text style={styles.bankDetailsTitle}>{bank.name} Details</Text>
      
      <View style={styles.bankDetailRow}>
        <Text style={styles.bankDetailLabel}>Account Name:</Text>
        <View style={styles.bankDetailValueContainer}>
          <Text style={styles.bankDetailValue}>{bank.accountName}</Text>
          <TouchableOpacity 
            onPress={() => copyToClipboard(bank.accountName, 'Account name')}
            style={styles.copyButton}
          >
            <Copy size={16} color="#5DADE2" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bankDetailRow}>
        <Text style={styles.bankDetailLabel}>Account Number:</Text>
        <View style={styles.bankDetailValueContainer}>
          <Text style={[styles.bankDetailValue, styles.monospace]}>{bank.accountNumber}</Text>
          <TouchableOpacity 
            onPress={() => copyToClipboard(bank.accountNumber, 'Account number')}
            style={styles.copyButton}
          >
            <Copy size={16} color="#5DADE2" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bankDetailRow}>
        <Text style={styles.bankDetailLabel}>Branch:</Text>
        <View style={styles.bankDetailValueContainer}>
          <Text style={styles.bankDetailValue}>{bank.branch}</Text>
          <TouchableOpacity 
            onPress={() => copyToClipboard(bank.branch, 'Branch')}
            style={styles.copyButton}
          >
            <Copy size={16} color="#5DADE2" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bankDetailRow}>
        <Text style={styles.bankDetailLabel}>Branch Code:</Text>
        <View style={styles.bankDetailValueContainer}>
          <Text style={[styles.bankDetailValue, styles.monospace]}>{bank.branchCode}</Text>
          <TouchableOpacity 
            onPress={() => copyToClipboard(bank.branchCode, 'Branch code')}
            style={styles.copyButton}
          >
            <Copy size={16} color="#5DADE2" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bankDetailRow}>
        <Text style={styles.bankDetailLabel}>SWIFT Code:</Text>
        <View style={styles.bankDetailValueContainer}>
          <Text style={[styles.bankDetailValue, styles.monospace]}>{bank.swiftCode}</Text>
          <TouchableOpacity 
            onPress={() => copyToClipboard(bank.swiftCode, 'SWIFT code')}
            style={styles.copyButton}
          >
            <Copy size={16} color="#5DADE2" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.amountToTransferCard}>
        <Text style={styles.amountToTransferLabel}>Amount to Transfer:</Text>
        <Text style={styles.amountToTransferValue}>${amount}</Text>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          📌 Important: Please include your phone number or account reference in the transfer description for faster verification.
        </Text>
      </View>
    </View>
  );
};