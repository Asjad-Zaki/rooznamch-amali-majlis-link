
interface RealtimeData {
  tasks: any[];
  notifications: any[];
  users: any[];
  timestamp: number;
}

class RealtimeService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 10;
  private reconnectAttempts: number = 0;

  // Simulate server-sent events using localStorage and window events
  initialize() {
    this.setupStorageListener();
    this.startHeartbeat();
  }

  private setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'realtime_data' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          this.notifyListeners('data_update', data);
        } catch (error) {
          console.error('Error parsing realtime data:', error);
        }
      }
    });

    // Also listen for custom events within the same tab
    window.addEventListener('realtime_update', ((event: CustomEvent) => {
      this.notifyListeners('data_update', event.detail);
    }) as EventListener);
  }

  private startHeartbeat() {
    setInterval(() => {
      this.broadcastUpdate({
        type: 'heartbeat',
        timestamp: Date.now()
      });
    }, 30000); // Every 30 seconds
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
      eventListeners.forEach(callback => callback(data));
    }
  }

  broadcastUpdate(data: any) {
    const updateData = {
      ...data,
      timestamp: Date.now(),
      source: window.location.href
    };

    // Store in localStorage for cross-tab communication
    localStorage.setItem('realtime_data', JSON.stringify(updateData));

    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('realtime_update', { detail: updateData }));
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeService();
