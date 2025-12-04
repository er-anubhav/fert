import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Badge,
  Collapse,
  Button,
  Divider,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Security as SecurityIcon,
  WbCloudy as WeatherIcon,
  DeviceHub as DeviceIcon,
  Water as IrrigationIcon,
  Science as NutrientIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  NotificationImportant as AlertIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../../types';
import { colors, getStatusColor } from '../../utils/theme';

// Mock alerts data
const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'security',
    severity: 'warning',
    title: 'Motion Detected',
    message: 'Unusual activity detected in North Field at 14:23. Camera #2 recorded movement.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    acknowledged: false,
    probeId: 'probe-001',
    actionUrl: '/security',
  },
  {
    id: 'alert-002',
    type: 'weather',
    severity: 'critical',
    title: 'Frost Warning',
    message: 'Temperature expected to drop below 0°C tonight. Protect sensitive crops.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    acknowledged: false,
  },
  {
    id: 'alert-003',
    type: 'device',
    severity: 'error',
    title: 'Probe Offline',
    message: 'West Garden Monitor has been offline for 3 hours. Check connectivity.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    acknowledged: false,
    probeId: 'probe-004',
    actionUrl: '/probes',
  },
  {
    id: 'alert-004',
    type: 'irrigation',
    severity: 'info',
    title: 'Irrigation Completed',
    message: 'Automatic irrigation cycle completed in Greenhouse A. Duration: 25 minutes.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    acknowledged: false,
    actionUrl: '/irrigation',
  },
  {
    id: 'alert-005',
    type: 'nutrient',
    severity: 'warning',
    title: 'Low Nitrogen Detected',
    message: 'Nitrogen levels in South Field below optimal range (32 ppm vs 45-60 ppm).',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    acknowledged: true,
    probeId: 'probe-003',
  },
  {
    id: 'alert-006',
    type: 'device',
    severity: 'warning',
    title: 'Low Battery Warning',
    message: 'West Garden Monitor battery at 8%. Replace or recharge soon.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    acknowledged: false,
    probeId: 'probe-004',
  },
];

const alertTypeIcons = {
  security: SecurityIcon,
  weather: WeatherIcon,
  device: DeviceIcon,
  irrigation: IrrigationIcon,
  nutrient: NutrientIcon,
};

const severityIcons = {
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  critical: ErrorIcon,
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return colors.status.error;
    case 'error': return colors.status.error;
    case 'warning': return colors.status.warning;
    case 'info': return colors.status.info;
    default: return colors.neutral[500];
  }
};

const getTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'Just now';
  }
};

interface AlertItemProps {
  alert: Alert;
  index: number;
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, index, onAcknowledge, onDismiss }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  
  const TypeIcon = alertTypeIcons[alert.type];
  const SeverityIcon = severityIcons[alert.severity];

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

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
          border: '1px solid',
          borderColor: alert.acknowledged ? colors.neutral[200] : `${getSeverityColor(alert.severity)}40`,
          backgroundColor: alert.acknowledged ? colors.neutral[25] : 'white',
          opacity: alert.acknowledged ? 0.6 : 1,
          '&:hover': {
            backgroundColor: colors.neutral[50],
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <Box
            sx={{
              position: 'relative',
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: `${getSeverityColor(alert.severity)}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TypeIcon sx={{ fontSize: 16, color: getSeverityColor(alert.severity) }} />
            {!alert.acknowledged && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: getSeverityColor(alert.severity),
                }}
              />
            )}
          </Box>
        </ListItemIcon>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {alert.title}
              </Typography>
              <Chip
                label={alert.severity.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: `${getSeverityColor(alert.severity)}20`,
                  color: getSeverityColor(alert.severity),
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {alert.message}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {getTimeAgo(alert.timestamp)}
                </Typography>
                {alert.probeId && (
                  <Chip
                    label={alert.probeId}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            </Box>
          }
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {!alert.acknowledged && (
            <>
              <Tooltip title="Acknowledge">
                <IconButton size="small" onClick={() => onAcknowledge(alert.id)}>
                  <CheckIcon sx={{ fontSize: 16, color: colors.status.success }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dismiss">
                <IconButton size="small" onClick={() => onDismiss(alert.id)}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          <IconButton
            size="small"
            onClick={handleToggleExpand}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: theme.transitions.create('transform'),
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: colors.neutral[50],
              border: '1px solid',
              borderColor: colors.neutral[200],
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Alert Details
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Type: {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Timestamp: {alert.timestamp.toLocaleString()}
              </Typography>
              {alert.probeId && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Affected Device: {alert.probeId}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {alert.actionUrl && (
                <Button variant="outlined" size="small" href={alert.actionUrl}>
                  View Details
                </Button>
              )}
              {!alert.acknowledged && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => onDismiss(alert.id)}
                  >
                    Dismiss
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Collapse>
    </motion.div>
  );
};

const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'critical' | 'unacknowledged'>('all');

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'critical':
        return alert.severity === 'critical';
      case 'unacknowledged':
        return !alert.acknowledged;
      default:
        return true;
    }
  });

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AlertIcon sx={{ color: colors.primary[500] }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Alerts & Notifications
              </Typography>
              {unacknowledgedCount > 0 && (
                <Badge badgeContent={unacknowledgedCount} color="error">
                  <Box />
                </Badge>
              )}
            </Box>
          </Box>

          {/* Filter Chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label="All"
              size="small"
              variant={filter === 'all' ? 'filled' : 'outlined'}
              onClick={() => setFilter('all')}
              clickable
            />
            <Chip
              label={`${unacknowledgedCount} New`}
              size="small"
              color="primary"
              variant={filter === 'unacknowledged' ? 'filled' : 'outlined'}
              onClick={() => setFilter('unacknowledged')}
              clickable
            />
            <Chip
              label={`${criticalCount} Critical`}
              size="small"
              color="error"
              variant={filter === 'critical' ? 'filled' : 'outlined'}
              onClick={() => setFilter('critical')}
              clickable
            />
          </Box>

          {/* Quick Actions */}
          {unacknowledgedCount > 0 && (
            <Box sx={{ mb: 2 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setAlerts(prevAlerts =>
                    prevAlerts.map(alert => ({ ...alert, acknowledged: true }))
                  );
                }}
              >
                Acknowledge All
              </Button>
            </Box>
          )}

          <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
            <AnimatePresence>
              {filteredAlerts.map((alert, index) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  index={index}
                  onAcknowledge={handleAcknowledge}
                  onDismiss={handleDismiss}
                />
              ))}
            </AnimatePresence>
          </List>

          {filteredAlerts.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                color: 'text.secondary',
              }}
            >
              <CheckIcon sx={{ fontSize: 48, color: colors.status.success, mb: 1 }} />
              <Typography variant="body2">
                {filter === 'all' ? 'No alerts' : 
                 filter === 'critical' ? 'No critical alerts' : 
                 'No unacknowledged alerts'}
              </Typography>
              {filter !== 'all' && (
                <Typography variant="caption" color="text.secondary">
                  All systems running normally
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AlertsPanel;