export class Collection {
  constructor(data = {}) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.residentName = data.residentName || '';
    this.residentAddress = data.residentAddress || '';
    this.residentPhone = data.residentPhone || '';
    this.collectionDate = data.collectionDate || '';
    this.month = data.month || '';
    this.organicWaste = data.organicWaste || '0';
    this.recyclableWaste = data.recyclableWaste || '0';
    this.otherWaste = data.otherWaste || '0';
    this.totalWeight = data.totalWeight || '0';
    this.totalCost = data.totalCost || '0';
    this.status = data.status || 'Unpaid';
    this.createdAt = data.createdAt || new Date();
  }

  getTotalWeight() {
    return parseFloat(this.organicWaste) + parseFloat(this.recyclableWaste) + parseFloat(this.otherWaste);
  }

  getTotalCost() {
    return parseFloat(this.totalCost) || 0;
  }

  isPaid() {
    return this.status === 'Paid';
  }

  toFirestore() {
    return {
      userId: this.userId,
      residentName: this.residentName,
      residentAddress: this.residentAddress,
      residentPhone: this.residentPhone,
      collectionDate: this.collectionDate,
      month: this.month,
      organicWaste: this.organicWaste,
      recyclableWaste: this.recyclableWaste,
      otherWaste: this.otherWaste,
      totalWeight: this.getTotalWeight().toString(),
      totalCost: this.getTotalCost().toString(),
      status: this.status,
      createdAt: this.createdAt
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Collection({
      id: doc.id,
      ...data
    });
  }
}