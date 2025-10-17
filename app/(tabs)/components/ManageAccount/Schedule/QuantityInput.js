import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const QuantityInput = ({ quantity, unit, units, onQuantityChange, onUnitChange }) => {
  return (
    <View style={styles.inputCard}>
      <Text style={styles.inputLabel}>Quantity *</Text>
      <View style={styles.quantityRow}>
        <TextInput
          style={[styles.input, styles.quantityInput]}
          keyboardType="numeric"
          placeholder="e.g., 25"
          placeholderTextColor="#9CA3AF"
          value={quantity}
          onChangeText={onQuantityChange}
        />
        <View style={styles.unitSelector}>
          <Text style={styles.selectedUnit}>{unit}</Text>
        </View>
      </View>
      <View style={styles.unitGrid}>
        {units.map((u) => (
          <TouchableOpacity
            key={u}
            style={[
              styles.unitButton,
              unit === u && styles.unitButtonSelected
            ]}
            onPress={() => onUnitChange(u)}
          >
            <Text style={[
              styles.unitButtonText,
              unit === u && styles.unitButtonTextSelected
            ]}>
              {u}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  quantityRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  quantityInput: {
    flex: 1,
  },
  unitSelector: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    minWidth: 80,
  },
  selectedUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  unitGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  unitButtonSelected: {
    backgroundColor: '#5DADE2',
    borderColor: '#5DADE2',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  unitButtonTextSelected: {
    color: 'white',
  },
});

export default QuantityInput;