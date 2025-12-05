import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  useTheme,
  Chip,
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

interface ChartPanelProps {
  children?: React.ReactNode;
  chartType: string;
  activeChart: string;
}

const ChartPanel: React.FC<ChartPanelProps> = ({ children, chartType, activeChart }) => {
  return (
    <div style={{ display: chartType === activeChart ? 'block' : 'none' }}>
      <Box sx={{ mt: 0 }}>{children}</Box>
    </div>
  );
};

const chartOptions = [
  { value: 'moisture', label: 'Moisture & Climate', icon: '💧' },
  { value: 'npk', label: 'NPK Nutrients', icon: '🌱' },
  { value: 'ph', label: 'pH & Trends', icon: '⚖️' },
  { value: 'nutrients', label: 'Micro/Macro Nutrients', icon: '🧪' },
];

const LiveCharts: React.FC = () => {
  const [activeChart, setActiveChart] = useState('moisture');
  const theme = useTheme();

  const handleChartChange = (event: any) => {
    setActiveChart(event.target.value);
  };

  const getActiveChartInfo = () => {
    return chartOptions.find(option => option.value === activeChart) || chartOptions[0];
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
    <Card sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          p: 3,
          pb: 0
        }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={activeChart}
                onChange={handleChartChange}
                label="Chart Type"
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary[300],
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary[400],
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary[500],
                  },
                }}
              >
                {chartOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Refresh Data">
                <IconButton 
                  size="small"
                  sx={{ 
                    backgroundColor: colors.neutral[100],
                    '&:hover': { backgroundColor: colors.neutral[200] },
                    borderRadius: 1.5,
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Fullscreen">
                <IconButton 
                  size="small"
                  sx={{ 
                    backgroundColor: colors.neutral[100],
                    '&:hover': { backgroundColor: colors.neutral[200] },
                    borderRadius: 1.5,
                  }}
                >
                  <FullscreenIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export Data">
                <IconButton 
                  size="small"
                  sx={{ 
                    backgroundColor: colors.neutral[100],
                    '&:hover': { backgroundColor: colors.neutral[200] },
                    borderRadius: 1.5,
                  }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Moisture & Climate Chart */}
        <ChartPanel chartType="moisture" activeChart={activeChart}>
          <Box sx={{ width: '100%', pl: 0, pr: 0 }}>
            <Box sx={{ height: 200,mb: 6 , width: '100%' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 200, pl: 3 }}>
                Soil Moisture (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="95%" height="100%" minWidth={0}>
                <AreaChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          </Box>
        </ChartPanel>

        {/* NPK Nutrients Chart */}
        <ChartPanel chartType="npk" activeChart={activeChart}>
          <Box sx={{  height: 200,mb: 6 , width: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, pl: 3 }}>
              N-P-K Trinity Graph (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="95%" height="100%" minWidth={0}>
              <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
        </ChartPanel>

        {/* pH & Trends Chart */}
        <ChartPanel chartType="ph" activeChart={activeChart}>
          <Box sx={{ width: '100%', pl: 0, pr: 0 }}>
            <Box sx={{ height: 200,mb: 6 , width: '100%'  }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, pl: 3 }}>
                pH Level Trends
              </Typography>
              <ResponsiveContainer width="70%" height="100%" minWidth={0}>
                <LineChart data={mockData} margin={{ top: 5, right: 5, left: 15, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke={colors.neutral[600]}
                    fontSize={12}
                    tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                    interval="preserveStartEnd"
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
                    strokeWidth={1}
                    dot={{ fill: colors.sensor.pH, strokeWidth: 1, r: 0.5 }}
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
          </Box>
        </ChartPanel>

        {/* Micro/Macro Nutrients Chart */}
        <ChartPanel chartType="nutrients" activeChart={activeChart}>
          <Box sx={{ width: '100%', pl: 0, pr: 0 }}>
            <Box sx={{  height: 200,mb: 6 , width: '100%'  }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, pl: 3 }}>
                Nutrient Levels (Current vs Optimal)
              </Typography>
              <ResponsiveContainer width="95%" height="100%" minWidth={0}>
                <BarChart
                  data={[
                    { name: 'Iron', value: 12.5, optimal: 15 },
                    { name: 'Zinc', value: 8.2, optimal: 10 },
                    { name: 'Manganese', value: 15.8, optimal: 18 },
                    { name: 'Copper', value: 3.1, optimal: 4 },
                    { name: 'Boron', value: 0.8, optimal: 1.2 },
                    { name: 'Calcium', value: 85, optimal: 90 },
                    { name: 'Magnesium', value: 22, optimal: 25 },
                    { name: 'Sulfur', value: 18, optimal: 20 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                  <XAxis dataKey="name" stroke={colors.neutral[600]} fontSize={12} />
                  <YAxis stroke={colors.neutral[600]} fontSize={12} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" fill={colors.secondary[500]} name="Current" />
                  <Bar dataKey="optimal" fill={colors.neutral[300]} name="Optimal" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </ChartPanel>
      </CardContent>
    </Card>
  );
};

export default LiveCharts;