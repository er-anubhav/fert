// Example usage in your React app
// You can add this to your SecurityCamera component or create a motion detection service

export class MotionNotificationService {
  private apiUrl: string;

  constructor(baseUrl?: string) {
    // Use your Vercel domain or localhost for development
    this.apiUrl = baseUrl || (process.env.NODE_ENV === 'production' 
      ? 'https://fertobot.vercel.app/api/motion' 
      : 'http://localhost:3000/api/motion');
  }

  async sendMotionAlert(deviceId?: string, location?: string): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: deviceId || 'camera-1',
          location: location || 'front-yard',
          timestamp: Date.now(),
          source: 'security-camera'
        })
      });

      const result = await response.json();
      
      if (result.ok) {
        console.log('Motion alert sent successfully:', result.message);
        return true;
      } else {
        console.error('Failed to send motion alert:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error sending motion alert:', error);
      return false;
    }
  }

  // For testing purposes
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.sendMotionAlert('test-device', 'test-location');
      return response;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Usage example:
// const motionService = new MotionNotificationService();
// motionService.sendMotionAlert('camera-main', 'front-door');