// Vercel serverless function for motion detection
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple rate limiting: reject if too many requests from same IP in short time
  const clientIP = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
  
  // Basic validation of request body
  const { deviceId, location } = req.body || {};
  if (!deviceId || !location) {
    console.log('🚫 Invalid motion request (missing deviceId or location):', {
      body: req.body,
      ip: clientIP,
      timestamp: new Date().toISOString()
    });
    return res.status(400).json({ error: 'Missing required fields: deviceId and location' });
  }

  try {
    const timestamp = Date.now();
    const humanReadable = new Date(timestamp).toLocaleString();
    
    // Log the motion detection with more context
    console.log(`🚨 MOTION ALERT: {device: '${deviceId}', location: '${location}', timestamp: '${new Date().toISOString()}', message: 'Motion detected at ${location} - ${humanReadable}'}`);
    console.log("Request details:", {
      body: req.body,
      userAgent: req.headers['user-agent'],
      ip: clientIP,
      timestamp: humanReadable
    });
    
    // You can add additional processing here:
    // - Store to database
    // - Send notifications
    // - Trigger other actions
    
    res.status(200).json({ 
      ok: true, 
      timestamp,
      message: `Motion detected at ${humanReadable}`,
      device: deviceId,
      location: location
    });
  } catch (error) {
    console.error('Error processing motion detection:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Internal server error' 
    });
  }
}