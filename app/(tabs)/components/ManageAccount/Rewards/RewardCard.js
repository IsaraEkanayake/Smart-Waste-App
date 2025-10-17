import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Lock, Award, Recycle, Percent, TrendingUp } from 'lucide-react-native';

const RewardCard = ({ 
  reward, 
  currentPoints, 
  isClaimed, 
  onClaim,
  renderIcon 
}) => {
  const isLocked = currentPoints < reward.pointsRequired;
  const progress = Math.min((currentPoints / reward.pointsRequired) * 100, 100);
  const remaining = Math.max(reward.pointsRequired - currentPoints, 0);

  return (
    <View style={styles.rewardCardContainer}>
      <TouchableOpacity
        style={[
          styles.rewardCard,
          isLocked && styles.rewardCardLocked,
          isClaimed && styles.rewardCardClaimed
        ]}
        onPress={() => !isLocked && !isClaimed && onClaim(reward)}
        disabled={isLocked || isClaimed}
      >
        <View style={styles.rewardContent}>
          <View style={[styles.rewardIcon, { backgroundColor: reward.bgColor }]}>
            {isLocked ? (
              <Lock size={20} color="#9CA3AF" strokeWidth={2} />
            ) : (
              renderIcon(reward.icon, reward.iconColor)
            )}
          </View>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>{reward.name}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
            <View style={styles.rewardValueBadge}>
              <Text style={styles.rewardValueText}>
                {reward.rewardType === 'discount' 
                  ? `${reward.rewardValue}% Off` 
                  : reward.rewardType === 'bonus_points'
                  ? `+${reward.rewardValue} Points`
                  : reward.rewardValue}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.rewardPointsDisplay}>
          {isClaimed ? (
            <Text style={styles.claimedBadge}>Claimed ✓</Text>
          ) : (
            <Text style={[
              styles.rewardPoints,
              isLocked && styles.rewardPointsDisabled
            ]}>
              {reward.pointsRequired} pts
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Progress Bar */}
      {!isClaimed && (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: isLocked ? '#D1D5DB' : reward.iconColor,
                }
              ]}
            />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {currentPoints} / {reward.pointsRequired} pts
            </Text>
            {!isLocked ? (
              <Text style={styles.unlocked}>✓ Ready to Claim</Text>
            ) : (
              <Text style={styles.remaining}>
                {remaining} more points needed
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rewardCardContainer: {
    marginBottom: 20,
  },
  rewardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardCardLocked: {
    opacity: 0.7,
    backgroundColor: '#F9FAFB',
  },
  rewardCardClaimed: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  rewardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rewardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  rewardValueBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  rewardValueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  rewardPointsDisplay: {
    justifyContent: 'center',
  },
  rewardPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  rewardPointsDisabled: {
    color: '#9CA3AF',
  },
  claimedBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  progressSection: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  unlocked: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  remaining: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
});

export default RewardCard;