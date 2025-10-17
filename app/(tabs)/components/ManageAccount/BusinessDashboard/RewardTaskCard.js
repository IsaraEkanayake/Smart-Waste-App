import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Award, Edit2, Trash2 } from 'lucide-react-native';

const RewardTaskCard = ({ reward, onEdit, onDelete }) => {
  return (
    <View style={styles.rewardTaskCard}>
      <View style={styles.rewardTaskHeader}>
        <View style={[styles.rewardTaskIcon, { backgroundColor: reward.bgColor }]}>
          <Award size={24} color={reward.iconColor} />
        </View>
        <View style={styles.rewardTaskInfo}>
          <Text style={styles.rewardTaskName}>{reward.name}</Text>
          <Text style={styles.rewardTaskDescription}>{reward.description}</Text>
        </View>
      </View>
      
      <View style={styles.rewardTaskDetails}>
        <View style={styles.rewardTaskDetailItem}>
          <Text style={styles.rewardTaskDetailLabel}>Points Required:</Text>
          <Text style={styles.rewardTaskDetailValue}>{reward.pointsRequired} pts</Text>
        </View>
        <View style={styles.rewardTaskDetailItem}>
          <Text style={styles.rewardTaskDetailLabel}>Reward:</Text>
          <Text style={styles.rewardTaskDetailValue}>
            {reward.rewardType === 'discount' 
              ? `${reward.rewardValue}% Off` 
              : reward.rewardType === 'bonus_points'
              ? `+${reward.rewardValue} pts`
              : reward.rewardValue}
          </Text>
        </View>
      </View>

      <View style={styles.rewardTaskActions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => onEdit(reward)}
        >
          <Edit2 size={16} color="#3B82F6" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(reward.id)}
        >
          <Trash2 size={16} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rewardTaskCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  rewardTaskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  rewardTaskIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  rewardTaskInfo: {
    flex: 1
  },
  rewardTaskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  rewardTaskDescription: {
    fontSize: 13,
    color: '#6B7280'
  },
  rewardTaskDetails: {
    marginBottom: 12
  },
  rewardTaskDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  rewardTaskDetailLabel: {
    fontSize: 13,
    color: '#6B7280'
  },
  rewardTaskDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827'
  },
  rewardTaskActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DBEAFE',
    paddingVertical: 10,
    borderRadius: 6
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6'
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 6
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444'
  }
});

export default RewardTaskCard;