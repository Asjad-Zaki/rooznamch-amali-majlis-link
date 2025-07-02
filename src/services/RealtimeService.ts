
interface RealtimeData {
  tasks: any[];
  notifications: any[];
  users: any[];
  timestamp: number;
}

class RealtimeService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectInterval: number = 1000; // Faster sync
  private maxReconnectAttempts: number = 10;
  private reconnectAttempts: number = 0;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private syncInterval: NodeJS.Timeout | null = null;

  // Enhanced real-time service with better cross-device sync
  initialize() {
    console.log('RealtimeService initializing with enhanced sync...');
    this.setupStorageListener();
    this.startHeartbeat();
    this.startContinuousSync();
    this.setupVisibilityListener();
    this.setupUnloadListener();
  }

  private setupStorageListener() {
    // Listen for storage changes (cross-device communication)
    window.addEventListener('storage', (event) => {
      if (event.key?.startsWith('realtime_') && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          console.log('Cross-device storage event received:', data);
          this.notifyListeners('data_update', data);
        } catch (error) {
          console.error('Error parsing realtime data:', error);
        }
      }
    });

    // Custom events for same-tab communication
    window.addEventListener('realtime_update', ((event: CustomEvent) => {
      console.log('Same-tab custom event received:', event.detail);
      this.notifyListeners('data_update', event.detail);
    }) as EventListener);

    // Focus event for immediate sync
    window.addEventListener('focus', () => {
      console.log('Window focused - syncing data');
      this.syncOnFocus();
    });

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('Page visible - syncing data');
        this.syncOnFocus();
      }
    });
  }

  private setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.forceSync();
      }
    });
  }

  private setupUnloadListener() {
    window.addEventListener('beforeunload', () => {
      // Broadcast final state before page unload
      this.broadcastCurrentState();
    });
  }

  private syncOnFocus() {
    // Sync all data types when page gains focus
    const dataTypes = ['tasks', 'notifications', 'users'];
    dataTypes.forEach(type => {
      const latestData = localStorage.getItem(`app_${type}`);
      if (latestData) {
        try {
          const data = JSON.parse(latestData);
          const updateData = {
            type: `${type}_sync`,
            [type]: data,
            timestamp: Date.now(),
            source: 'focus_sync'
          };
          console.log(`Syncing ${type} on focus:`, updateData);
          this.notifyListeners('data_update', updateData);
        } catch (error) {
          console.error(`Error syncing ${type} on focus:`, error);
        }
      }
    });
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.broadcastUpdate({
        type: 'heartbeat',
        timestamp: Date.now(),
        source: 'heartbeat'
      });
    }, 5000); // Every 5 seconds for faster sync
  }

  private startContinuousSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.forceSync();
    }, 3000); // Sync every 3 seconds
  }

  private broadcastCurrentState() {
    const tasks = localStorage.getItem('app_tasks');
    const notifications = localStorage.getItem('app_notifications');
    const users = localStorage.getItem('app_users');

    if (tasks || notifications || users) {
      const state = {
        type: 'state_broadcast',
        tasks: tasks ? JSON.parse(tasks) : [],
        notifications: notifications ? JSON.parse(notifications) : [],
        users: users ? JSON.parse(users) : [],
        timestamp: Date.now(),
        source: 'state_broadcast'
      };
      this.broadcastUpdate(state);
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
      }
    };
  }

  private notifyListeners(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in listener callback:', error);
        }
      });
    }
  }

  broadcastUpdate(data: any) {
    const updateData = {
      ...data,
      timestamp: Date.now(),
      source: data.source || window.location.href,
      id: Math.random().toString(36).substr(2, 9),
      deviceId: this.getDeviceId()
    };

    console.log('Broadcasting enhanced update:', updateData);

    // Store with unique keys for better cross-device sync
    try {
      const storageKey = `realtime_${updateData.type}_${Date.now()}`;
      localStorage.setItem(storageKey, JSON.stringify(updateData));
      localStorage.setItem('last_update_timestamp', updateData.timestamp.toString());
      
      // Clean old realtime entries
      this.cleanOldRealtimeEntries();
    } catch (error) {
      console.error('Error storing realtime data:', error);
    }

    // Dispatch custom event for same-tab
    window.dispatchEvent(new CustomEvent('realtime_update', { detail: updateData }));

    // Force storage event for same-tab sync
    setTimeout(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: `realtime_${updateData.type}`,
        newValue: JSON.stringify(updateData),
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href
      }));
    }, 50);
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  private cleanOldRealtimeEntries() {
    const now = Date.now();
    const maxAge = 60000; // 1 minute

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('realtime_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.timestamp && (now - data.timestamp) > maxAge) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      }
    });
  }

  forceSync() {
    console.log('Force syncing all data...');
    this.broadcastCurrentState();
    
    // Also trigger listeners with current data
    const dataTypes = ['tasks', 'notifications', 'users'];
    dataTypes.forEach(type => {
      const data = localStorage.getItem(`app_${type}`);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          this.notifyListeners('data_update', {
            type: `${type}_force_sync`,
            [type]: parsedData,
            timestamp: Date.now()
          });
        } catch (error) {
          console.error(`Error in force sync for ${type}:`, error);
        }
      }
    });
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeService();
