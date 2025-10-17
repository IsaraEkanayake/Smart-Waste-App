import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

/**
 * Awards points to user based on payment amount
 * Formula: 1 point per garbage collection payment
 */
export const awardPointsForPayment = async (auth, numberOfCollections = 1) => {
  try {
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      console.error('No user logged in');
      return 0;
    }

    const userRewardsRef = doc(db, 'userRewards', userId);
    const userRewardsSnap = await getDoc(userRewardsRef);

    const pointsToAdd = numberOfCollections; // 1 point per collection

    if (userRewardsSnap.exists()) {
      const currentData = userRewardsSnap.data();
      const newTotalPoints = (currentData.totalPoints || 0) + pointsToAdd;

      await updateDoc(userRewardsRef, {
        totalPoints: newTotalPoints,
        lastPointsEarned: pointsToAdd,
        lastPointsEarnedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });

      console.log(`Added ${pointsToAdd} points. New total: ${newTotalPoints}`);
      return pointsToAdd;
    } else {
      await setDoc(userRewardsRef, {
        userId,
        totalPoints: pointsToAdd,
        lastPointsEarned: pointsToAdd,
        lastPointsEarnedDate: new Date().toISOString(),
        redeemedRewards: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });

      console.log(`Created rewards record with ${pointsToAdd} initial points`);
      return pointsToAdd;
    }
  } catch (error) {
    console.error('Error awarding points:', error);
    return 0;
  }
};