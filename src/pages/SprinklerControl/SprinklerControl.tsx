import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Switch,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Water as WaterIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timer as TimerIcon,
  Opacity as OpacityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface IrrigationZone {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'scheduled';
  duration: number; // minutes
  flowRate: number; // L/min
  lastRun: string;
  nextScheduled?: string;
  moistureLevel: number;
  progress?: number;
}

interface Schedule {
  id: string;
  zoneId: string;
  time: string;
  duration: number;
  days: string[];
  enabled: boolean;
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

const SprinklerControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [editingZone, setEditingZone] = useState<IrrigationZone | null>(null);
  
  const [zones] = useState<IrrigationZone[]>([
    {
      id: 'zone-1',
      name: 'North Field',
      status: 'active',
      duration: 30,
      flowRate: 15.2,
      lastRun: '2024-12-04T08:00:00',
      moistureLevel: 45,
      progress: 65,
    },
    {
      id: 'zone-2',
      name: 'South Field',
      status: 'inactive',
      duration: 25,
      flowRate: 12.8,
      lastRun: '2024-12-04T06:30:00',
      nextScheduled: '2024-12-04T18:00:00',
      moistureLevel: 72,
    },
    {
      id: 'zone-3',
      name: 'Greenhouse',
      status: 'scheduled',
      duration: 15,
      flowRate: 8.5,
      lastRun: '2024-12-04T07:00:00',
      nextScheduled: '2024-12-04T16:00:00',
      moistureLevel: 38,
    },
    {
      id: 'zone-4',
      name: 'East Garden',
      status: 'inactive',
      duration: 20,
      flowRate: 10.3,
      lastRun: '2024-12-03T19:00:00',
      nextScheduled: '2024-12-04T19:00:00',
      moistureLevel: 85,
    },
  ]);

  const [schedules] = useState<Schedule[]>([
    {
      id: 'sched-1',
      zoneId: 'zone-1',
      time: '06:00',
      duration: 30,
      days: ['Mon', 'Wed', 'Fri'],
      enabled: true,
    },
    {
      id: 'sched-2',
      zoneId: 'zone-2',
      time: '18:00',
      duration: 25,
      days: ['Tue', 'Thu', 'Sat'],
      enabled: true,
    },
  ]);

  const getStatusColor = (status: IrrigationZone['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'scheduled': return 'warning';
      default: return 'default';
    }
  };

  const handleZoneToggle = (zoneId: string) => {
    // Toggle zone on/off logic
    console.log('Toggle zone:', zoneId);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const ZoneCard = ({ zone }: { zone: IrrigationZone }) => (
    <motion.div variants={animationVariants.fadeIn}>
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {zone.name}
              </Typography>
              <Chip 
                label={zone.status.toUpperCase()} 
                color={getStatusColor(zone.status) as any}
                size="small"
              />
            </Box>
            <IconButton 
              size="small" 
              onClick={() => setEditingZone(zone)}
            >
              <SettingsIcon />
            </IconButton>
          </Box>

          {zone.status === 'active' && zone.progress && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Running...</Typography>
                <Typography variant="body2">{zone.progress}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={zone.progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <OpacityIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              Moisture: {zone.moistureLevel}%
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <WaterIcon sx={{ fontSize: 16, color: 'info.main' }} />
            <Typography variant="body2" color="text.secondary">
              Flow: {zone.flowRate} L/min
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TimerIcon sx={{ fontSize: 16, color: 'warning.main' }} />
            <Typography variant="body2" color="text.secondary">
              Duration: {zone.duration}min
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={zone.status === 'active' ? 'contained' : 'outlined'}
              color={zone.status === 'active' ? 'error' : 'primary'}
              startIcon={zone.status === 'active' ? <StopIcon /> : <PlayIcon />}
              onClick={() => handleZoneToggle(zone.id)}
              size="small"
              fullWidth
              sx={{ py: { xs: 1, sm: 1.5 } }}
            >
              {zone.status === 'active' ? 'Stop' : 'Start'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const TabPanel = ({ children, value, index }: any) => (
    <Box hidden={value !== index} sx={{ pt: 2 }}>
      {value === index && children}
    </Box>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.stagger}
      style={{ paddingBottom: '80px' }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Irrigation Control
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and monitor your irrigation system zones and schedules
        </Typography>
      </Box>

      {/* System Status Alert */}
      <motion.div variants={animationVariants.fadeIn}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Typography variant="body2">
              System Status: Online • Water Pressure: 2.3 bar • Flow Rate: 28.5 L/min
            </Typography>
            <Button size="small" variant="outlined">
              View Details
            </Button>
          </Box>
        </Alert>
      </motion.div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Zone Control" />
          <Tab label="Schedules" />
          <Tab label="Usage History" />
        </Tabs>
      </Box>

      {/* Zone Control Tab */}
      <TabPanel value={activeTab} index={0}>
        <motion.div variants={animationVariants.fadeIn}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Irrigation Zones</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setScheduleDialog(true)}
              size="small"
            >
              Add Zone
            </Button>
          </Box>
        </motion.div>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {zones.map((zone) => (
            <Grid item xs={12} sm={6} lg={4} key={zone.id}>
              <ZoneCard zone={zone} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Schedules Tab */}
      <TabPanel value={activeTab} index={1}>
        <motion.div variants={animationVariants.fadeIn}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Irrigation Schedules</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setScheduleDialog(true)}
            >
              Add Schedule
            </Button>
          </Box>

          <Card>
            <CardContent sx={{ p: 0 }}>
              <List>
                {schedules.map((schedule, index) => {
                  const zone = zones.find(z => z.id === schedule.zoneId);
                  return (
                    <React.Fragment key={schedule.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${zone?.name} - ${schedule.time}`}
                          secondary={`${schedule.duration}min • ${schedule.days.join(', ')}`}
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Switch checked={schedule.enabled} />
                            <IconButton size="small">
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < schedules.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </motion.div>
      </TabPanel>

      {/* Usage History Tab */}
      <TabPanel value={activeTab} index={2}>
        <motion.div variants={animationVariants.fadeIn}>
          <Typography variant="h6" sx={{ mb: 3 }}>Usage History</Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Today's Usage
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                    245L
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Water consumed across all zones
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    This Week
                  </Typography>
                  <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                    1.8k L
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    15% less than last week
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </TabPanel>

      {/* Schedule Dialog */}
      <Dialog 
        open={scheduleDialog} 
        onClose={() => setScheduleDialog(false)} 
        maxWidth="sm" 
        fullWidth
        sx={{ '& .MuiDialog-paper': { m: { xs: 2, sm: 4 } } }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>Add New Schedule</DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Zone</InputLabel>
                <Select>
                  {zones.map(zone => (
                    <MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duration (min)"
                type="number"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Schedule</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default SprinklerControl;