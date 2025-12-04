import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  WaterDrop as MoistureIcon,
  Thermostat as TemperatureIcon,
  Opacity as HumidityIcon,
  Science as NPKIcon,
  Tune as PHIcon,
  LocalDrink as WaterTankIcon,
  SignalWifi4Bar as ConnectivityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DashboardCard } from '../../types';
import { getStatusColor, colors } from '../../utils/theme';

// Mock data - in production, this would come from your API
const mockSummaryData: DashboardCard[] = [
  {
    id: 'moisture',
    title: 'Soil Moisture',
    value: 68,
    unit: '%',
    change: { value: +5, trend: 'up', period: '24h' },
    status: 'normal',
    icon: 'moisture',
    color: colors.sensor.moisture,
  },
  {
    id: 'temperature',
    title: 'Temperature',
    value: 24.5,
    unit: '°C',
    change: { value: -2, trend: 'down', period: '24h' },
    status: 'normal',
    icon: 'temperature',
    color: colors.sensor.temperature,
  },
  {
    id: 'humidity',
    title: 'Humidity',
    value: 72,
    unit: '%',
    change: { value: +3, trend: 'up', period: '24h' },
    status: 'normal',
    icon: 'humidity',
    color: colors.sensor.humidity,
  },
  {
    id: 'npk',
    title: 'N-P-K Levels',
    value: 'Balanced',
    change: { value: 0, trend: 'stable', period: '7d' },
    status: 'normal',
    icon: 'npk',
    color: colors.sensor.nitrogen,
  },
  {
    id: 'ph',
    title: 'pH Level',
    value: 6.8,
    change: { value: +0.2, trend: 'up', period: '24h' },
    status: 'normal',
    icon: 'ph',
    color: colors.sensor.pH,
  },
  {
    id: 'water_tank',
    title: 'Water Tank',
    value: 85,
    unit: '%',
    change: { value: -15, trend: 'down', period: '24h' },
    status: 'warning',
    icon: 'water_tank',
    color: colors.primary[500],
  },
];

const iconMap = {
  moisture: MoistureIcon,
  temperature: TemperatureIcon,
  humidity: HumidityIcon,
  npk: NPKIcon,
  ph: PHIcon,
  water_tank: WaterTankIcon,
  connectivity: ConnectivityIcon,
};

interface SummaryCardProps {
  data: DashboardCard;
  index: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data, index }) => {
  const theme = useTheme();
  const Icon = iconMap[data.icon as keyof typeof iconMap];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return colors.status.success;
      case 'down': return colors.status.error;
      case 'stable': return colors.neutral[500];
      default: return colors.neutral[500];
    }
  };

  const getTrendSymbol = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ width: '100%', display: 'flex' }}
    >
      <Card 
        sx={{ 
          width: '100%',
          height: '100%',
          minHeight: { xs: 160, sm: 180 },
          position: 'relative',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          '&:hover': {
            boxShadow: theme.shadows[8],
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
          borderRadius: 2,
        }}
      >
        {/* Status indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: getStatusColor(data.status),
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
          }}
        />

        <CardContent sx={{ 
          p: { xs: 2, sm: 2.5 }, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}>
          {/* Header section */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" color="text.secondary" sx={{ 
                fontWeight: 500, 
                mb: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: 1.2,
              }}>
                {data.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  lineHeight: 1,
                  fontSize: { xs: '1.5rem', sm: '1.875rem' },
                  color: 'text.primary',
                }}>
                  {data.value}
                </Typography>
                {data.unit && (
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 500,
                  }}>
                    {data.unit}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box
              sx={{
                width: { xs: 36, sm: 44 },
                height: { xs: 36, sm: 44 },
                borderRadius: 1.5,
                backgroundColor: `${data.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                ml: 1.5,
              }}
            >
              <Icon sx={{ fontSize: { xs: 18, sm: 22 }, color: data.color }} />
            </Box>
          </Box>
          
          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Change indicator - always at bottom */}
          <Box sx={{ mt: 'auto' }}>
            {data.change && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Chip
                  label={`${getTrendSymbol(data.change.trend)} ${Math.abs(data.change.value)}${data.unit || ''}`}
                  size="small"
                  sx={{
                    backgroundColor: `${getTrendColor(data.change.trend)}15`,
                    color: getTrendColor(data.change.trend),
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  vs {data.change.period}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Special progress bar for water tank */}
          {data.id === 'water_tank' && typeof data.value === 'number' && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={data.value} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: colors.neutral[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: data.value < 30 ? colors.status.error : 
                                  data.value < 60 ? colors.status.warning : 
                                  colors.status.success,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {data.value < 30 ? 'Low Level - Refill Soon' : 
                 data.value < 60 ? 'Moderate Level' : 
                 'Good Level'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SummaryCards: React.FC = () => {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
        xl: 'repeat(6, 1fr)',
      },
      gap: { xs: 2, sm: 2.5, md: 3 },
      width: '100%',
    }}>
      {mockSummaryData.map((card, index) => (
        <Box key={card.id} sx={{ 
          minHeight: { xs: 160, sm: 180 },
          display: 'flex',
        }}>
          <SummaryCard data={card} index={index} />
        </Box>
      ))}
    </Box>
  );
};

export default SummaryCards;