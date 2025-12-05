import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import {
  Air as WindIcon,
  Opacity as HumidityIcon,
  Grain as RainIcon,
} from '@mui/icons-material';
import { WeatherData } from '../../types';
import { colors } from '../../utils/theme';

// Winter weather data for December
const mockWeatherData: WeatherData = {
  current: {
    temperature: 8.2,
    humidity: 78,
    windSpeed: 8.5,
    windDirection: 'NE',
    precipitation: 15,
    uvIndex: 2,
    visibility: 12,
    pressure: 1019.8,
    condition: 'cloudy',
    icon: '☁️',
  },
  forecast: [
    {
      date: new Date(),
      high: 11,
      low: 5,
      condition: 'cloudy',
      icon: '☁️',
      precipitation: 25,
      humidity: 75,
    },
    {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      high: 9,
      low: 3,
      condition: 'partly-cloudy',
      icon: '⛅',
      precipitation: 10,
      humidity: 68,
    },
    {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      high: 6,
      low: 1,
      condition: 'light-rain',
      icon: '🌦️',
      precipitation: 60,
      humidity: 82,
    },
    {
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      high: 12,
      low: 4,
      condition: 'sunny',
      icon: '☀️',
      precipitation: 0,
      humidity: 65,
    },
    {
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      high: 7,
      low: 2,
      condition: 'cloudy',
      icon: '☁️',
      precipitation: 30,
      humidity: 80,
    },
  ],
};



const WeatherWidget: React.FC = () => {
  const { current, forecast } = mockWeatherData;
  const todayForecast = forecast[0];
  const tomorrowForecast = forecast[1];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Current Conditions - Compact */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: colors.neutral[200], borderRadius: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 200, lineHeight: 1.5 }}>
              {current.temperature}°
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {current.icon} {current.condition.replace('-', ' ')}
            </Typography>
          </Box>
          
          {/* Essential metrics only */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <HumidityIcon sx={{ fontSize: 16, color: colors.neutral[600] }} />
              <Typography variant="caption" display="block" color="text.secondary">
                {current.humidity}%
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <WindIcon sx={{ fontSize: 16, color: colors.neutral[600] }} />
              <Typography variant="caption" display="block" color="text.secondary">
                {current.windSpeed}km/h
              </Typography>
            </Box>
            {current.precipitation > 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <RainIcon sx={{ fontSize: 16, color: colors.neutral[600] }} />
                <Typography variant="caption" display="block" color="text.secondary">
                  {current.precipitation}%
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Compact Today & Tomorrow Forecast */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Paper elevation={0} sx={{ flex: 1, p: 1.5, border: '1px solid', borderColor: colors.neutral[200], borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Today
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2">{todayForecast.icon}</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                {todayForecast.precipitation}%
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 200 }}>
              {todayForecast.high}°/{todayForecast.low}°
            </Typography>
          </Box>
        </Paper>
        
        <Paper elevation={0} sx={{ flex: 1, p: 1.5, border: '1px solid', borderColor: colors.neutral[200], borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Tomorrow
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2">{tomorrowForecast.icon}</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                {tomorrowForecast.precipitation}%
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 200 }}>
              {tomorrowForecast.high}°/{tomorrowForecast.low}°
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Simple Rain Alert */}
      {forecast.some(day => day.precipitation > 70) && (
        <Paper 
          elevation={0} 
          sx={{ 
            mt: 1.5, 
            p: 1.5, 
            backgroundColor: colors.neutral[50], 
            border: '1px solid', 
            borderColor: colors.neutral[200],
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
            ⚠️ Heavy rain expected - adjust irrigation
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default WeatherWidget;