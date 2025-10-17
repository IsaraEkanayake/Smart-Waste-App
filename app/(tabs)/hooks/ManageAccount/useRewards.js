import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { doc, getDoc, updateDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { getAuth } from 'firebase/auth';

export const useRewards = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [userRewardsData, setUserRewardsData] = useState(null);
  const [rewardTasks, setRewardTasks] = useState([]);
  const [claimedReward, setClaimedReward] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUserRewardsData(),
        fetchRewardTasks()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRewardsData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        console.error('No user logged in');
        return;
      }

      const userRewardsRef = doc(db, 'userRewards', userId);
      const userRewardsSnap = await getDoc(userRewardsRef);

      if (userRewardsSnap.exists()) {
        const data = userRewardsSnap.data();
        setCurrentPoints(data.totalPoints || 0);
        setUserRewardsData(data);
      } else {
        const newUserRewards = {
          userId,
          totalPoints: 0,
          claimedRewards: [],
          activeDiscount: null,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        setCurrentPoints(0);
        setUserRewardsData(newUserRewards);
      }
    } catch (error) {
      console.error('Error fetching user rewards:', error);
    }
  };

  const fetchRewardTasks = async () => {
    try {
      const q = query(collection(db, 'rewardTasks'), orderBy('pointsRequired', 'asc'));
      const querySnapshot = await getDocs(q);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      setRewardTasks(tasks);
    } catch (error) {
      console.error('Error fetching reward tasks:', error);
    }
  };

  const handleClaimReward = async (reward) => {
    if (currentPoints < reward.pointsRequired) {
      Alert.alert('Insufficient Points', `You need ${reward.pointsRequired - currentPoints} more points to claim this reward.`);
      return;
    }

    Alert.alert(
      'Claim Reward',
      `Claim "${reward.name}" for ${reward.pointsRequired} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim',
          onPress: async () => {
            try {
              const userId = auth.currentUser?.uid;
              const userRewardsRef = doc(db, 'userRewards', userId);

              const newTotalPoints = currentPoints - reward.pointsRequired;
              const claimData = {
                rewardId: reward.id,
                rewardName: reward.name,
                rewardType: reward.rewardType,
                rewardValue: reward.rewardValue,
                pointsUsed: reward.pointsRequired,
                claimedAt: new Date().toISOString(),
                status: 'active',
              };

              let updateData = {
                totalPoints: newTotalPoints,
                claimedRewards: [
                  ...(userRewardsData?.claimedRewards || []),
                  claimData
                ],
                lastUpdated: new Date().toISOString(),
              };

              // If it's a discount, set as active discount
              if (reward.rewardType === 'discount') {
                updateData.activeDiscount = claimData;
              }

              // If it's bonus points, add them immediately
              if (reward.rewardType === 'bonus_points') {
                updateData.totalPoints = newTotalPoints + reward.rewardValue;
              }

              await updateDoc(userRewardsRef, updateData);

              setCurrentPoints(updateData.totalPoints);
              setClaimedReward(reward);
              
              let message = `You've claimed "${reward.name}"!`;
              if (reward.rewardType === 'discount') {
                message += `\n\n${reward.rewardValue}% discount will be applied to your next payment.`;
              } else if (reward.rewardType === 'bonus_points') {
                message += `\n\n+${reward.rewardValue} bonus points added to your account!`;
              }

              Alert.alert('Reward Claimed!', message);
              
              setTimeout(() => {
                setClaimedReward(null);
              }, 3000);

              fetchUserRewardsData();
            } catch (error) {
              console.error('Error claiming reward:', error);
              Alert.alert('Error', 'Failed to claim reward. Please try again.');
            }
          }
        }
      ]
    );
  };

  const isRewardClaimed = (rewardId) => {
    return userRewardsData?.claimedRewards?.some(
      claimed => claimed.rewardId === rewardId && claimed.status === 'active'
    );
  };

  const renderIcon = (iconType, color) => {
    switch (iconType) {
      case 'recycle':
        return <Recycle size={32} color={color} strokeWidth={2} />;
      case 'percent':
        return <Percent size={32} color={color} strokeWidth={2} />;
      case 'trending':
        return <TrendingUp size={32} color={color} strokeWidth={2} />;
      case 'award':
        return <Award size={32} color={color} strokeWidth={2} />;
      default:
        return <Award size={32} color={color} strokeWidth={2} />;
    }
  };

  return {
    loading,
    currentPoints,
    userRewardsData,
    rewardTasks,
    claimedReward,
    handleClaimReward,
    isRewardClaimed,
    renderIcon,
    fetchData
  };
};