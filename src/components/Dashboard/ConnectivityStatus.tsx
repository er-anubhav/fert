import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Sensors as SensorIcon,
  SignalWifi4Bar as WifiStrongIcon,
  SignalWifi2Bar as WifiWeakIcon,
  SignalWifiOff as WifiOffIcon,
  Battery90 as BatteryHighIcon,
  Battery50 as BatteryMediumIcon,
  Battery20 as BatteryLowIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  CheckCircle as OnlineIcon,
  Error as OfflineIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Probe } from '../../types';
import { colors, getStatusColor } from '../../utils/theme';

// Mock probe data
const mockProbes: Probe[] = [
  {
    id: 'probe-001',
    uuid: 'uuid-001',
    name: 'North Field Sensor',
    groupId: 'group-001',
    status: 'online',
    batteryLevel: 87,
    wifiStrength: 85,
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    location: { fieldName: 'North Field' },
    currentReading: {} as any, // Simplified for this component
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
    lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    location: { fieldName: 'Greenhouse A' },
    currentReading: {} as any,
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
    lastActive: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    location: { fieldName: 'South Field' },
    currentReading: {} as any,
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
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    location: { fieldName: 'West Garden' },
    currentReading: {} as any,
    isBluetoothConnected: false,
    waterTankLevel: 0,
  },
];

const getWifiIcon = (strength: number) => {
  if (strength === 0) return WifiOffIcon;
  if (strength < 50) return WifiWeakIcon;
  return WifiStrongIcon;
};

const getBatteryIcon = (level: number) => {
  if (level < 25) return BatteryLowIcon;
  if (level < 75) return BatteryMediumIcon;
  return BatteryHighIcon;
};

const getBatteryColor = (level: number) => {
  if (level < 20) return colors.status.error;
  if (level < 40) return colors.status.warning;
  return colors.status.success;
};

const getWifiColor = (strength: number) => {
  if (strength === 0) return colors.neutral[400];
  if (strength < 50) return colors.status.warning;
  return colors.status.success;
};

const getLastActiveText = (lastActive: Date) => {
  const now = new Date();
  const diff = now.getTime() - lastActive.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return lastActive.toLocaleDateString();
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online': return <OnlineIcon sx={{ color: colors.status.success }} />;
    case 'offline': return <OfflineIcon sx={{ color: colors.status.error }} />;
    case 'maintenance': return <WarningIcon sx={{ color: colors.status.warning }} />;
    default: return <OfflineIcon sx={{ color: colors.neutral[400] }} />;
  }
};

interface ProbeItemProps {
  probe: Probe;
  index: number;
}

const ProbeItem: React.FC<ProbeItemProps> = ({ probe, index }) => {
  const theme = useTheme();
  const WifiIcon = getWifiIcon(probe.wifiStrength);
  const BatteryIcon = getBatteryIcon(probe.batteryLevel);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <ListItem
        sx={{
          borderRadius: 2,
          mb: 1,
          backgroundColor: probe.status === 'online' ? colors.status.success + '05' : 
                          probe.status === 'offline' ? colors.status.error + '05' :
                          colors.status.warning + '05',
          border: '1px solid',
          borderColor: probe.status === 'online' ? colors.status.success + '20' :
                      probe.status === 'offline' ? colors.status.error + '20' :
                      colors.status.warning + '20',
        }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: getStatusColor(probe.status === 'maintenance' ? 'warning' : probe.status) + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SensorIcon sx={{ fontSize: 16, color: getStatusColor(probe.status === 'maintenance' ? 'warning' : probe.status) }} />
          </Box>
        </ListItemIcon>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {probe.name}
              </Typography>
              {getStatusIcon(probe.status)}
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {probe.location.fieldName} • {getLastActiveText(probe.lastActive)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                {/* Battery Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BatteryIcon sx={{ fontSize: 14, color: getBatteryColor(probe.batteryLevel) }} />
                  <Typography variant="caption" sx={{ fontWeight: 500, color: getBatteryColor(probe.batteryLevel) }}>
                    {probe.batteryLevel}%
                  </Typography>
                </Box>

                {/* WiFi Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WifiIcon sx={{ fontSize: 14, color: getWifiColor(probe.wifiStrength) }} />
                  <Typography variant="caption" sx={{ fontWeight: 500, color: getWifiColor(probe.wifiStrength) }}>
                    {probe.wifiStrength}%
                  </Typography>
                </Box>

                {/* Water Tank Level */}
                {probe.waterTankLevel > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tank: {probe.waterTankLevel}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          }
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Refresh Status">
            <IconButton size="small">
              <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton size="small">
              <SettingsIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </ListItem>
    </motion.div>
  );
};

const ConnectivityStatus: React.FC = () => {
  const theme = useTheme();
  
  const onlineCount = mockProbes.filter(p => p.status === 'online').length;
  const totalCount = mockProbes.length;
  const offlineCount = mockProbes.filter(p => p.status === 'offline').length;
  const maintenanceCount = mockProbes.filter(p => p.status === 'maintenance').length;

  const averageBattery = Math.round(
    mockProbes.reduce((sum, probe) => sum + probe.batteryLevel, 0) / mockProbes.length
  );

  const averageWifi = Math.round(
    mockProbes.filter(p => p.wifiStrength > 0).reduce((sum, probe) => sum + probe.wifiStrength, 0) / 
    mockProbes.filter(p => p.wifiStrength > 0).length
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Device Connectivity
          </Typography>

          {/* Overall Status */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Network Status
              </Typography>
              <Chip
                label={`${onlineCount}/${totalCount} Online`}
                color={onlineCount === totalCount ? 'success' : offlineCount > 0 ? 'error' : 'warning'}
                size="small"
              />
            </Box>

            <LinearProgress
              variant="determinate"
              value={(onlineCount / totalCount) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.neutral[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: onlineCount === totalCount ? colors.status.success : 
                                 offlineCount > 0 ? colors.status.error : 
                                 colors.status.warning,
                  borderRadius: 4,
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {onlineCount} Online
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {offlineCount} Offline • {maintenanceCount} Maintenance
              </Typography>
            </Box>
          </Box>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box 
              sx={{ 
                flex: 1, 
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: colors.neutral[50],
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: getBatteryColor(averageBattery) }}>
                {averageBattery}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg Battery
              </Typography>
            </Box>
            <Box 
              sx={{ 
                flex: 1, 
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: colors.neutral[50],
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: getWifiColor(averageWifi) }}>
                {averageWifi}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg WiFi
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Device List */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Connected Devices
          </Typography>

          <List sx={{ p: 0 }}>
            {mockProbes.map((probe, index) => (
              <ProbeItem key={probe.id} probe={probe} index={index} />
            ))}
          </List>

          {/* Last Update */}
          <Box sx={{ textAlign: 'center', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConnectivityStatus;