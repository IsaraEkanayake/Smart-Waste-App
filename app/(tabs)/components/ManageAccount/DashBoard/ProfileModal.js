// components/ProfileModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { X, User, Mail, Phone, MapPin, Edit2, LogOut } from 'lucide-react-native';
import { styles } from '../styles/dashboardStyles';

export const ProfileModal = ({ 
  visible, 
  userData, 
  onClose, 
  onEditProfile, 
  onSignOut 
}) => {
  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="slide" 
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>My Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {userData && (
            <>
              <View style={styles.profileAvatarContainer}>
                <View style={styles.profileAvatar}>
                  <User size={48} color="#5DADE2" />
                </View>
                <Text style={styles.profileName}>{userData.fullName}</Text>
                <View style={styles.userTypeBadge}>
                  <Text style={styles.userTypeText}>{userData.userType || 'Resident'}</Text>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <View style={styles.profileItem}>
                  <Mail size={20} color="#6B7280" />
                  <Text style={styles.profileLabel}>Email</Text>
                  <Text style={styles.profileValue}>{userData.email}</Text>
                </View>

                <View style={styles.profileItem}>
                  <Phone size={20} color="#6B7280" />
                  <Text style={styles.profileLabel}>Phone</Text>
                  <Text style={styles.profileValue}>{userData.phone || 'Not set'}</Text>
                </View>

                <View style={styles.profileItem}>
                  <MapPin size={20} color="#6B7280" />
                  <Text style={styles.profileLabel}>Address</Text>
                  <Text style={styles.profileValue}>{userData.address || 'Not set'}</Text>
                </View>
              </View>

              <View style={styles.profileActions}>
                <TouchableOpacity 
                  style={styles.editProfileButton}
                  onPress={onEditProfile}
                >
                  <Edit2 size={20} color="white" />
                  <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.signOutButton}
                  onPress={onSignOut}
                >
                  <LogOut size={20} color="#EF4444" />
                  <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};