// components/RewardCard.js
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Award } from 'lucide-react-native';
import { styles } from '../styles/dashboardStyles';

export const RewardCard = ({ loading, nextReward, currentPoints, onRedeem }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, styles.purpleBg]}>
        <Award size={32} color="#A855F7" strokeWidth={2.5} />
      </View>
      <Text style={styles.cardLabel}>Next Reward</Text>
      
      {loading ? (
        <ActivityIndicator size="small" color="#A855F7" style={styles.loader} />
      ) : nextReward ? (
        <>
          <Text style={styles.rewardName}>{nextReward.name}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(nextReward.progress, 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentPoints}/{nextReward.pointsRequired}
            </Text>
          </View>
          {nextReward.allUnlocked ? (
            <Text style={styles.unlockedText}>All rewards unlocked! 🎉</Text>
          ) : nextReward.canClaim ? (
            <Text style={styles.canClaimText}>Ready to claim! ✓</Text>
          ) : (
            <Text style={styles.pointsNeeded}>
              {nextReward.pointsNeeded} pts to unlock
            </Text>
          )}
          <TouchableOpacity style={styles.redeemButton} onPress={onRedeem}>
            <Text style={styles.redeemButtonText}>View All</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.noRewardText}>No rewards available</Text>
          <TouchableOpacity style={styles.redeemButton} onPress={onRedeem}>
            <Text style={styles.redeemButtonText}>View Rewards</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};