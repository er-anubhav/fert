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

  try {
    const timestamp = Date.now();
    const humanReadable = new Date(timestamp).toLocaleString();
    
    // Log the motion detection
    console.log("Motion detected:", humanReadable, `(${timestamp})`);
    console.log("Request body:", req.body);
    
    // You can add additional processing here:
    // - Store to database
    // - Send notifications
    // - Trigger other actions
    
    res.status(200).json({ 
      ok: true, 
      timestamp,
      message: `Motion detected at ${humanReadable}`
    });
  } catch (error) {
    console.error('Error processing motion detection:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Internal server error' 
    });
  }
}