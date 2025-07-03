
interface RealtimeData {
  tasks: any[];
  notifications: any[];
  users: any[];
  timestamp: number;
}

class RealtimeService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectInterval: number = 1000; // More frequent sync
  private maxReconnectAttempts: number = 15;
  private reconnectAttempts: number = 0;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private lastSyncTimestamp: number = 0;
  private syncCheckInterval: NodeJS.Timeout | null = null;

  // Enhanced real-time service with aggressive cross-device sync
  initialize() {
    console.log('RealtimeService initializing with aggressive cross-device sync...');
    this.setupBroadcastChannel();
    this.setupStorageListener();
    this.startHeartbeat();
    this.startContinuousSync();
    this.startSyncChecker();
    this.setupVisibilityListener();
    this.setupUnloadListener();
    this.setupNetworkListener();
    this.setupFocusListener();
  }

  private setupBroadcastChannel() {
    try {
      this.broadcastChannel = new BroadcastChannel('majlis_realtime_sync');
      this.broadcastChannel.addEventListener('message', (event) => {
        console.log('BroadcastChannel message received:', event.data);
        this.handleRealtimeUpdate(event.data);
      });
    } catch (error) {
      console.log('BroadcastChannel not supported, using fallback methods');
    }
  }

  private setupFocusListener() {
    // Multiple focus detection methods
    window.addEventListener('focus', () => {
      console.log('Window focused - immediate sync');
      this.immediateSync();
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('Page visible - immediate sync');
        this.immediateSync();
      }
    });

    // Page show event for mobile browsers
    window.addEventListener('pageshow', () => {
      console.log('Page shown - immediate sync');
      this.immediateSync();
    });
  }

  private setupNetworkListener() {
    window.addEventListener('online', () => {
      console.log('Network back online - forcing comprehensive sync');
      setTimeout(() => this.comprehensiveSync(), 500);
    });

    window.addEventListener('offline', () => {
      console.log('Network offline - will sync when back online');
    });
  }

  private setupStorageListener() {
    // Enhanced storage listener for cross-device communication
    window.addEventListener('storage', (event) => {
      if (event.key?.startsWith('majlis_') && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          console.log('Cross-device storage event received:', event.key, data);
          
          // Handle different data types
          if (event.key === 'majlis_tasks') {
            this.handleRealtimeUpdate({ type: 'tasks_sync', tasks: data, timestamp: Date.now() });
          } else if (event.key === 'majlis_notifications') {
            this.handleRealtimeUpdate({ type: 'notifications_sync', notifications: data, timestamp: Date.now() });
          } else if (event.key === 'majlis_users') {
            this.handleRealtimeUpdate({ type: 'users_sync', users: data, timestamp: Date.now() });
          }
        } catch (error) {
          console.error('Error parsing storage event data:', error);
        }
      }
    });

    // Custom events for same-tab communication
    window.addEventListener('majlis_update', ((event: CustomEvent) => {
      console.log('Same-tab custom event received:', event.detail);
      this.handleRealtimeUpdate(event.detail);
    }) as EventListener);
  }

  private handleRealtimeUpdate(data: any) {
    // Don't ignore any updates - sync everything
    console.log('Processing realtime update:', data);
    this.lastSyncTimestamp = data.timestamp || Date.now();
    this.notifyListeners('data_update', data);
  }

  private setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('Page became visible - comprehensive sync');
        this.comprehensiveSync();
      }
    });
  }

  private setupUnloadListener() {
    window.addEventListener('beforeunload', () => {
      // Broadcast final state before page unload
      this.broadcastCurrentState();
    });
  }

  private immediateSync() {
    console.log('Performing immediate sync...');
    this.comprehensiveSync();
    // Force multiple sync attempts
    setTimeout(() => this.comprehensiveSync(), 500);
    setTimeout(() => this.comprehensiveSync(), 1000);
  }

  private comprehensiveSync() {
    console.log('Performing comprehensive sync...');
    
    // Sync all data types with current localStorage data
    const dataTypes = ['tasks', 'notifications', 'users'];
    dataTypes.forEach(type => {
      const latestData = localStorage.getItem(`majlis_${type}`);
      if (latestData) {
        try {
          const data = JSON.parse(latestData);
          const updateData = {
            type: `${type}_comprehensive_sync`,
            [type]: data,
            timestamp: Date.now(),
            source: 'comprehensive_sync'
          };
          console.log(`Comprehensive syncing ${type}:`, data.length || 0, 'items');
          this.handleRealtimeUpdate(updateData);
          this.broadcastUpdate(updateData);
        } catch (error) {
          console.error(`Error in comprehensive sync for ${type}:`, error);
        }
      }
    });
  }

  private startSyncChecker() {
    // Check for sync every 1 second
    this.syncCheckInterval = setInterval(() => {
      this.comprehensiveSync();
    }, 1000);
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
      // Also perform sync on heartbeat
      this.comprehensiveSync();
    }, 2000); // Every 2 seconds
  }

  private startContinuousSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.comprehensiveSync();
    }, 1500); // Sync every 1.5 seconds
  }

  private broadcastCurrentState() {
    const tasks = localStorage.getItem('majlis_tasks');
    const notifications = localStorage.getItem('majlis_notifications');
    const users = localStorage.getItem('majlis_users');

    const state = {
      type: 'state_broadcast',
      tasks: tasks ? JSON.parse(tasks) : [],
      notifications: notifications ? JSON.parse(notifications) : [],
      users: users ? JSON.parse(users) : [],
      timestamp: Date.now(),
      source: 'state_broadcast'
    };
    
    console.log('Broadcasting current state:', state);
    this.broadcastUpdate(state);
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

    // Multiple broadcast methods for better reliability
    
    // Method 1: BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(updateData);
      } catch (error) {
        console.error('Error broadcasting via BroadcastChannel:', error);
      }
    }

    // Method 2: Storage events
    try {
      const storageKey = `majlis_sync_${Date.now()}_${Math.random()}`;
      localStorage.setItem(storageKey, JSON.stringify(updateData));
      localStorage.setItem('majlis_last_update', updateData.timestamp.toString());
      
      // Clean old sync entries immediately
      setTimeout(() => this.cleanOldSyncEntries(), 100);
    } catch (error) {
      console.error('Error storing realtime data:', error);
    }

    // Method 3: Custom event
    window.dispatchEvent(new CustomEvent('majlis_update', { detail: updateData }));

    // Method 4: Force storage event for cross-tab sync
    setTimeout(() => {
      try {
        window.dispatchEvent(new StorageEvent('storage', {
          key: `majlis_force_sync`,
          newValue: JSON.stringify(updateData),
          oldValue: null,
          storageArea: localStorage,
          url: window.location.href
        }));
      } catch (error) {
        console.error('Error dispatching storage event:', error);
      }
    }, 50);
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('majlis_device_id');
    if (!deviceId) {
      deviceId = Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('majlis_device_id', deviceId);
    }
    return deviceId;
  }

  private cleanOldSyncEntries() {
    const now = Date.now();
    const maxAge = 60000; // 1 minute

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('majlis_sync_')) {
        try {
          const timestamp = parseInt(key.split('_')[2]);
          if (timestamp && (now - timestamp) > maxAge) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Remove problematic keys
          localStorage.removeItem(key);
        }
      }
    });
  }

  forceSync() {
    console.log('Force syncing all data with enhanced methods...');
    this.comprehensiveSync();
    
    // Broadcast current state multiple times
    setTimeout(() => this.broadcastCurrentState(), 100);
    setTimeout(() => this.broadcastCurrentState(), 500);
    setTimeout(() => this.broadcastCurrentState(), 1000);
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
    if (this.syncCheckInterval) {
      clearInterval(this.syncCheckInterval);
      this.syncCheckInterval = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeService();
