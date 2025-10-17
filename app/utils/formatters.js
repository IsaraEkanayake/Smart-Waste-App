export const Formatters = {
  formatDate(dateString) {
    try {
      const [day, month, year] = dateString.split('/');
      const date = new Date(year, month - 1, day);
      const options = { month: 'short', day: 'numeric', weekday: 'short' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  formatNotificationTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
};