import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  WbSunny as SunIcon,
  Cloud as CloudIcon,
  Grain as RainIcon,
  Air as WindIcon,
  Visibility as VisibilityIcon,
  Compress as PressureIcon,
  Thermostat as ThermostatIcon,
  Opacity as HumidityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { WeatherData } from '../../types';
import { colors } from '../../utils/theme';

// Mock weather data
const mockWeatherData: WeatherData = {
  current: {
    temperature: 24.5,
    humidity: 68,
    windSpeed: 12.5,
    windDirection: 'NW',
    precipitation: 0,
    uvIndex: 6,
    visibility: 10,
    pressure: 1013.2,
    condition: 'partly-cloudy',
    icon: '⛅',
  },
  forecast: [
    {
      date: new Date(),
      high: 26,
      low: 18,
      condition: 'partly-cloudy',
      icon: '⛅',
      precipitation: 10,
      humidity: 65,
    },
    {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      high: 28,
      low: 19,
      condition: 'sunny',
      icon: '☀️',
      precipitation: 0,
      humidity: 58,
    },
    {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      high: 22,
      low: 16,
      condition: 'rainy',
      icon: '🌧️',
      precipitation: 85,
      humidity: 78,
    },
    {
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      high: 25,
      low: 17,
      condition: 'cloudy',
      icon: '☁️',
      precipitation: 20,
      humidity: 72,
    },
    {
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      high: 27,
      low: 20,
      condition: 'sunny',
      icon: '☀️',
      precipitation: 0,
      humidity: 55,
    },
  ],
};

const getUVIndexColor = (uvIndex: number) => {
  if (uvIndex <= 2) return colors.status.success;
  if (uvIndex <= 5) return colors.status.warning;
  if (uvIndex <= 7) return colors.secondary[600];
  if (uvIndex <= 10) return colors.status.error;
  return '#8B00FF'; // Violet for extreme
};

const getUVIndexLabel = (uvIndex: number) => {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
};

const WeatherWidget: React.FC = () => {
  const theme = useTheme();
  const { current, forecast } = mockWeatherData;

  const formatDay = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Weather Conditions
          </Typography>

          {/* Current Weather */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1 }}>
                  {current.temperature}°C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Feels like {current.temperature + 2}°C
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2">{current.icon}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {current.condition.replace('-', ' ').toUpperCase()}
                </Typography>
              </Box>
            </Box>

            {/* Weather Details Grid */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HumidityIcon sx={{ fontSize: 18, color: colors.sensor.humidity }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Humidity
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {current.humidity}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WindIcon sx={{ fontSize: 18, color: colors.neutral[600] }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Wind
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {current.windSpeed} km/h {current.windDirection}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RainIcon sx={{ fontSize: 18, color: colors.sensor.moisture }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Precipitation
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {current.precipitation}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PressureIcon sx={{ fontSize: 18, color: colors.neutral[600] }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Pressure
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {current.pressure} hPa
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* UV Index */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                UV Index
              </Typography>
              <Chip
                label={getUVIndexLabel(current.uvIndex)}
                size="small"
                sx={{
                  backgroundColor: `${getUVIndexColor(current.uvIndex)}20`,
                  color: getUVIndexColor(current.uvIndex),
                  fontWeight: 600,
                }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={(current.uvIndex / 12) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.neutral[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getUVIndexColor(current.uvIndex),
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {current.uvIndex}/12 - {current.uvIndex > 6 ? 'Protection recommended' : 'Safe exposure'}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 5-Day Forecast */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            5-Day Forecast
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {forecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1,
                    px: 1.5,
                    borderRadius: 1,
                    backgroundColor: index === 0 ? colors.primary[50] : 'transparent',
                    border: index === 0 ? '1px solid' : 'none',
                    borderColor: index === 0 ? colors.primary[200] : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: index === 0 ? 600 : 400,
                        minWidth: 60,
                        color: index === 0 ? 'primary.main' : 'text.primary',
                      }}
                    >
                      {formatDay(day.date)}
                    </Typography>
                    <Typography variant="body1">{day.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={day.precipitation}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: colors.neutral[200],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: colors.sensor.moisture,
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {day.precipitation}% rain
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {day.high}°
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {day.low}°
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Weather Alert */}
          {forecast.some(day => day.precipitation > 70) && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: colors.status.info + '20',
                border: '1px solid',
                borderColor: colors.status.info + '40',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: colors.status.info, mb: 0.5 }}>
                Weather Advisory
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Heavy rain expected in 2 days. Consider adjusting irrigation schedule.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherWidget;