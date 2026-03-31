interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  onClick?: () => void;
}

class PushNotificationManager {
  private static instance: PushNotificationManager;
  private isSupported: boolean = false;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'default';
  }

  public static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager();
    }
    return PushNotificationManager.instance;
  }

  // Check if push notifications are supported
  public isSupportedBrowser(): boolean {
    return this.isSupported;
  }

  // Get current permission status
  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // Request permission for notifications
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  // Show a push notification
  public showNotification(options: PushNotificationOptions): void {
    if (!this.isSupported || this.permission !== 'granted') {
      return;
    }

    const notificationOptions: NotificationOptions = {
      body: options.body,
      icon: options.icon || '/favicon.ico',
      badge: options.badge || '/favicon.ico',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
    };

    const notification = new Notification(options.title, notificationOptions);

    // Handle click events
    if (options.onClick) {
      notification.onclick = () => {
        options.onClick!();
        notification.close();
      };
    }

    // Auto-close after 5 seconds if not requiring interaction
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }

  // Show notification for new message/activity
  public showActivityNotification(
    userName: string,
    action: string,
    targetTitle?: string,
    userAvatar?: string
  ): void {
    const title = `${userName} ${action}`;
    const body = targetTitle ? targetTitle : 'New activity on your post';
    
    this.showNotification({
      title,
      body,
      icon: userAvatar,
      tag: 'activity',
      requireInteraction: false,
      onClick: () => {
        // Focus the window when notification is clicked
        window.focus();
        // Navigate to notifications page
        window.location.hash = '#/notifications';
      },
    });
  }

  // Show notification for new follower
  public showFollowerNotification(userName: string, userAvatar?: string): void {
    this.showNotification({
      title: 'New Follower!',
      body: `${userName} started following you`,
      icon: userAvatar,
      tag: 'follower',
      requireInteraction: false,
      onClick: () => {
        window.focus();
        window.location.hash = '#/notifications';
      },
    });
  }

  // Show notification for solution posted
  public showSolutionNotification(userName: string, problemTitle: string, userAvatar?: string): void {
    this.showNotification({
      title: 'New Solution Posted!',
      body: `${userName} posted a solution to "${problemTitle}"`,
      icon: userAvatar,
      tag: 'solution',
      requireInteraction: false,
      onClick: () => {
        window.focus();
        window.location.hash = '#/notifications';
      },
    });
  }

  // Show notification for upvotes
  public showUpvoteNotification(userName: string, targetType: 'solution' | 'problem', count: number = 1, userAvatar?: string): void {
    const title = count > 1 ? `${count} new upvotes!` : 'New upvote!';
    const body = count > 1 
      ? `${userName} and ${count - 1} others upvoted your ${targetType}` 
      : `${userName} upvoted your ${targetType}`;
    
    this.showNotification({
      title,
      body,
      icon: userAvatar,
      tag: 'upvote',
      requireInteraction: false,
      onClick: () => {
        window.focus();
        window.location.hash = '#/notifications';
      },
    });
  }
}

export const pushNotificationManager = PushNotificationManager.getInstance();

// Hook for React components
export const usePushNotifications = () => {
  const requestPermission = async (): Promise<boolean> => {
    const permission = await pushNotificationManager.requestPermission();
    return permission === 'granted';
  };

  const isSupported = pushNotificationManager.isSupportedBrowser();
  const permission = pushNotificationManager.getPermissionStatus();

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification: pushNotificationManager.showNotification.bind(pushNotificationManager),
    showActivityNotification: pushNotificationManager.showActivityNotification.bind(pushNotificationManager),
    showFollowerNotification: pushNotificationManager.showFollowerNotification.bind(pushNotificationManager),
    showSolutionNotification: pushNotificationManager.showSolutionNotification.bind(pushNotificationManager),
    showUpvoteNotification: pushNotificationManager.showUpvoteNotification.bind(pushNotificationManager),
  };
};
