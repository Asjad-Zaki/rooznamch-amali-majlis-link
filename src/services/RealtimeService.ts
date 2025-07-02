
interface RealtimeData {
  tasks: any[];
  notifications: any[];
  users: any[];
  timestamp: number;
}

class RealtimeService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectInterval: number = 3000; // Reduced interval for faster sync
  private maxReconnectAttempts: number = 10;
  private reconnectAttempts: number = 0;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // Simulate server-sent events using localStorage and window events
  initialize() {
    console.log('RealtimeService initializing...');
    this.setupStorageListener();
    this.startHeartbeat();
    this.setupVisibilityListener();
  }

  private setupStorageListener() {
    // Listen for storage changes (cross-tab/device communication)
    window.addEventListener('storage', (event) => {
      if (event.key === 'realtime_data' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          console.log('Storage event received:', data);
          this.notifyListeners('data_update', data);
        } catch (error) {
          console.error('Error parsing realtime data:', error);
        }
      }
    });

    // Also listen for custom events within the same tab
    window.addEventListener('realtime_update', ((event: CustomEvent) => {
      console.log('Custom event received:', event.detail);
      this.notifyListeners('data_update', event.detail);
    }) as EventListener);

    // Handle page focus to sync data
    window.addEventListener('focus', () => {
      this.syncOnFocus();
    });
  }

  private setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Page became visible, sync data
        this.syncOnFocus();
      }
    });
  }

  private syncOnFocus() {
    // When page gains focus, check for latest data
    const latestData = localStorage.getItem('realtime_data');
    if (latestData) {
      try {
        const data = JSON.parse(latestData);
        console.log('Syncing on focus:', data);
        this.notifyListeners('data_update', data);
      } catch (error) {
        console.error('Error syncing on focus:', error);
      }
    }
  }

  private startHeartbeat() {
    // Clear existing interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.broadcastUpdate({
        type: 'heartbeat',
        timestamp: Date.now()
      });
    }, 15000); // Every 15 seconds for faster sync
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
      source: window.location.href,
      id: Math.random().toString(36).substr(2, 9)
    };

    console.log('Broadcasting update:', updateData);

    // Store in localStorage for cross-tab/device communication
    try {
      localStorage.setItem('realtime_data', JSON.stringify(updateData));
      localStorage.setItem('last_update_timestamp', updateData.timestamp.toString());
    } catch (error) {
      console.error('Error storing realtime data:', error);
    }

    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('realtime_update', { detail: updateData }));

    // Also trigger storage event manually for same-tab synchronization
    setTimeout(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'realtime_data',
        newValue: JSON.stringify(updateData),
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href
      }));
    }, 100);
  }

  // Method to force sync latest data
  forceSync() {
    const latestData = localStorage.getItem('realtime_data');
    if (latestData) {
      try {
        const data = JSON.parse(latestData);
        this.notifyListeners('data_update', data);
      } catch (error) {
        console.error('Error in force sync:', error);
      }
    }
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
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeService();
