export const Config = {
  // Firebase config
  firebase: {
    collections: {
      users: 'users',
      bins: 'bins',
      collections: 'collections',
      schedules: 'schedules',
      payments: 'payments',
      rewards: 'rewards',
      collectors: 'collectors'
    }
  },
  
  // App config
  app: {
    name: 'Smart Waste Management',
    version: '1.0.0',
    supportEmail: 'support@wastemanagement.com'
  },
  
  // Payment config
  payment: {
    currency: 'USD',
    rewardPointsPerPayment: 1
  },
  
  // Waste types
  wasteTypes: ['Organic', 'Recyclable', 'Electronic', 'Furniture', 'Mixed', 'Other'],
  
  // Units
  units: ['kg', 'bag', 'bucket', 'box']
};