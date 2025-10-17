import React from 'react';
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { styles } from '../styles/styles';

export const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading garbage history...</Text>
      </View>
    </SafeAreaView>
  );
};