import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { format, subHours } from 'date-fns';
import { colors } from '../../utils/theme';

// Mock data generator
const generateMockData = (days: number = 7) => {
  const data = [];
  const now = new Date();
  
  for (let i = days * 24; i >= 0; i--) {
    const timestamp = subHours(now, i);
    data.push({
      timestamp: timestamp.toISOString(),
      time: format(timestamp, 'HH:mm'),
      date: format(timestamp, 'MM/dd'),
      soilMoisture: 60 + Math.sin(i * 0.1) * 15 + Math.random() * 10,
      temperature: 22 + Math.sin(i * 0.05) * 8 + Math.random() * 4,
      humidity: 65 + Math.cos(i * 0.08) * 20 + Math.random() * 8,
      nitrogen: 45 + Math.sin(i * 0.02) * 10 + Math.random() * 5,
      phosphorus: 38 + Math.cos(i * 0.03) * 8 + Math.random() * 4,
      potassium: 52 + Math.sin(i * 0.025) * 12 + Math.random() * 6,
      pH: 6.5 + Math.sin(i * 0.01) * 0.5 + Math.random() * 0.3,
    });
  }
  
  return data;
};

const mockData = generateMockData(7);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const LiveCharts: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'soilMoisture':
        return [`${value.toFixed(1)}%`, 'Soil Moisture'];
      case 'temperature':
        return [`${value.toFixed(1)}°C`, 'Temperature'];
      case 'humidity':
        return [`${value.toFixed(1)}%`, 'Humidity'];
      case 'nitrogen':
        return [`${value.toFixed(1)} ppm`, 'Nitrogen'];
      case 'phosphorus':
        return [`${value.toFixed(1)} ppm`, 'Phosphorus'];
      case 'potassium':
        return [`${value.toFixed(1)} ppm`, 'Potassium'];
      case 'pH':
        return [`${value.toFixed(2)}`, 'pH Level'];
      default:
        return [value.toFixed(1), name];
    }
  };

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
      dataKey: string;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {(() => {
              try {
                if (!label) return 'Unknown Time';
                const date = new Date(label);
                if (isNaN(date.getTime())) return 'Invalid Date';
                return format(date, 'MMM dd, HH:mm');
              } catch (error) {
                return 'Unknown Time';
              }
            })()}
          </Typography>
          {payload.map((entry: { value: number; dataKey: string; color: string }, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="caption">
                {formatTooltipValue(entry.value, entry.dataKey)[1]}: {' '}
                <strong>{formatTooltipValue(entry.value, entry.dataKey)[0]}</strong>
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Live Sensor Data
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton size="small">
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Data">
              <IconButton size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="Moisture & Climate" />
          <Tab label="NPK Nutrients" />
          <Tab label="pH & Trends" />
          <Tab label="Micro/Macro Nutrients" />
        </Tabs>

        {/* Moisture & Climate Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Box sx={{ height: 300 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Soil Moisture (Last 7 Days)
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke={colors.neutral[600]}
                      fontSize={12}
                      tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                    />
                    <YAxis 
                      stroke={colors.neutral[600]}
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="soilMoisture"
                      stroke={colors.sensor.moisture}
                      fill={`${colors.sensor.moisture}40`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <Box sx={{ height: 300 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Temperature & Humidity
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke={colors.neutral[600]}
                      fontSize={12}
                      tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                    />
                    <YAxis 
                      stroke={colors.neutral[600]}
                      fontSize={12}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke={colors.sensor.temperature}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke={colors.sensor.humidity}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* NPK Nutrients Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ height: 400 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              N-P-K Trinity Graph (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                <XAxis 
                  dataKey="timestamp" 
                  stroke={colors.neutral[600]}
                  fontSize={12}
                  tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                />
                <YAxis 
                  stroke={colors.neutral[600]}
                  fontSize={12}
                  label={{ value: 'ppm', angle: -90, position: 'insideLeft' }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="nitrogen"
                  stroke={colors.sensor.nitrogen}
                  strokeWidth={3}
                  name="Nitrogen (N)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="phosphorus"
                  stroke={colors.sensor.phosphorus}
                  strokeWidth={3}
                  name="Phosphorus (P)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="potassium"
                  stroke={colors.sensor.potassium}
                  strokeWidth={3}
                  name="Potassium (K)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </TabPanel>

        {/* pH & Trends Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Box sx={{ height: 300 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  pH Level Trends
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke={colors.neutral[600]}
                      fontSize={12}
                      tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                    />
                    <YAxis 
                      stroke={colors.neutral[600]}
                      fontSize={12}
                      domain={[6, 8]}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="pH"
                      stroke={colors.sensor.pH}
                      strokeWidth={3}
                      dot={{ fill: colors.sensor.pH, strokeWidth: 2, r: 3 }}
                    />
                    {/* pH optimal range indicators */}
                    <Line
                      type="monotone"
                      data={mockData.map(d => ({ ...d, optimal_min: 6.0 }))}
                      dataKey="optimal_min"
                      stroke={colors.status.success}
                      strokeDasharray="5 5"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      data={mockData.map(d => ({ ...d, optimal_max: 7.5 }))}
                      dataKey="optimal_max"
                      stroke={colors.status.success}
                      strokeDasharray="5 5"
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: colors.primary[50],
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: colors.primary[200],
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  pH Status
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: colors.primary[600] }}>
                    6.8
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Current pH Level
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      borderRadius: 4,
                      background: `linear-gradient(to right, ${colors.status.error} 0%, ${colors.status.warning} 30%, ${colors.status.success} 50%, ${colors.status.warning} 70%, ${colors.status.error} 100%)`,
                      position: 'relative',
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -2,
                        left: '68%', // 6.8 on pH scale
                        width: 4,
                        height: 12,
                        backgroundColor: 'white',
                        border: '2px solid',
                        borderColor: colors.primary[600],
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="caption">5.0</Typography>
                    <Typography variant="caption">7.0</Typography>
                    <Typography variant="caption">9.0</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.status.success }}>
                    Optimal Range
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Micro/Macro Nutrients Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Box sx={{ height: 300 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Micronutrient Levels
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Iron', value: 12.5, optimal: 15 },
                      { name: 'Zinc', value: 8.2, optimal: 10 },
                      { name: 'Manganese', value: 15.8, optimal: 18 },
                      { name: 'Copper', value: 3.1, optimal: 4 },
                      { name: 'Boron', value: 0.8, optimal: 1.2 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                    <XAxis dataKey="name" stroke={colors.neutral[600]} fontSize={12} />
                    <YAxis stroke={colors.neutral[600]} fontSize={12} />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill={colors.secondary[500]} />
                    <Bar dataKey="optimal" fill={colors.neutral[300]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <Box sx={{ height: 300 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Macronutrient Levels
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Calcium', value: 85, optimal: 90 },
                      { name: 'Magnesium', value: 22, optimal: 25 },
                      { name: 'Sulfur', value: 18, optimal: 20 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                    <XAxis dataKey="name" stroke={colors.neutral[600]} fontSize={12} />
                    <YAxis stroke={colors.neutral[600]} fontSize={12} />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill={colors.primary[500]} />
                    <Bar dataKey="optimal" fill={colors.neutral[300]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default LiveCharts;