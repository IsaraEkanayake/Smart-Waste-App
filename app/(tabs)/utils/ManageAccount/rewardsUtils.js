export const getProgressPercentage = (currentPoints, pointsRequired) => {
  return Math.min((currentPoints / pointsRequired) * 100, 100);
};

export const getRemainingPoints = (currentPoints, pointsRequired) => {
  return Math.max(pointsRequired - currentPoints, 0);
};