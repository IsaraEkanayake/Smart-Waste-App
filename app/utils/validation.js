export const Validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone) => {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    return phoneRegex.test(phone);
  },

  password: (password) => {
    return password.length >= 6;
  },

  binId: (binId) => {
    return binId && binId.startsWith('ID-');
  }
};