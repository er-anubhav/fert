import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import {
  Sensors as SensorIcon,
  SignalWifiOff as WifiOffIcon,
  Battery20 as BatteryLowIcon,
  CheckCircle as OnlineIcon,
  Error as OfflineIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Probe } from '../../types';
import { colors } from '../../utils/theme';

// Mock probe data
const mockProbes: Probe[] = [
  {
    id: 'probe-001',
    uuid: 'uuid-001',
    name: 'Probe 001',
    groupId: 'group-001',
    status: 'offline',
    batteryLevel: 0,
    wifiStrength: 0,
    lastActive: new Date('2025-12-03'), // 3.12.2025
    location: { fieldName: 'Newgen IEDC' },
    currentReading: {} as any,
    isBluetoothConnected: false,
    waterTankLevel: 0,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return colors.neutral[600];
    case 'offline': return colors.neutral[400];
    case 'maintenance': return colors.neutral[500];
    default: return colors.neutral[400];
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online': return <OnlineIcon sx={{ fontSize: 16 }} />;
    case 'offline': return <OfflineIcon sx={{ fontSize: 16 }} />;
    case 'maintenance': return <WarningIcon sx={{ fontSize: 16 }} />;
    default: return <OfflineIcon sx={{ fontSize: 16 }} />;
  }
};



const ConnectivityStatus: React.FC = () => {
  const onlineCount = mockProbes.filter(p => p.status === 'online').length;
  const totalCount = mockProbes.length;
  const offlineCount = mockProbes.filter(p => p.status === 'offline').length;
  const issuesCount = mockProbes.filter(p => p.status !== 'online').length;
  
  // Get devices needing attention
  const criticalDevices = mockProbes.filter(p => 
    p.status === 'offline' || p.batteryLevel < 20 || p.wifiStrength === 0
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Status Overview */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: colors.neutral[200], borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 200, mb: 0.5 }}>
              Probe 001
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last synced 2 days Ago
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ 
            fontWeight: 200, 
            color: onlineCount === totalCount ? colors.neutral[900] : colors.neutral[500]
          }}>
            Disconnected
          </Typography>
        </Box>
      </Paper>

     
      
      {/* All Good State */}
      {criticalDevices.length === 0 && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            border: '1px solid', 
            borderColor: colors.neutral[200], 
            borderRadius: 1,
            backgroundColor: colors.neutral[25],
          }}
        >
          <Typography variant="body2" color="text.secondary">
            ✅ All devices operating normally
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ConnectivityStatus;