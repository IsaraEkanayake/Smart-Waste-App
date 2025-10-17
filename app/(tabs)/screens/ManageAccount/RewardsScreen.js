import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { useRewards } from '../../hooks/useRewards';
import Header from '../../components/Rewards/Header';
import PointsDisplay from '../../components/Rewards/PointsDisplay';
import ActiveDiscountBanner from '../../components/Rewards/ActiveDiscountBanner';
import RewardCard from '../../components/Rewards/RewardCard';
import SuccessMessage from '../../components/Rewards/SuccessMessage';
import HowToEarnPoints from '../../components/Rewards/HowToEarnPoints';
import styles from '../../styles/RewardsStyles';

export default function RewardsScreen() {
  const router = useRouter();
  const {
    loading,
    currentPoints,
    userRewardsData,
    rewardTasks,
    claimedReward,
    handleClaimReward,
    isRewardClaimed,
    renderIcon
  } = useRewards();

  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Header onBackPress={handleBackPress} title="My Rewards" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5DADE2" />
            <Text style={styles.loadingText}>Loading rewards...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Header onBackPress={handleBackPress} title="My Rewards" />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {/* Total Points Display */}
          <PointsDisplay currentPoints={currentPoints} />

          {/* Active Discount Banner */}
          <ActiveDiscountBanner activeDiscount={userRewardsData?.activeDiscount} />

          {/* Available Rewards */}
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          
          {rewardTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Award size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No rewards available yet</Text>
              <Text style={styles.emptyStateSubtext}>Check back later for exciting rewards!</Text>
            </View>
          ) : (
            rewardTasks.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                currentPoints={currentPoints}
                isClaimed={isRewardClaimed(reward.id)}
                onClaim={handleClaimReward}
                renderIcon={renderIcon}
              />
            ))
          )}

          {/* Success Message */}
          <SuccessMessage claimedReward={claimedReward} />

          {/* How to Earn Points */}
          <HowToEarnPoints />

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}