import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Tooltip,
  Badge,
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
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  WaterDrop as WaterIcon,
  Bluetooth as BluetoothIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Probe, ProbeGroup } from '../../types';
import { colors, getStatusColor } from '../../utils/theme';

interface ProbeGridProps {
  probes: Probe[];
  groups: ProbeGroup[];
  onProbeClick: (probe: Probe) => void;
  onRefreshProbe: (probeId: string) => void;
}

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

const getGroupInfo = (probe: Probe, groups: ProbeGroup[]) => {
  if (!probe.groupId) return null;
  return groups.find(g => g.id === probe.groupId);
};

interface ProbeCardProps {
  probe: Probe;
  groups: ProbeGroup[];
  index: number;
  onProbeClick: (probe: Probe) => void;
  onRefreshProbe: (probeId: string) => void;
}

const ProbeCard: React.FC<ProbeCardProps> = ({ 
  probe, 
  groups, 
  index, 
  onProbeClick, 
  onRefreshProbe 
}) => {
  const theme = useTheme();
  const WifiIcon = getWifiIcon(probe.wifiStrength);
  const BatteryIcon = getBatteryIcon(probe.batteryLevel);
  const groupInfo = getGroupInfo(probe, groups);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          border: '1px solid',
          borderColor: probe.status === 'online' ? colors.status.success + '40' :
                      probe.status === 'offline' ? colors.status.error + '40' :
                      colors.status.warning + '40',
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
        onClick={() => onProbeClick(probe)}
      >
        {/* Status indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: getStatusColor(probe.status === 'maintenance' ? 'warning' : probe.status),
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
          }}
        />

        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: `${getStatusColor(probe.status === 'maintenance' ? 'warning' : probe.status)}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {probe.isBluetoothConnected ? (
                    <Badge
                      badgeContent={<BluetoothIcon sx={{ fontSize: 8 }} />}
                      color="primary"
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <SensorIcon sx={{ fontSize: 20, color: getStatusColor(probe.status === 'maintenance' ? 'warning' : probe.status) }} />
                    </Badge>
                  ) : (
                    <SensorIcon sx={{ fontSize: 20, color: getStatusColor(probe.status === 'maintenance' ? 'warning' : probe.status) }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {probe.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {probe.uuid}
                  </Typography>
                </Box>
              </Box>

              {/* Group chip */}
              {groupInfo && (
                <Chip
                  label={groupInfo.name}
                  size="small"
                  sx={{
                    backgroundColor: `${groupInfo.color}20`,
                    color: groupInfo.color,
                    fontWeight: 500,
                    mb: 1,
                  }}
                />
              )}
            </Box>

            <Tooltip title="Refresh Data">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefreshProbe(probe.id);
                }}
              >
                <RefreshIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Status */}
          <Box sx={{ mb: 2 }}>
            <Chip
              label={probe.status.toUpperCase()}
              color={probe.status === 'online' ? 'success' : 
                    probe.status === 'offline' ? 'error' : 'warning'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Location and Last Active */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {probe.location.fieldName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {getLastActiveText(probe.lastActive)}
            </Typography>
          </Box>

          {/* Sensor readings preview */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Current Readings
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, backgroundColor: colors.neutral[50], borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Moisture
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.sensor.moisture }}>
                    {probe.currentReading.soilMoisture.toFixed(0)}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, backgroundColor: colors.neutral[50], borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Temp
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.sensor.temperature }}>
                    {probe.currentReading.temperature.toFixed(1)}°C
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, backgroundColor: colors.neutral[50], borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    pH
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.sensor.pH }}>
                    {probe.currentReading.pH.toFixed(1)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, backgroundColor: colors.neutral[50], borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    N-P-K
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.sensor.nitrogen }}>
                    {probe.currentReading.nitrogen.toFixed(0)}-{probe.currentReading.phosphorus.toFixed(0)}-{probe.currentReading.potassium.toFixed(0)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* System Status */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              System Status
            </Typography>
            
            {/* Battery */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <BatteryIcon sx={{ fontSize: 18, color: getBatteryColor(probe.batteryLevel) }} />
              <LinearProgress
                variant="determinate"
                value={probe.batteryLevel}
                sx={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.neutral[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getBatteryColor(probe.batteryLevel),
                  },
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 35 }}>
                {probe.batteryLevel}%
              </Typography>
            </Box>

            {/* WiFi */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WifiIcon sx={{ fontSize: 18, color: getWifiColor(probe.wifiStrength) }} />
              <LinearProgress
                variant="determinate"
                value={probe.wifiStrength}
                sx={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.neutral[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getWifiColor(probe.wifiStrength),
                  },
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 35 }}>
                {probe.wifiStrength}%
              </Typography>
            </Box>

            {/* Water Tank (if available) */}
            {probe.waterTankLevel > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WaterIcon sx={{ fontSize: 18, color: colors.sensor.moisture }} />
                <LinearProgress
                  variant="determinate"
                  value={probe.waterTankLevel}
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.neutral[200],
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: probe.waterTankLevel < 30 ? colors.status.error :
                                     probe.waterTankLevel < 60 ? colors.status.warning :
                                     colors.status.success,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 35 }}>
                  {probe.waterTankLevel}%
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProbeGrid: React.FC<ProbeGridProps> = ({ 
  probes, 
  groups, 
  onProbeClick, 
  onRefreshProbe 
}) => {
  return (
    <Grid container spacing={3}>
      {probes.map((probe, index) => (
        <Grid item xs={12} sm={6} lg={4} key={probe.id}>
          <ProbeCard
            probe={probe}
            groups={groups}
            index={index}
            onProbeClick={onProbeClick}
            onRefreshProbe={onRefreshProbe}
          />
        </Grid>
      ))}
      
      {probes.length === 0 && (
        <Grid item xs={12}>
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'text.secondary',
            }}
          >
            <SensorIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No probes found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or add a new probe
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ProbeGrid;