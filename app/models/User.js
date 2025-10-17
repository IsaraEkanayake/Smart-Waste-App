export class User {
  constructor(data = {}) {
    this.id = data.id || '';
    this.fullName = data.fullName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.userType = data.userType || 'Resident';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toFirestore() {
    return {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      userType: this.userType,
      createdAt: this.createdAt,
      updatedAt: new Date()
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new User({
      id: doc.id,
      ...data
    });
  }
}