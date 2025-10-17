export const formatDate = (dateString) => {
  try {
    const [day, month, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    const options = { month: 'short', day: 'numeric', weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
};

export const getStatusBadgeStyle = (status, styles) => {
  switch(status) {
    case 'Scheduled':
      return [styles.statusBadge, styles.statusScheduled];
    case 'Pending':
      return [styles.statusBadge, styles.statusPending];
    case 'Completed':
      return [styles.statusBadge, styles.statusCompleted];
    default:
      return [styles.statusBadge, styles.statusPending];
  }
};

export const rewardIcons = [
  { id: 'percent', label: 'Discount', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'recycle', label: 'Eco Reward', color: '#10B981', bg: '#D1FAE5' },
  { id: 'trending', label: 'Bonus', color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'award', label: 'Premium', color: '#A855F7', bg: '#E9D5FF' },
];