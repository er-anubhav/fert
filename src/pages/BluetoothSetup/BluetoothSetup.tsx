import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Bluetooth as BluetoothIcon,
  BluetoothConnected as BluetoothConnectedIcon,
  BluetoothDisabled as BluetoothDisabledIcon,
  BluetoothSearching as BluetoothSearchingIcon,
  DeviceHub as DeviceHubIcon,
  Sync as SyncIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Battery0Bar as BatteryLowIcon,
  Battery3Bar as BatteryMedIcon,
  BatteryFull as BatteryFullIcon,
  Sensors as SensorsIcon,
  WaterDrop as ProbeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface BluetoothDevice {
  id: string;
  name: string;
  type: 'probe' | 'sensor' | 'controller' | 'gateway';
  status: 'connected' | 'disconnected' | 'pairing' | 'error';
  rssi: number; // Signal strength
  battery?: number;
  lastSeen: string;
  paired: boolean;
  firmwareVersion?: string;
}

interface PairingStep {
  label: string;
  description: string;
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

const BluetoothSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [scanDialog, setScanDialog] = useState(false);
  const [pairDialog, setPairDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [scanning, setScanning] = useState(false);
  const [pairing, setPairing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [devices] = useState<BluetoothDevice[]>([
    {
      id: 'dev-1',
      name: 'Soil Probe Alpha',
      type: 'probe',
      status: 'connected',
      rssi: -45,
      battery: 85,
      lastSeen: '2024-12-04T15:30:00',
      paired: true,
      firmwareVersion: 'v2.1.4',
    },
    {
      id: 'dev-2',
      name: 'Moisture Sensor B1',
      type: 'sensor',
      status: 'connected',
      rssi: -62,
      battery: 72,
      lastSeen: '2024-12-04T15:29:45',
      paired: true,
      firmwareVersion: 'v1.8.2',
    },
    {
      id: 'dev-3',
      name: 'Weather Station',
      type: 'sensor',
      status: 'connected',
      rssi: -38,
      lastSeen: '2024-12-04T15:30:12',
      paired: true,
      firmwareVersion: 'v3.0.1',
    },
    {
      id: 'dev-4',
      name: 'Irrigation Controller',
      type: 'controller',
      status: 'disconnected',
      rssi: -78,
      battery: 45,
      lastSeen: '2024-12-04T14:22:18',
      paired: true,
      firmwareVersion: 'v2.5.0',
    },
    {
      id: 'dev-5',
      name: 'Gateway Module',
      type: 'gateway',
      status: 'error',
      rssi: -55,
      lastSeen: '2024-12-04T13:15:33',
      paired: true,
      firmwareVersion: 'v1.9.7',
    },
  ]);

  const [availableDevices] = useState<BluetoothDevice[]>([
    {
      id: 'new-1',
      name: 'FertoBot Probe X1',
      type: 'probe',
      status: 'disconnected',
      rssi: -52,
      lastSeen: '2024-12-04T15:31:00',
      paired: false,
    },
    {
      id: 'new-2',
      name: 'Smart Sensor v3',
      type: 'sensor',
      status: 'disconnected',
      rssi: -65,
      lastSeen: '2024-12-04T15:30:45',
      paired: false,
    },
  ]);

  const pairingSteps: PairingStep[] = [
    {
      label: 'Enable pairing mode',
      description: 'Press and hold the pairing button on your device for 3 seconds',
    },
    {
      label: 'Scan for devices',
      description: 'FertoBot will scan for nearby Bluetooth devices',
    },
    {
      label: 'Select device',
      description: 'Choose your device from the list of discovered devices',
    },
    {
      label: 'Pair device',
      description: 'Complete the pairing process and configure settings',
    },
  ];

  const getStatusColor = (status: BluetoothDevice['status']) => {
    switch (status) {
      case 'connected': return 'success';
      case 'disconnected': return 'default';
      case 'pairing': return 'warning';
      case 'error': return 'error';
    }
  };

  const getStatusIcon = (status: BluetoothDevice['status']) => {
    switch (status) {
      case 'connected': return <BluetoothConnectedIcon />;
      case 'disconnected': return <BluetoothDisabledIcon />;
      case 'pairing': return <BluetoothSearchingIcon />;
      case 'error': return <ErrorIcon />;
    }
  };

  const getDeviceIcon = (type: BluetoothDevice['type']) => {
    switch (type) {
      case 'probe': return <ProbeIcon />;
      case 'sensor': return <SensorsIcon />;
      case 'controller': return <SettingsIcon />;
      case 'gateway': return <DeviceHubIcon />;
    }
  };

  const getBatteryIcon = (battery?: number) => {
    if (!battery) return null;
    if (battery < 30) return <BatteryLowIcon sx={{ color: 'error.main' }} />;
    if (battery < 70) return <BatteryMedIcon sx={{ color: 'warning.main' }} />;
    return <BatteryFullIcon sx={{ color: 'success.main' }} />;
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return { strength: 'Excellent', color: 'success.main' };
    if (rssi > -60) return { strength: 'Good', color: 'success.main' };
    if (rssi > -70) return { strength: 'Fair', color: 'warning.main' };
    return { strength: 'Poor', color: 'error.main' };
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleScan = () => {
    setScanning(true);
    setScanDialog(true);
    // Simulate scanning
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  const handlePair = (device: BluetoothDevice) => {
    setSelectedDevice(device);
    setPairDialog(true);
    setActiveStep(0);
  };

  const handlePairingNext = () => {
    if (activeStep === pairingSteps.length - 1) {
      setPairing(true);
      setTimeout(() => {
        setPairing(false);
        setPairDialog(false);
        // Device would be added to paired devices
      }, 2000);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePairingBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const DeviceCard = ({ device, showPairButton = false }: { device: BluetoothDevice; showPairButton?: boolean }) => {
    const signal = getSignalStrength(device.rssi);
    
    return (
      <motion.div variants={animationVariants.fadeIn}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {getDeviceIcon(device.type)}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {device.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                icon={getStatusIcon(device.status)}
                label={device.status.toUpperCase()}
                color={getStatusColor(device.status) as any}
                size="small"
              />
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BluetoothIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    Signal: {signal.strength}
                  </Typography>
                </Box>
              </Grid>
              {device.battery && (
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getBatteryIcon(device.battery)}
                    <Typography variant="body2" color="text.secondary">
                      Battery: {device.battery}%
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Last seen: {new Date(device.lastSeen).toLocaleString()}
            </Typography>

            {device.firmwareVersion && (
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Firmware: {device.firmwareVersion}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              {showPairButton ? (
                <Button
                  variant="contained"
                  onClick={() => handlePair(device)}
                  startIcon={<BluetoothIcon />}
                  size="small"
                  fullWidth
                >
                  Pair Device
                </Button>
              ) : (
                <>
                  {device.status === 'connected' ? (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<BluetoothDisabledIcon />}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<BluetoothConnectedIcon />}
                    >
                      Connect
                    </Button>
                  )}
                  <IconButton size="small">
                    <SettingsIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const TabPanel = ({ children, value, index }: any) => (
    <Box hidden={value !== index} sx={{ pt: 2 }}>
      {value === index && children}
    </Box>
  );

  const connectedDevices = devices.filter(d => d.status === 'connected').length;
  const totalDevices = devices.length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.stagger}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Bluetooth Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and monitor Bluetooth connections for all your FertoBot devices
        </Typography>
      </Box>

      {/* Connection Status */}
      <motion.div variants={animationVariants.fadeIn}>
        <Alert 
          severity={connectedDevices === totalDevices ? 'success' : 'warning'} 
          sx={{ mb: 3 }}
        >
          <Typography variant="body2">
            Bluetooth Status: {connectedDevices} of {totalDevices} devices connected
            • Range: 10-50m • Last scan: 2 minutes ago
          </Typography>
        </Alert>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={animationVariants.fadeIn}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {connectedDevices}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connected
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                  {devices.filter(d => d.status === 'disconnected').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Offline
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                  {devices.filter(d => d.status === 'error').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Errors
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                  {Math.round(devices.filter(d => d.battery).reduce((acc, d) => acc + (d.battery || 0), 0) / devices.filter(d => d.battery).length)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Battery
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Connected Devices" />
          <Tab label="Available Devices" />
          <Tab label="Troubleshooting" />
        </Tabs>
      </Box>

      {/* Connected Devices Tab */}
      <TabPanel value={activeTab} index={0}>
        <motion.div variants={animationVariants.fadeIn}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Paired Devices</Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                sx={{ mr: 1 }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleScan}
              >
                Add Device
              </Button>
            </Box>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} lg={4} key={device.id}>
              <DeviceCard device={device} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Available Devices Tab */}
      <TabPanel value={activeTab} index={1}>
        <motion.div variants={animationVariants.fadeIn}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Discoverable Devices</Typography>
            <Button
              variant="contained"
              startIcon={scanning ? <CircularProgress size={16} /> : <BluetoothSearchingIcon />}
              onClick={handleScan}
              disabled={scanning}
            >
              {scanning ? 'Scanning...' : 'Scan for Devices'}
            </Button>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {availableDevices.map((device) => (
            <Grid item xs={12} sm={6} lg={4} key={device.id}>
              <DeviceCard device={device} showPairButton />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Troubleshooting Tab */}
      <TabPanel value={activeTab} index={2}>
        <motion.div variants={animationVariants.fadeIn}>
          <Typography variant="h6" sx={{ mb: 3 }}>Troubleshooting Guide</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    Connection Issues
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Device won't connect"
                        secondary="Check device battery and proximity. Reset Bluetooth on both devices."
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Intermittent disconnections"
                        secondary="Reduce distance between devices. Check for interference sources."
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Poor signal strength"
                        secondary="Move devices closer together. Remove obstacles between devices."
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    Best Practices
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Optimal placement"
                        secondary="Keep devices within 10-30m range for best performance."
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Battery management"
                        secondary="Monitor battery levels. Replace when below 20%."
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Regular maintenance"
                        secondary="Check connections weekly. Update firmware when available."
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </TabPanel>

      {/* Scan Dialog */}
      <Dialog open={scanDialog} onClose={() => setScanDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {scanning ? <CircularProgress size={20} /> : <BluetoothSearchingIcon />}
            Scanning for Devices
          </Box>
        </DialogTitle>
        <DialogContent>
          {scanning ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>Looking for nearby Bluetooth devices...</Typography>
            </Box>
          ) : (
            <Box>
              <Typography sx={{ mb: 2 }}>Found {availableDevices.length} devices:</Typography>
              <List>
                {availableDevices.map((device) => (
                  <ListItem key={device.id}>
                    <ListItemText 
                      primary={device.name}
                      secondary={`${device.type} • Signal: ${getSignalStrength(device.rssi).strength}`}
                    />
                    <ListItemSecondaryAction>
                      <Button size="small" onClick={() => handlePair(device)}>
                        Pair
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScanDialog(false)}>Close</Button>
          {!scanning && (
            <Button variant="contained" onClick={handleScan}>
              Scan Again
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Pairing Dialog */}
      <Dialog open={pairDialog} onClose={() => setPairDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Pair Device: {selectedDevice?.name}</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {pairingSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                  {index === activeStep && (
                    <Box>
                      <Button
                        variant="contained"
                        onClick={handlePairingNext}
                        disabled={pairing}
                        startIcon={pairing ? <CircularProgress size={16} /> : undefined}
                        sx={{ mr: 1 }}
                      >
                        {index === pairingSteps.length - 1 ? 
                          (pairing ? 'Pairing...' : 'Complete Pairing') : 
                          'Next'}
                      </Button>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handlePairingBack}
                      >
                        Back
                      </Button>
                    </Box>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPairDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default BluetoothSetup;