import React from 'react';
import { View, Text } from 'react-native';
import { Award } from 'lucide-react-native';
import { styles } from '../styles/paymentStyles';

export const PointsPreviewCard = ({ numberOfCollections }) => {
  if (numberOfCollections === 0) return null;

  return (
    <View style={styles.pointsPreviewCard}>
      <View style={styles.pointsPreviewHeader}>
        <Award size={20} color="#F59E0B" />
        <Text style={styles.pointsPreviewTitle}>Reward Points</Text>
      </View>
      <Text style={styles.pointsPreviewText}>
        Pay now to earn <Text style={styles.pointsHighlight}>{numberOfCollections} point{numberOfCollections > 1 ? 's' : ''}</Text> 
        {' '}for your rewards!
      </Text>
    </View>
  );
};