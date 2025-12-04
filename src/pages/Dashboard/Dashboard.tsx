import React, { useState } from 'react';
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

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [notificationDialog, setNotificationDialog] = useState(false);
  
  const quickActions = [
    { label: 'Start Irrigation', icon: WaterIcon, color: 'primary', action: () => console.log('Start irrigation') },
    { label: 'View Cameras', icon: SecurityIcon, color: 'secondary', action: () => window.location.href = '/security' },
    { label: 'Check Probes', icon: SensorsIcon, color: 'success', action: () => window.location.href = '/probes' },
    { label: 'Bluetooth Setup', icon: BluetoothIcon, color: 'info', action: () => window.location.href = '/bluetooth' },
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
    >
      <Box sx={{ mb: 4 }}>
        <motion.div variants={animationVariants.fadeIn}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Farm Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time monitoring and insights powered by FertoBot
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
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Grid item xs={6} sm={3} key={index}>
                      <Button
                        variant="outlined"
                        color={action.color as any}
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

      <Grid container spacing={3}>
        {/* Summary Cards Row */}
        <Grid item xs={12}>
          <motion.div variants={animationVariants.fadeIn}>
            <SummaryCards />
          </motion.div>
        </Grid>

        {/* Main Content Row */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Live Charts */}
            <Grid item xs={12}>
              <motion.div variants={animationVariants.slideIn}>
                <LiveCharts />
              </motion.div>
            </Grid>

            {/* Recommendations Panel */}
            <Grid item xs={12}>
              <motion.div variants={animationVariants.slideIn}>
                <RecommendationsPanel />
              </motion.div>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Weather Widget */}
            <Grid item xs={12}>
              <motion.div variants={animationVariants.scaleIn}>
                <WeatherWidget />
              </motion.div>
            </Grid>

            {/* Connectivity Status */}
            <Grid item xs={12}>
              <motion.div variants={animationVariants.scaleIn}>
                <ConnectivityStatus />
              </motion.div>
            </Grid>

            {/* Alerts Panel */}
            <Grid item xs={12}>
              <motion.div variants={animationVariants.scaleIn}>
                <AlertsPanel />
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
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