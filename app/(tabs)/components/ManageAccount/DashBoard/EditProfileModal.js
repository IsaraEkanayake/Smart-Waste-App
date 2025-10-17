// components/EditProfileModal.js
import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { styles } from '../styles/dashboardStyles';

export const EditProfileModal = ({ 
  visible, 
  formData, 
  onClose, 
  onSave, 
  onFormChange 
}) => {
  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="slide" 
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ScrollView contentContainerStyle={styles.modalScrollContent}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => onFormChange({...formData, fullName: text})}
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(text) => onFormChange({...formData, phone: text})}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={formData.address}
              onChangeText={(text) => onFormChange({...formData, address: text})}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={onClose}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton} 
                onPress={onSave}
              >
                <Text style={styles.modalSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};