import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

import { useSchedule } from '../../hooks/useSchedule';
import Header from '../../components/Schedule/Header';
import WasteTypeSelector from '../../components/Schedule/WasteTypeSelector';
import QuantityInput from '../../components/Schedule/QuantityInput';
import DateTimeInput from '../../components/Schedule/DateTimeInput';
import styles from '../../styles/ScheduleStyles';

export default function ScheduleScreen() {
  const {
    loading,
    formData,
    wasteTypes,
    units,
    handleConfirmPickup,
    handleBackPress,
    updateFormData
  } = useSchedule();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <Header 
          onBackPress={handleBackPress}
          title="Schedule Pickup"
        />

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Waste Type Selection */}
          <WasteTypeSelector
            wasteTypes={wasteTypes}
            selectedType={formData.wasteType}
            onSelect={(type) => updateFormData('wasteType', type)}
          />

          {/* Quantity Input */}
          <QuantityInput
            quantity={formData.quantity}
            unit={formData.unit}
            units={units}
            onQuantityChange={(text) => updateFormData('quantity', text)}
            onUnitChange={(unit) => updateFormData('unit', unit)}
          />

          {/* Address Input */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Address *</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="e.g., 123 Main Street, Colombo 03"
              placeholderTextColor="#9CA3AF"
              value={formData.address}
              onChangeText={(text) => updateFormData('address', text)}
              multiline
            />
          </View>

          {/* Date and Time Inputs */}
          <DateTimeInput
            date={formData.preferredDate}
            time={formData.preferredTime}
            onDateChange={(text) => updateFormData('preferredDate', text)}
            onTimeChange={(text) => updateFormData('preferredTime', text)}
          />

          {/* Special Instructions */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Special Instructions (Optional)</Text>
            <TextInput
              style={[styles.input, styles.instructionsInput]}
              placeholder="e.g., Please ring the bell twice, Side gate is locked"
              placeholderTextColor="#9CA3AF"
              value={formData.specialInstructions}
              onChangeText={(text) => updateFormData('specialInstructions', text)}
              multiline
            />
          </View>

          {/* Confirm Button */}
          <TouchableOpacity 
            style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
            onPress={handleConfirmPickup}
            disabled={loading}
          >
            <Text style={styles.confirmButtonText}>
              {loading ? 'Scheduling...' : 'Confirm Pickup Schedule'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}