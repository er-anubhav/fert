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
} from '@mui/icons-material';
import PWAInstallButton from '../../components/PWA/PWAInstallButton';
import { motion } from 'framer-motion';
import SummaryCards from '../../components/Dashboard/SummaryCards';
import LiveCharts from '../../components/Dashboard/LiveCharts';
import RecommendationsPanel from '../../components/Dashboard/RecommendationsPanel';
import AlertsPanel from '../../components/Dashboard/AlertsPanel';
import WeatherWidget from '../../components/Dashboard/WeatherWidget';
import ConnectivityStatus from '../../components/Dashboard/ConnectivityStatus';
import { animationVariants } from '../../utils/theme';
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

  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location as last resort
      window.location.href = path;
    }
  };

  // Function to simulate motion detection (for testing)
  const testMotionDetection = async () => {
    try {
      const success = await motionService.sendMotionAlert('dashboard-test', 'manual-trigger');
      if (success) {
        const now = new Date();
        setMotionNotification({
          open: true,
          message: `Motion detected from dashboard test at ${now.toLocaleTimeString()}`,
          timestamp: now,
        });
        console.log('🚨 MOTION DETECTED:', {
          source: 'dashboard-test',
          location: 'manual-trigger',
          timestamp: now.toISOString(),
          message: `Motion alert sent successfully at ${now.toLocaleString()}`
        });
      }
    } catch (error) {
      console.error('Motion detection test failed:', error);
    }
  };

  // Motion notifications will now only come from:
  // 1. Manual "Test Motion" button clicks
  // 2. External API calls to https://fertobot.vercel.app/api/motion

  const handleCloseMotionNotification = () => {
    setMotionNotification(prev => ({ ...prev, open: false }));
  };

  const quickActions = [
    { label: 'Start Irrigation', icon: WaterIcon, color: 'primary' as const, action: () => handleNavigation('/irrigation') },
    { label: 'View Cameras', icon: SecurityIcon, color: 'secondary' as const, action: () => handleNavigation('/security') },
    { label: 'Test Motion', icon: NotificationsIcon, color: 'warning' as const, action: testMotionDetection },
    { label: 'Check Probes', icon: SensorsIcon, color: 'success' as const, action: () => handleNavigation('/probes') },
    { label: 'Bluetooth Setup', icon: BluetoothIcon, color: 'info' as const, action: () => handleNavigation('/bluetooth') },
  ];
  
  const recentNotifications = [
    { id: 1, title: 'Low Battery Alert', message: 'West Garden Monitor battery at 15%', time: '5 min ago', severity: 'warning' },
    { id: 2, title: 'Irrigation Complete', message: 'North Field watering cycle finished', time: '12 min ago', severity: 'success' },
    { id: 3, title: 'Motion Detected', message: 'Security camera detected movement', time: '18 min ago', severity: 'info' },
  ];
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.stagger}
      style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}
    >
      <Box sx={{ 
        mb: 1,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <motion.div variants={animationVariants.fadeIn}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Farm Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                powered by FertoBot
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge badgeContent={3} color="error">
                <IconButton onClick={() => setNotificationDialog(true)}>
                  <NotificationsIcon />
                </IconButton>
              </Badge>
              <IconButton onClick={() => window.location.reload()}>
                <RefreshIcon />
              </IconButton>
              <Chip
                label="All Systems Online"
                color="success"
                size="small"
                icon={<CheckCircleIcon />}
              />
            </Box>
          </Box>
        </motion.div>
        
        {/* Quick Actions Panel */}
        <motion.div variants={animationVariants.fadeIn}>
          <Card sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ width: '100%', maxWidth: '100%' }}>
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Grid item xs={6} sm={6} md={3} key={index}>
                      <Button
                        variant="outlined"
                        color={action.color}
                        startIcon={<IconComponent />}
                        onClick={action.action}
                        fullWidth
                        sx={{
                          py: 1.5,
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 1,
                          '& .MuiButton-startIcon': {
                            mx: { xs: 0, sm: 1 },
                            mb: { xs: 0.5, sm: 0 },
                          }
                        }}
                      >
                        {action.label}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Summary Cards Row - Outside Grid to remove padding */}
      <motion.div variants={animationVariants.fadeIn} style={{ marginBottom: '24px' }}>
        <SummaryCards />
      </motion.div>

      {/* Main Content Section - Flex Column Layout */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        mb: 3,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        '& > *': {
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }
      }}>
        {/* Live Charts */}
        <motion.div variants={animationVariants.slideIn}>
          <LiveCharts />
        </motion.div>

        {/* Recommendations Panel */}
        <motion.div variants={animationVariants.slideIn}>
          <RecommendationsPanel />
        </motion.div>

        {/* Weather Widget */}
        <motion.div variants={animationVariants.scaleIn}>
          <WeatherWidget />
        </motion.div>

        {/* Connectivity Status */}
        <motion.div variants={animationVariants.scaleIn}>
          <ConnectivityStatus />
        </motion.div>

        {/* Alerts Panel */}
        <motion.div variants={animationVariants.scaleIn}>
          <AlertsPanel />
        </motion.div>
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
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </Box>
                    }
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
    </motion.div>
  );
};

export default Dashboard;