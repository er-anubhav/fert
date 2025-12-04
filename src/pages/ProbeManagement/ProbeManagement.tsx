import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Fab,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Switch,
  LinearProgress,
  Menu,
  Badge,
  Slider,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  GroupWork as GroupIcon,
  Sensors as SensorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Battery0Bar as BatteryLowIcon,
  Battery3Bar as BatteryMedIcon,
  BatteryFull as BatteryFullIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Warning as WarningIcon,
  CheckCircle as OnlineIcon,
  Error as OfflineIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  WaterDrop as WaterDropIcon,
  Thermostat as ThermostatIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ProbeGrid from '../../components/ProbeManagement/ProbeGrid';
import GroupManagement from '../../components/ProbeManagement/GroupManagement';
import ProbeDetailModal from '../../components/ProbeManagement/ProbeDetailModal';
import { Probe, ProbeGroup } from '../../types';
import { colors, animationVariants } from '../../utils/theme';

// Mock data
const mockProbes: Probe[] = [
  {
    id: 'probe-001',
    uuid: 'uuid-001',
    name: 'North Field Sensor',
    groupId: 'group-001',
    status: 'online',
    batteryLevel: 87,
    wifiStrength: 85,
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
    location: { fieldName: 'North Field', latitude: 40.7128, longitude: -74.0060 },
    currentReading: {
      timestamp: new Date(),
      soilMoisture: 68,
      temperature: 24.5,
      humidity: 72,
      pH: 6.8,
      nitrogen: 45,
      phosphorus: 38,
      potassium: 52,
      microNutrients: {
        iron: 12.5,
        zinc: 8.2,
        manganese: 15.8,
        copper: 3.1,
        boron: 0.8,
        molybdenum: 0.5,
      },
      macroNutrients: {
        calcium: 85,
        magnesium: 22,
        sulfur: 18,
      },
    },
    isBluetoothConnected: false,
    waterTankLevel: 75,
  },
  {
    id: 'probe-002',
    uuid: 'uuid-002',
    name: 'Greenhouse Monitor',
    groupId: 'group-002',
    status: 'online',
    batteryLevel: 92,
    wifiStrength: 95,
    lastActive: new Date(Date.now() - 2 * 60 * 1000),
    location: { fieldName: 'Greenhouse A' },
    currentReading: {
      timestamp: new Date(),
      soilMoisture: 75,
      temperature: 26.2,
      humidity: 68,
      pH: 6.5,
      nitrogen: 52,
      phosphorus: 42,
      potassium: 48,
      microNutrients: {
        iron: 14.2,
        zinc: 9.1,
        manganese: 17.3,
        copper: 3.8,
        boron: 1.2,
        molybdenum: 0.7,
      },
      macroNutrients: {
        calcium: 92,
        magnesium: 28,
        sulfur: 22,
      },
    },
    isBluetoothConnected: false,
    waterTankLevel: 82,
  },
  {
    id: 'probe-003',
    uuid: 'uuid-003',
    name: 'South Field Sensor',
    groupId: 'group-001',
    status: 'maintenance',
    batteryLevel: 34,
    wifiStrength: 45,
    lastActive: new Date(Date.now() - 45 * 60 * 1000),
    location: { fieldName: 'South Field' },
    currentReading: {
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      soilMoisture: 45,
      temperature: 23.1,
      humidity: 65,
      pH: 7.2,
      nitrogen: 32,
      phosphorus: 28,
      potassium: 44,
      microNutrients: {
        iron: 8.5,
        zinc: 6.2,
        manganese: 12.1,
        copper: 2.1,
        boron: 0.4,
        molybdenum: 0.3,
      },
      macroNutrients: {
        calcium: 68,
        magnesium: 15,
        sulfur: 12,
      },
    },
    isBluetoothConnected: false,
    waterTankLevel: 23,
  },
  {
    id: 'probe-004',
    uuid: 'uuid-004',
    name: 'West Garden Monitor',
    status: 'offline',
    batteryLevel: 8,
    wifiStrength: 0,
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
    location: { fieldName: 'West Garden' },
    currentReading: {
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      soilMoisture: 52,
      temperature: 22.8,
      humidity: 70,
      pH: 6.9,
      nitrogen: 38,
      phosphorus: 35,
      potassium: 46,
      microNutrients: {
        iron: 10.2,
        zinc: 7.5,
        manganese: 13.8,
        copper: 2.8,
        boron: 0.6,
        molybdenum: 0.4,
      },
      macroNutrients: {
        calcium: 78,
        magnesium: 19,
        sulfur: 16,
      },
    },
    isBluetoothConnected: false,
    waterTankLevel: 0,
  },
];

const mockGroups: ProbeGroup[] = [
  {
    id: 'group-001',
    name: 'Field Sensors',
    description: 'Outdoor field monitoring probes',
    color: colors.primary[500],
    probeIds: ['probe-001', 'probe-003'],
  },
  {
    id: 'group-002',
    name: 'Greenhouse',
    description: 'Indoor greenhouse monitoring',
    color: colors.secondary[500],
    probeIds: ['probe-002'],
  },
  {
    id: 'group-003',
    name: 'Garden Areas',
    description: 'Small garden and specialty crop areas',
    color: colors.status.info,
    probeIds: ['probe-004'],
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ProbeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [probes, setProbes] = useState(mockProbes);
  const [groups, setGroups] = useState(mockGroups);
  const [selectedProbe, setSelectedProbe] = useState<Probe | null>(null);
  const [isProbeModalOpen, setIsProbeModalOpen] = useState(false);
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'maintenance'>('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProbeClick = (probe: Probe) => {
    setSelectedProbe(probe);
    setIsProbeModalOpen(true);
  };

  const handleRefreshProbe = (probeId: string) => {
    // In a real app, this would trigger an API call to refresh the probe data
    console.log('Refreshing probe:', probeId);
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: ProbeGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName,
        description: newGroupDescription,
        color: colors.primary[500],
        probeIds: [],
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupDescription('');
      setIsAddGroupDialogOpen(false);
    }
  };

  const filteredProbes = probes.filter(probe => {
    if (filter === 'all') return true;
    return probe.status === filter;
  });

  const onlineCount = probes.filter(p => p.status === 'online').length;
  const offlineCount = probes.filter(p => p.status === 'offline').length;
  const maintenanceCount = probes.filter(p => p.status === 'maintenance').length;
  
  // Additional state for enhanced features
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProbeId, setSelectedProbeId] = useState<string | null>(null);
  const [calibrationDialog, setCalibrationDialog] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);

  // Calculate additional metrics
  const avgBattery = Math.round(probes.reduce((acc, p) => acc + p.batteryLevel, 0) / probes.length);
  const lowBatteryCount = probes.filter(p => p.batteryLevel < 30).length;
  const avgWifiStrength = Math.round(probes.filter(p => p.wifiStrength > 0).reduce((acc, p) => acc + p.wifiStrength, 0) / probes.filter(p => p.wifiStrength > 0).length);

  const getBatteryIcon = (level: number) => {
    if (level < 30) return <BatteryLowIcon sx={{ color: 'error.main' }} />;
    if (level < 70) return <BatteryMedIcon sx={{ color: 'warning.main' }} />;
    return <BatteryFullIcon sx={{ color: 'success.main' }} />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <OnlineIcon sx={{ color: 'success.main' }} />;
      case 'offline': return <OfflineIcon sx={{ color: 'error.main' }} />;
      case 'maintenance': return <WarningIcon sx={{ color: 'warning.main' }} />;
      default: return <OfflineIcon sx={{ color: 'grey.400' }} />;
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, probeId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProbeId(probeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProbeId(null);
  };

  const EnhancedProbeCard = ({ probe }: { probe: Probe }) => (
    <motion.div variants={animationVariants.fadeIn}>
      <Card sx={{ height: '100%', position: 'relative' }}>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {probe.name}
              </Typography>
              <Chip 
                icon={getStatusIcon(probe.status)}
                label={probe.status.toUpperCase()}
                color={probe.status === 'online' ? 'success' : probe.status === 'maintenance' ? 'warning' : 'error'}
                size="small"
              />
            </Box>
            <IconButton 
              size="small"
              onClick={(e) => handleMenuClick(e, probe.id)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Metrics Grid */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getBatteryIcon(probe.batteryLevel)}
                <Typography variant="body2" color="text.secondary">
                  {probe.batteryLevel}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {probe.wifiStrength > 0 ? 
                  <WifiIcon sx={{ color: probe.wifiStrength > 50 ? 'success.main' : 'warning.main' }} /> : 
                  <WifiOffIcon sx={{ color: 'error.main' }} />
                }
                <Typography variant="body2" color="text.secondary">
                  {probe.wifiStrength}%
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Current Reading Summary */}
          {probe.currentReading && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Current Readings
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WaterDropIcon sx={{ fontSize: 16, color: 'info.main' }} />
                    <Typography variant="caption">
                      {probe.currentReading.soilMoisture}% moisture
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ThermostatIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="caption">
                      {probe.currentReading.temperature}°C
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    pH: {probe.currentReading.pH}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    N: {probe.currentReading.nitrogen}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Status Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Last: {probe.lastActive.toLocaleTimeString()}
            </Typography>
            <Button
              size="small"
              onClick={() => handleProbeClick(probe)}
              startIcon={<TimelineIcon />}
            >
              Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.stagger}
    >
      {/* Header */}
      <motion.div variants={animationVariants.fadeIn}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Probe Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor and manage your agricultural sensor network
              </Typography>
            </Box>
            <Badge badgeContent={lowBatteryCount} color="error" invisible={lowBatteryCount === 0}>
              <Button
                variant="outlined"
                startIcon={<NotificationsIcon />}
                onClick={() => setAlertDialog(true)}
              >
                Alerts
              </Button>
            </Badge>
          </Box>

          {/* Enhanced Status Grid */}
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    {onlineCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Online Probes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {avgBattery}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Battery
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                    {avgWifiStrength}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Signal
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                    {lowBatteryCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Battery
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* System Status Alert */}
        {(offlineCount > 0 || lowBatteryCount > 0) && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              System Alert: {offlineCount > 0 && `${offlineCount} probe(s) offline`}
              {offlineCount > 0 && lowBatteryCount > 0 && ' • '}
              {lowBatteryCount > 0 && `${lowBatteryCount} probe(s) with low battery`}
            </Typography>
          </Alert>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={animationVariants.slideIn}>
        <Card sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab 
                icon={<SensorIcon />} 
                iconPosition="start"
                label="All Probes" 
              />
              <Tab 
                icon={<TrendingUpIcon />} 
                iconPosition="start"
                label="Analytics" 
              />
              <Tab 
                icon={<SettingsIcon />} 
                iconPosition="start"
                label="Maintenance" 
              />
            </Tabs>
          </Box>

          {/* All Probes Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="All"
                color={filter === 'all' ? 'primary' : 'default'}
                onClick={() => setFilter('all')}
                clickable
              />
              <Chip
                label={`Online (${onlineCount})`}
                color={filter === 'online' ? 'primary' : 'default'}
                onClick={() => setFilter('online')}
                clickable
              />
              <Chip
                label={`Offline (${offlineCount})`}
                color={filter === 'offline' ? 'primary' : 'default'}
                onClick={() => setFilter('offline')}
                clickable
              />
              <Chip
                label={`Maintenance (${maintenanceCount})`}
                color={filter === 'maintenance' ? 'primary' : 'default'}
                onClick={() => setFilter('maintenance')}
                clickable
              />
            </Box>

            <ProbeGrid 
              probes={filteredProbes}
              groups={groups}
              onProbeClick={handleProbeClick}
              onRefreshProbe={handleRefreshProbe}
            />
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" sx={{ mb: 3 }}>Probe Analytics</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Network Health Overview
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">System Uptime</Typography>
                        <Typography variant="body2">96%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={96} sx={{ height: 6, borderRadius: 3 }} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Data Collection Rate</Typography>
                        <Typography variant="body2">94%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={94} sx={{ height: 6, borderRadius: 3 }} />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Battery Health</Typography>
                        <Typography variant="body2">{avgBattery}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={avgBattery} 
                        color={avgBattery > 70 ? 'success' : avgBattery > 40 ? 'warning' : 'error'}
                        sx={{ height: 6, borderRadius: 3 }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Recent Activity
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Soil Probe Alpha" 
                          secondary="New reading received • 2 min ago" 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText 
                          primary="Greenhouse Monitor" 
                          secondary="Calibration completed • 15 min ago" 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText 
                          primary="West Garden Monitor" 
                          secondary="Connection lost • 3 hours ago" 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Maintenance Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" sx={{ mb: 3 }}>Maintenance Schedule</Typography>
            
            <Card>
              <CardContent>
                <List>
                  {probes.filter(p => p.status === 'maintenance' || p.batteryLevel < 30).map((probe) => (
                    <React.Fragment key={probe.id}>
                      <ListItem>
                        <ListItemText
                          primary={probe.name}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {probe.status === 'maintenance' ? 'Scheduled maintenance required' : 'Low battery - replacement needed'}
                              </Typography>
                              <Chip 
                                label={probe.status === 'maintenance' ? 'Maintenance' : 'Low Battery'}
                                color={probe.status === 'maintenance' ? 'warning' : 'error'}
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setCalibrationDialog(true)}
                          >
                            Schedule
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </TabPanel>
        </Card>
      </motion.div>

      {/* Floating Action Button for Quick Add */}
      <Fab
        color="primary"
        aria-label="add probe"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => {
          // In a real app, this would open a "Add New Probe" dialog
          console.log('Add new probe');
        }}
      >
        <AddIcon />
      </Fab>

      {/* Probe Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); setCalibrationDialog(true); }}>
          <SettingsIcon sx={{ mr: 1 }} /> Calibrate
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <TimelineIcon sx={{ mr: 1 }} /> View History
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} /> Edit Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DeleteIcon sx={{ mr: 1 }} /> Remove
        </MenuItem>
      </Menu>

      {/* Calibration Dialog */}
      <Dialog open={calibrationDialog} onClose={() => setCalibrationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Probe Calibration</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Calibrate your probe sensors for accurate readings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Calibration Type</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="ph">pH Calibration</MenuItem>
                  <MenuItem value="moisture">Moisture Calibration</MenuItem>
                  <MenuItem value="nutrients">Nutrient Calibration</MenuItem>
                  <MenuItem value="full">Full Calibration</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCalibrationDialog(false)}>Cancel</Button>
          <Button variant="contained">Start Calibration</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Dialog */}
      <Dialog open={alertDialog} onClose={() => setAlertDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>System Alerts</DialogTitle>
        <DialogContent>
          <List>
            {probes.filter(p => p.batteryLevel < 30 || p.status === 'offline').map((probe) => (
              <ListItem key={probe.id}>
                <ListItemText
                  primary={probe.name}
                  secondary={
                    probe.batteryLevel < 30 ? 
                      `Low battery: ${probe.batteryLevel}%` : 
                      `Probe offline since ${probe.lastActive.toLocaleString()}`
                  }
                />
                <ListItemSecondaryAction>
                  <Chip 
                    label={probe.batteryLevel < 30 ? 'Low Battery' : 'Offline'}
                    color="error"
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Probe Detail Modal */}
      {selectedProbe && (
        <ProbeDetailModal
          probe={selectedProbe}
          open={isProbeModalOpen}
          onClose={() => {
            setIsProbeModalOpen(false);
            setSelectedProbe(null);
          }}
          onRefresh={() => handleRefreshProbe(selectedProbe.id)}
        />
      )}

      {/* Add Group Dialog */}
      <Dialog 
        open={isAddGroupDialogOpen} 
        onClose={() => setIsAddGroupDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            variant="outlined"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddGroupDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddGroup} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ProbeManagement;