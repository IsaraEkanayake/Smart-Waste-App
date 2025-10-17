export class Bin {
  constructor(data = {}) {
    this.id = data.id || '';
    this.location = data.location || '';
    this.weight = data.weight || '0';
    this.fillLevel = data.fillLevel || 0;
    this.status = data.status || 'NORMAL';
    this.assignedCollector = data.assignedCollector || null;
    this.lastCollection = data.lastCollection || null;
    this.createdAt = data.createdAt || new Date();
  }

  getStatusColor() {
    switch (this.status?.toUpperCase()) {
      case 'FULL':
        return '#FF4444';
      case 'WARNING':
        return '#FFA726';
      case 'NORMAL':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  }

  needsCollection() {
    return this.status === 'FULL' || this.fillLevel >= 80;
  }

  toFirestore() {
    return {
      location: this.location,
      weight: this.weight,
      fillLevel: this.fillLevel,
      status: this.status,
      assignedCollector: this.assignedCollector,
      lastCollection: this.lastCollection,
      createdAt: this.createdAt
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Bin({
      id: doc.id,
      ...data
    });
  }
}