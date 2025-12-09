import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  useTheme,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Water as WaterIcon,
  Security as SecurityIcon,
  Sensors as SensorsIcon,
  Bluetooth as BluetoothIcon,
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Mic as MicIcon,
} from '@mui/icons-material';
import PWAInstallButton from '../../components/PWA/PWAInstallButton';
import SummaryCards from '../../components/Dashboard/SummaryCards';
import LiveCharts from '../../components/Dashboard/LiveCharts';
import RecommendationsPanel from '../../components/Dashboard/RecommendationsPanel';
import AlertsPanel from '../../components/Dashboard/AlertsPanel';
import WeatherWidget from '../../components/Dashboard/WeatherWidget';
import ConnectivityStatus from '../../components/Dashboard/ConnectivityStatus';
import { MotionNotificationService } from '../../services/motionNotificationService';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [motionNotification, setMotionNotification] = useState<{
    open: boolean;
    message: string;
    timestamp: Date | null;
  }>({
    open: false,
    message: '',
    timestamp: null,
  });
  
  // Initialize motion service
  const motionService = new MotionNotificationService();

  // Request notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location as last resort
      window.location.href = path;
    }
  };



  // Listen for external motion events (PowerShell, ESP32, etc.)
  useEffect(() => {
    let lastChecked = Date.now() - 30000; // Check last 30 seconds on start
    
    const checkForExternalMotion = async () => {
      try {
        const response = await fetch(`https://fertobot.vercel.app/api/motion?since=${lastChecked}`);
        if (response.ok) {
          const data = await response.json();
          
          if (data.hasNewMotion && data.motion) {
            const motion = data.motion;
            
            setMotionNotification({
              open: true,
              message: `Motion detected by ${motion.device} at ${motion.location}`,
              timestamp: new Date(motion.timestamp),
            });
            
            console.log('🚨 EXTERNAL MOTION DETECTED:', motion);
            
            // Show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('🚨 External Motion Detected!', {
                body: `Motion by ${motion.device} at ${motion.location}`,
                icon: '/images/icon-192x192.png'
              });
            }
            
            lastChecked = motion.timestamp;
          }
        }
      } catch (error) {
        // Silently handle polling errors
        console.log('Motion polling error (this is normal):', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    // Check every 3 seconds for external motion events
    const interval = setInterval(checkForExternalMotion, 3000);
    
    // Check immediately
    checkForExternalMotion();
    
    return () => clearInterval(interval);
  }, []);

  // Motion notifications will come from:
  // 1. Manual "Test Motion" button clicks
  // 2. ESP32 API calls (check Vercel console logs)

  const handleCloseMotionNotification = () => {
    setMotionNotification(prev => ({ ...prev, open: false }));
  };

  const quickActions = [
    { label: 'Start Irrigation', icon: WaterIcon, color: 'primary' as const, action: () => handleNavigation('/irrigation') },
    { label: 'View Cameras', icon: SecurityIcon, color: 'secondary' as const, action: () => handleNavigation('/security') },
    { label: 'Check Probes', icon: SensorsIcon, color: 'success' as const, action: () => handleNavigation('/probes') },
    { label: 'Bluetooth Setup', icon: BluetoothIcon, color: 'info' as const, action: () => handleNavigation('/bluetooth') },
  ];
  
  const recentNotifications = [
    { id: 1, title: 'Low Battery Alert', message: 'West Garden Monitor battery at 15%', time: '5 min ago', severity: 'warning' },
    { id: 2, title: 'Irrigation Complete', message: 'North Field watering cycle finished', time: '12 min ago', severity: 'success' },
    { id: 3, title: 'Motion Detected', message: 'Security camera detected movement', time: '18 min ago', severity: 'info' },
  ];
  
  return (
    <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <Box sx={{ 
        mb: 0.5,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 500, mb: 0.125 }}>
                Farm Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                powered by FertoBot v1
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    top: 9,
                    right: 10,
                    width: 17,
                    height: 17,
                    fontSize: '0.75rem',
                    lineHeight: 1.5,
                  }
                }}
              >
                <IconButton onClick={() => setNotificationDialog(true)}>
                  <NotificationsIcon />
                </IconButton>
              </Badge>
              <IconButton onClick={() => navigate('/voice-chatbot')} aria-label="Voice Chatbot">
                <MicIcon />
              </IconButton>
              <IconButton onClick={() => window.location.reload()}>
                <RefreshIcon />
              </IconButton>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.75,
                backgroundColor: 'rgba(255, 152, 0, 0.05)',
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                border: '1px solid rgba(255, 152, 0, 0.15)'
              }}>
                <WarningIcon sx={{ fontSize: 16, color: 'rgba(255, 152, 0, 0.8)' }} />
                <Box>
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    color: 'rgba(255, 152, 0, 0.9)',
                    lineHeight: 1.5,
                    mb: 0.25
                  }}>
                    Probe Disconnected
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.75rem', 
                    color: 'text.secondary',
                    display: 'block',
                    lineHeight: 1.5 
                  }}>
                    Last: 3.12.2025 14:37
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
      </Box>

      {/* Weather Widget - Environmental Overview */}
      <div style={{ marginBottom: '16px' }}>
        <WeatherWidget />
      </div>

      {/* Connectivity Status - Device Health */}
      <div style={{ marginBottom: '16px' }}>
        <ConnectivityStatus />
      </div>

      {/* Summary Cards Row - Outside Grid to remove padding */}
      <div style={{ marginBottom: '24px' }}>
        <SummaryCards />
      </div>

      {/* Main Content Section - Flex Column Layout */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 2,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        '& > *': {
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }
      }}>
        {/* 1. Alerts Panel - Most Critical First */}
        <div>
          <AlertsPanel />
        </div>

        {/* 2. Recommendations Panel - Actionable Insights */}
        <div>
          <RecommendationsPanel />
        </div>

        {/* 3. Live Charts - Current Data */}
        <div>
          <LiveCharts />
        </div>
      </Box>
      
      {/* Motion Detection Notification */}
      <Snackbar
        open={motionNotification.open}
        autoHideDuration={6000}
        onClose={handleCloseMotionNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: { xs: 80, sm: 80 } }}
      >
        <Alert 
          onClose={handleCloseMotionNotification} 
          severity="warning" 
          variant="filled"
          sx={{ 
            width: '100%',
            backgroundColor: '#fff3cd',
            color: '#856404',
            '& .MuiAlert-icon': {
              color: '#856404'
            },
            '& .MuiAlert-action': {
              color: '#856404'
            }
          }}
        >
          🚨 {motionNotification.message}
          {motionNotification.timestamp && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.9 }}>
              {motionNotification.timestamp.toLocaleString()}
            </Typography>
          )}
        </Alert>
      </Snackbar>
      
      {/* Notification Dialog */}
      <Dialog 
        open={notificationDialog} 
        onClose={() => setNotificationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon />
            Recent Notifications
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List>
            {recentNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: notification.severity === 'warning' ? 'warning.main' : 
                                 notification.severity === 'success' ? 'success.main' : 'info.main' 
                      }}
                    >
                      {notification.severity === 'warning' ? <WarningIcon /> : 
                       notification.severity === 'success' ? <CheckCircleIcon /> : <NotificationsIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.title}
                    secondary={(
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </>
                    )}
                  />
                </ListItem>
                {index < recentNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDialog(false)}>Close</Button>
          <Button variant="contained">View All</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;