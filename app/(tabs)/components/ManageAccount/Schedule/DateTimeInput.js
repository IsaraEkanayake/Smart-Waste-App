import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';

const DateTimeInput = ({ date, time, onDateChange, onTimeChange }) => {
  return (
    <>
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Preferred Date *</Text>
        <View style={styles.dateTimeRow}>
          <View style={styles.dateInputContainer}>
            <Calendar size={20} color="#5DADE2" />
            <TextInput
              style={styles.dateTimeInput}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9CA3AF"
              value={date}
              onChangeText={onDateChange}
            />
          </View>
        </View>
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Preferred Time *</Text>
        <View style={styles.dateTimeRow}>
          <View style={styles.timeInputContainer}>
            <Clock size={20} color="#5DADE2" />
            <TextInput
              style={styles.dateTimeInput}
              placeholder="HH:MM (e.g., 09:30)"
              placeholderTextColor="#9CA3AF"
              value={time}
              onChangeText={onTimeChange}
            />
          </View>
        </View>
      </View>
    </>
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
  dateTimeRow: {
    gap: 12,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  dateTimeInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
  },
});

export default DateTimeInput;