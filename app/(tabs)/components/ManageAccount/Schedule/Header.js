import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, ArrowLeft } from 'lucide-react-native';

const Header = ({ onBackPress, title }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <ArrowLeft size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.notificationContainer}>
        <Bell size={24} color="white" />
        <View style={styles.notificationDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#5DADE2',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
  },
});

export default Header;