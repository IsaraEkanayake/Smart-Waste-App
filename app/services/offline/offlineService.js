import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export class OfflineService {
  constructor() {
    this.isOnline = true;
    this.pendingActions = [];
    this.setupNetworkListener();
  }

  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected;
      
      if (this.isOnline && this.pendingActions.length > 0) {
        this.processPendingActions();
      }
    });
  }

  async queueAction(action) {
    if (this.isOnline) {
      return await action();
    } else {
      // Store action for later execution
      this.pendingActions.push({
        action,
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9),
      });
      
      await this.savePendingActions();
      return { success: false, queued: true };
    }
  }

  async processPendingActions() {
    const actionsToProcess = [...this.pendingActions];
    this.pendingActions = [];
    
    for (const queuedAction of actionsToProcess) {
      try {
        await queuedAction.action();
        console.log('Processed queued action:', queuedAction.id);
      } catch (error) {
        console.error('Failed to process queued action:', error);
        // Re-queue failed actions
        this.pendingActions.push(queuedAction);
      }
    }
    
    await this.savePendingActions();
  }

  async savePendingActions() {
    try {
      await AsyncStorage.setItem('@pending_actions', JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  }

  async loadPendingActions() {
    try {
      const stored = await AsyncStorage.getItem('@pending_actions');
      if (stored) {
        this.pendingActions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  }

  async cacheData(key, data) {
    try {
      await AsyncStorage.setItem(`@cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  async getCachedData(key, maxAge = 5 * 60 * 1000) { // 5 minutes default
    try {
      const stored = await AsyncStorage.getItem(`@cache_${key}`);
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        
        if (Date.now() - timestamp < maxAge) {
          return data;
        } else {
          // Cache expired
          await AsyncStorage.removeItem(`@cache_${key}`);
        }
      }
    } catch (error) {
      console.error('Failed to get cached data:', error);
    }
    
    return null;
  }

  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('@cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}

export const offlineService = new OfflineService();