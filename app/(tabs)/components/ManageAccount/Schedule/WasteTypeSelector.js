import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';

const WasteTypeSelector = ({ wasteTypes, selectedType, onSelect }) => {
  return (
    <View style={styles.inputCard}>
      <Text style={styles.inputLabel}>Type of Waste *</Text>
      <View style={styles.wasteTypeGrid}>
        {wasteTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.wasteTypeButton,
              selectedType === type && styles.wasteTypeButtonSelected
            ]}
            onPress={() => onSelect(type)}
          >
            <Trash2 size={16} color={selectedType === type ? 'white' : '#6B7280'} />
            <Text style={[
              styles.wasteTypeText,
              selectedType === type && styles.wasteTypeTextSelected
            ]}>
              {type}
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
  wasteTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wasteTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    width: '48%',
  },
  wasteTypeButtonSelected: {
    backgroundColor: '#5DADE2',
    borderColor: '#5DADE2',
  },
  wasteTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  wasteTypeTextSelected: {
    color: 'white',
  },
});

export default WasteTypeSelector;