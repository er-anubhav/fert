import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Badge,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Switch,
  Alert,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  NotificationsActive as AlertIcon,
  Fullscreen as FullscreenIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  MoreVert as MoreVertIcon,
  RecordVoiceOver as RecordIcon,
  WifiOff as OfflineIcon,
  CheckCircle as OnlineIcon,
  Schedule as ScheduleIcon,
  FiberManualRecord as RecordingIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'recording';
  lastMotion?: string;
  recording: boolean;
  nightVision: boolean;
  resolution: string;
  battery?: number;
}

interface SecurityAlert {
  id: string;
  type: 'motion' | 'offline' | 'low_battery' | 'tampering';
  camera: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  acknowledged: boolean;
}

const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  stagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

const SecurityCamera: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [fullscreenCamera, setFullscreenCamera] = useState<Camera | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  
  const [cameras] = useState<Camera[]>([
    {
      id: 'cam-1',
      name: 'North Field Camera',
      location: 'North Entrance',
      status: 'online',
      lastMotion: '2024-12-04T14:30:00',
      recording: true,
      nightVision: true,
      resolution: '1080p',
      battery: 85,
    },
    {
      id: 'cam-2',
      name: 'South Field Camera',
      location: 'South Perimeter',
      status: 'recording',
      lastMotion: '2024-12-04T14:45:00',
      recording: true,
      nightVision: false,
      resolution: '4K',
    },
    {
      id: 'cam-3',
      name: 'Greenhouse Camera',
      location: 'Inside Greenhouse',
      status: 'online',
      recording: false,
      nightVision: true,
      resolution: '1080p',
      battery: 45,
    },
    {
      id: 'cam-4',
      name: 'Storage Camera',
      location: 'Equipment Storage',
      status: 'offline',
      recording: false,
      nightVision: false,
      resolution: '720p',
      battery: 15,
    },
  ]);

  const [alerts] = useState<SecurityAlert[]>([
    {
      id: 'alert-1',
      type: 'motion',
      camera: 'North Field Camera',
      timestamp: '2024-12-04T14:45:23',
      severity: 'medium',
      acknowledged: false,
    },
    {
      id: 'alert-2',
      type: 'low_battery',
      camera: 'Storage Camera',
      timestamp: '2024-12-04T13:20:15',
      severity: 'high',
      acknowledged: false,
    },
    {
      id: 'alert-3',
      type: 'offline',
      camera: 'Storage Camera',
      timestamp: '2024-12-04T12:15:42',
      severity: 'high',
      acknowledged: true,
    },
  ]);

  const getStatusIcon = (status: Camera['status']) => {
    switch (status) {
      case 'online': return <OnlineIcon sx={{ color: 'success.main' }} />;
      case 'offline': return <OfflineIcon sx={{ color: 'error.main' }} />;
      case 'recording': return <RecordingIcon sx={{ color: 'error.main' }} />;
    }
  };

  const getStatusColor = (status: Camera['status']) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'error';
      case 'recording': return 'warning';
    }
  };

  const getSeverityColor = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'low': return 'info';
      case 'medium': return 'warning';
      case 'high': return 'error';
    }
  };

  const getAlertIcon = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'motion': return <AlertIcon />;
      case 'offline': return <OfflineIcon />;
      case 'low_battery': return <WarningIcon />;
      case 'tampering': return <SecurityIcon />;
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, camera: Camera) => {
    setAnchorEl(event.currentTarget);
    setSelectedCamera(camera);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCamera(null);
  };

  const CameraCard = ({ camera }: { camera: Camera }) => (
    <motion.div variants={animationVariants.fadeIn}>
      <Card sx={{ height: '100%', position: 'relative' }}>
        {/* Fake Video Feed */}
        <Box 
          sx={{ 
            height: { xs: 160, sm: 200 }, 
            bgcolor: 'grey.900', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: camera.status === 'offline' 
              ? 'linear-gradient(45deg, #424242 25%, transparent 25%), linear-gradient(-45deg, #424242 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #424242 75%), linear-gradient(-45deg, transparent 75%, #424242 75%)'
              : 'radial-gradient(circle, rgba(76,175,80,0.1) 0%, rgba(33,150,243,0.05) 100%)',
            backgroundSize: camera.status === 'offline' ? '20px 20px' : 'auto',
            backgroundPosition: camera.status === 'offline' ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'center',
          }}
        >
          {camera.status === 'offline' ? (
            <VideocamOffIcon sx={{ fontSize: 48, color: 'error.main' }} />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <VideocamIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'white' }}>
                Live Feed
              </Typography>
            </Box>
          )}
          
          {/* Status Badge */}
          <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
            <Chip 
              icon={getStatusIcon(camera.status)}
              label={camera.status.toUpperCase()}
              color={getStatusColor(camera.status) as any}
              size="small"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>

          {/* Recording Indicator */}
          {camera.recording && camera.status !== 'offline' && (
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <Badge color="error" variant="dot">
                <RecordIcon sx={{ color: 'white', fontSize: 20 }} />
              </Badge>
            </Box>
          )}

          {/* Battery Level */}
          {camera.battery !== undefined && (
            <Box sx={{ position: 'absolute', bottom: 8, left: 8 }}>
              <Chip 
                label={`${camera.battery}%`}
                size="small"
                color={camera.battery < 20 ? 'error' : camera.battery < 50 ? 'warning' : 'success'}
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
          )}

          {/* Fullscreen Button */}
          <IconButton
            sx={{ position: 'absolute', bottom: 8, right: 8, color: 'white' }}
            onClick={() => setFullscreenCamera(camera)}
            disabled={camera.status === 'offline'}
          >
            <FullscreenIcon />
          </IconButton>
        </Box>

        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {camera.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {camera.location}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {camera.resolution} • {camera.nightVision ? 'Night Vision' : 'Day Only'}
              </Typography>
            </Box>
            <IconButton 
              size="small"
              onClick={(e) => handleMenuClick(e, camera)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          {camera.lastMotion && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Last Motion: {new Date(camera.lastMotion).toLocaleTimeString()}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const TabPanel = ({ children, value, index }: any) => (
    <Box hidden={value !== index} sx={{ pt: 2 }}>
      {value === index && children}
    </Box>
  );

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.stagger}
      style={{ paddingBottom: '80px' }}
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 1 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Security System
          </Typography>
          <Badge badgeContent={unacknowledgedAlerts.length} color="error">
            <Button 
              variant="outlined" 
              startIcon={<AlertIcon />}
              size="small"
            >
              Alerts
            </Button>
          </Badge>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Monitor your agricultural site with live camera feeds and security alerts
        </Typography>
      </Box>

      {/* System Status */}
      <motion.div variants={animationVariants.fadeIn}>
        <Alert 
          severity={cameras.filter(c => c.status === 'offline').length > 0 ? 'warning' : 'success'} 
          sx={{ mb: 3 }}
        >
          <Typography variant="body2">
            System Status: {cameras.filter(c => c.status !== 'offline').length} of {cameras.length} cameras online
            {cameras.filter(c => c.recording).length > 0 && 
              ` • ${cameras.filter(c => c.recording).length} cameras recording`}
          </Typography>
        </Alert>
      </motion.div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minWidth: { xs: 'auto', sm: 160 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        >
          <Tab 
            label={(
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Camera Feeds
                {cameras.filter(c => c.status === 'recording').length > 0 && (
                  <Badge 
                    badgeContent={cameras.filter(c => c.status === 'recording').length} 
                    color="error" 
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
                  />
                )}
              </Box>
            )}
          />
          <Tab 
            label={(
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Alerts
                {unacknowledgedAlerts.length > 0 && (
                  <Badge 
                    badgeContent={unacknowledgedAlerts.length} 
                    color="error" 
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
                  />
                )}
              </Box>
            )}
          />
          <Tab label="Recordings" />
        </Tabs>
      </Box>

      {/* Camera Feeds Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {cameras.map((camera) => (
            <Grid item xs={12} sm={6} lg={4} key={camera.id}>
              <CameraCard camera={camera} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Alerts Tab */}
      <TabPanel value={activeTab} index={1}>
        <motion.div variants={animationVariants.fadeIn}>
          <Typography variant="h6" sx={{ mb: 3 }}>Security Alerts</Typography>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <List>
                {alerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem sx={{ opacity: alert.acknowledged ? 0.6 : 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Chip
                          icon={getAlertIcon(alert.type)}
                          label={alert.type.replace('_', ' ').toUpperCase()}
                          color={getSeverityColor(alert.severity) as any}
                          size="small"
                        />
                      </Box>
                      <ListItemText
                        primary={`${alert.camera} - ${alert.type.replace('_', ' ')}`}
                        secondary={new Date(alert.timestamp).toLocaleString()}
                      />
                      <ListItemSecondaryAction>
                        {!alert.acknowledged && (
                          <Button size="small" variant="outlined">
                            Acknowledge
                          </Button>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < alerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </motion.div>
      </TabPanel>

      {/* Recordings Tab */}
      <TabPanel value={activeTab} index={2}>
        <motion.div variants={animationVariants.fadeIn}>
          <Typography variant="h6" sx={{ mb: 3 }}>Recorded Events</Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Today's Recordings
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                    24
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Motion-triggered events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Storage Used
                  </Typography>
                  <Typography variant="h4" color="warning.main" sx={{ mb: 1 }}>
                    78%
                  </Typography>
                  <LinearProgress variant="determinate" value={78} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Oldest Recording
                  </Typography>
                  <Typography variant="h4" color="info.main" sx={{ mb: 1 }}>
                    7d
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Auto-cleanup after 30 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </TabPanel>

      {/* Camera Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} /> Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ScheduleIcon sx={{ mr: 1 }} /> Schedule
        </MenuItem>
      </Menu>

      {/* Fullscreen Dialog */}
      <Dialog 
        open={Boolean(fullscreenCamera)} 
        onClose={() => setFullscreenCamera(null)}
        maxWidth="lg"
        fullWidth
        sx={{ '& .MuiDialog-paper': { m: { xs: 1, sm: 4 } } }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
          {fullscreenCamera?.name} - Live Feed
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Box 
            sx={{ 
              height: { xs: 250, sm: 400 }, 
              bgcolor: 'grey.900', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <VideocamIcon sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6">Live Video Stream</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Full-screen camera feed would appear here
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFullscreenCamera(null)}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Record Clip
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default SecurityCamera;