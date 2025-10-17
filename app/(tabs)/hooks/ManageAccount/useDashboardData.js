// hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export const useDashboardData = (params) => {
  const [latestCollection, setLatestCollection] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [currentBill, setCurrentBill] = useState({ amount: 0, unpaidCount: 0 });
  const [currentPoints, setCurrentPoints] = useState(0);
  const [nextReward, setNextReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const userId = auth.currentUser?.uid || params.uid;
      if (!userId) return;

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchLatestCollection = async () => {
    try {
      const q = query(
        collection(db, 'garbageCollections'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setLatestCollection({ id: doc.id, ...doc.data() });
      }
    } catch (error) {
      console.error('Error fetching latest collection:', error);
    }
  };

  const fetchCurrentBill = async () => {
    try {
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

      const q = query(
        collection(db, 'garbageCollections'),
        where('status', '==', 'Unpaid'),
        where('month', '==', currentMonth)
      );

      const querySnapshot = await getDocs(q);
      let totalAmount = 0;
      let count = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalAmount += parseFloat(data.totalCost) || 0;
        count++;
      });

      setCurrentBill({
        amount: totalAmount.toFixed(2),
        unpaidCount: count
      });
    } catch (error) {
      console.error('Error fetching current bill:', error);
    }
  };

  const fetchNextSchedule = async () => {
    try {
      const userId = auth.currentUser?.uid || params.uid;
      if (!userId) return;

      const q = query(
        collection(db, 'schedules'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const schedules = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          schedules.push({ id: doc.id, ...data });
        });

        schedules.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        const scheduledPickup = schedules.find(s => s.status === 'Scheduled');
        if (scheduledPickup) {
          setNextSchedule(scheduledPickup);
        }
      }
    } catch (error) {
      console.error('Error fetching next schedule:', error);
    }
  };

  const fetchUserRewards = async () => {
    try {
      const userId = auth.currentUser?.uid || params.uid;
      if (!userId) return;

      const userRewardsRef = doc(db, 'userRewards', userId);
      const userRewardsSnap = await getDoc(userRewardsRef);

      let points = 0;
      let claimedRewards = [];

      if (userRewardsSnap.exists()) {
        const data = userRewardsSnap.data();
        points = data.totalPoints || 0;
        claimedRewards = data.claimedRewards || [];
      }

      setCurrentPoints(points);

      const rewardTasksQuery = query(
        collection(db, 'rewardTasks'),
        orderBy('pointsRequired', 'asc')
      );
      const rewardTasksSnapshot = await getDocs(rewardTasksQuery);

      const rewardTasks = [];
      rewardTasksSnapshot.forEach((doc) => {
        rewardTasks.push({ id: doc.id, ...doc.data() });
      });

      if (rewardTasks.length === 0) {
        setNextReward(null);
        return;
      }

      const nextRewardTier = rewardTasks.find(reward => {
        const isClaimed = claimedRewards.some(
          claimed => claimed.rewardId === reward.id && claimed.status === 'active'
        );
        return !isClaimed && points < reward.pointsRequired;
      });

      if (nextRewardTier) {
        setNextReward({
          ...nextRewardTier,
          pointsNeeded: nextRewardTier.pointsRequired - points,
          progress: (points / nextRewardTier.pointsRequired) * 100,
        });
      } else {
        const unclaimedReward = rewardTasks.find(reward => {
          const isClaimed = claimedRewards.some(
            claimed => claimed.rewardId === reward.id && claimed.status === 'active'
          );
          return !isClaimed && points >= reward.pointsRequired;
        });

        if (unclaimedReward) {
          setNextReward({
            ...unclaimedReward,
            pointsNeeded: 0,
            progress: 100,
            canClaim: true,
          });
        } else {
          const highestTier = rewardTasks[rewardTasks.length - 1];
          setNextReward({
            ...highestTier,
            pointsNeeded: 0,
            progress: 100,
            allUnlocked: true,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user rewards:', error);
    }
  };

  const generateNotifications = async () => {
    const notifs = [];
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    try {
      const userId = auth.currentUser?.uid || params.uid;

      if (!userId) {
        setNotifications([]);
        setHasUnreadNotifications(false);
        return;
      }

      // Check for unpaid bills
      const billQuery = query(
        collection(db, 'garbageCollections'),
        where('status', '==', 'Unpaid'),
        where('month', '==', currentMonth)
      );
      const billSnapshot = await getDocs(billQuery);

      if (!billSnapshot.empty) {
        let totalAmount = 0;
        billSnapshot.forEach((doc) => {
          const data = doc.data();
          totalAmount += parseFloat(data.totalCost) || 0;
        });

        notifs.push({
          id: 'payment-' + Date.now(),
          type: 'payment',
          title: 'Payment Due',
          message: `You have an unpaid bill of ${totalAmount.toFixed(2)} for ${currentMonth}`,
          timestamp: new Date().toISOString(),
          priority: 'high',
          action: 'pay',
        });
      }

      // Check for scheduled pickups
      const scheduleQuery = query(
        collection(db, 'schedules'),
        where('userId', '==', userId),
        where('status', '==', 'Scheduled')
      );
      const scheduleSnapshot = await getDocs(scheduleQuery);

      scheduleSnapshot.forEach((doc) => {
        const data = doc.data();
        notifs.push({
          id: 'schedule-' + doc.id,
          type: 'schedule',
          title: 'Upcoming Pickup',
          message: `${data.wasteType} waste pickup scheduled for ${data.preferredDate} at ${data.preferredTime}`,
          timestamp: data.createdAt || new Date().toISOString(),
          priority: 'medium',
          action: 'view',
        });
      });

      // Sort by priority and timestamp
      notifs.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setNotifications(notifs);
      setHasUnreadNotifications(notifs.length > 0);
    } catch (error) {
      console.error('Error generating notifications:', error);
      setNotifications([]);
      setHasUnreadNotifications(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchLatestCollection(),
        fetchCurrentBill(),
        fetchNextSchedule(),
        fetchUserRewards(),
      ]);
      await generateNotifications();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchUserData();
    fetchData();
  };

  return {
    latestCollection,
    nextSchedule,
    currentBill,
    currentPoints,
    nextReward,
    loading,
    notifications,
    hasUnreadNotifications,
    userData,
    fetchUserData,
    refreshData,
  };
};