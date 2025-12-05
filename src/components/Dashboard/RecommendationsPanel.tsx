import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  IconButton,
  Chip,
  Button,
  Collapse,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  WaterDrop as IrrigationIcon,
  Science as FertilizerIcon,
  Warning as WarningIcon,
  Agriculture as HarvestIcon,
  BugReport as PesticideIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
  TrendingUp as ImpactIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
  PriorityHigh as PriorityIcon,
  AutoFixHigh as AutoFixIcon,
} from '@mui/icons-material';
import { Recommendation } from '../../types';
import { colors, getStatusColor } from '../../utils/theme';

// Winter farming recommendations - synced with probe disconnection timeline
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'warning',
    priority: 'critical',
    title: 'Probe Connectivity Issue',
    description: 'Probe 001 at Newgen IEDC offline for 48+ hours. Manual field inspection recommended to ensure crop health.',
    probeId: 'probe-001',
    actionRequired: true,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    estimatedImpact: 'Prevent data loss and maintain crop monitoring',
    icon: 'warning',
    color: colors.neutral[600],
  },
  {
    id: '2',
    type: 'irrigation',
    priority: 'medium',
    title: 'Winter Irrigation Schedule',
    description: 'Reduce irrigation frequency to twice weekly during December. Current soil moisture at 78% indicates adequate hydration.',
    actionRequired: true,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    estimatedImpact: 'Optimize water usage for winter crops',
    icon: 'irrigation',
    color: colors.neutral[600],
  },
  {
    id: '3',
    type: 'fertilizer',
    priority: 'low',
    title: 'Pre-Spring Soil Preparation',
    description: 'Apply phosphorus-rich fertilizer (20-30 ppm) in late December to prepare soil for spring planting season.',
    actionRequired: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    estimatedImpact: 'Enhanced root development for spring crops',
    icon: 'fertilizer',
    color: colors.neutral[600],
  },
  {
    id: '4',
    type: 'harvest',
    priority: 'medium',
    title: 'Winter Crop Monitoring',
    description: 'Winter wheat showing good growth at 12.8°C. Monitor for frost damage and consider protective covering below 5°C.',
    actionRequired: true,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    estimatedImpact: 'Protect crop yield during cold weather',
    icon: 'harvest',
    color: colors.neutral[600],
  },
];

const iconMap = {
  irrigation: IrrigationIcon,
  fertilizer: FertilizerIcon,
  warning: WarningIcon,
  harvest: HarvestIcon,
  pesticide: PesticideIcon,
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return colors.neutral[800];
    case 'high': return colors.neutral[700];
    case 'medium': return colors.neutral[600];
    case 'low': return colors.neutral[500];
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

interface RecommendationItemProps {
  recommendation: Recommendation;
  index: number;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({ recommendation, index }) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const theme = useTheme();
  
  const Icon = iconMap[recommendation.icon as keyof typeof iconMap];

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  return (
    <Box sx={{ mb: 1.5 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: '1px solid',
          borderColor: colors.neutral[200],
          backgroundColor: acknowledged ? colors.neutral[50] : 'white',
          '&:hover': {
            backgroundColor: colors.neutral[50],
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Compact Icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                backgroundColor: colors.neutral[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon sx={{ fontSize: 20, color: colors.neutral[600] }} />
            </Box>

            {/* Content */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 200 }}>
                    {recommendation.title}
                  </Typography>
                  <Chip
                    label={recommendation.priority}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                      lineHeight: 1.5,
                      backgroundColor: `${getPriorityColor(recommendation.priority)}20`,
                      color: getPriorityColor(recommendation.priority),
                    }}
                  />
                  {recommendation.actionRequired && !acknowledged && (
                    <Chip
                      label="Action"
                      size="small"
                      color="error"
                      sx={{ height: 20, fontSize: '0.75rem', lineHeight: 1.5, borderRadius: 2  }}
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {getTimeAgo(recommendation.timestamp)}
                </Typography>
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 1, fontSize: '0.875rem', lineHeight: 1.4 }}
              >
                {recommendation.description}
              </Typography>
              
              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {!acknowledged && recommendation.actionRequired && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleAcknowledge}
                      sx={{ textTransform: 'none', fontSize: '0.875rem', lineHeight: 1.5, borderRadius: 2  }}
                    >
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none', fontSize: '0.8rem', borderRadius: 2  }}
                  >
                    Details
                  </Button>
                </Box>
                
                {recommendation.probeId && (
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                    {recommendation.probeId}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Paper>
    </Box>
  );
};

const RecommendationsPanel: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'action-required'>('all');
  const theme = useTheme();

  const filteredRecommendations = mockRecommendations.filter(rec => {
    switch (filter) {
      case 'critical':
        return rec.priority === 'critical';
      case 'action-required':
        return rec.actionRequired;
      default:
        return true;
    }
  });

  const actionRequiredCount = mockRecommendations.filter(r => r.actionRequired).length;
  const criticalCount = mockRecommendations.filter(r => r.priority === 'critical').length;


  return (
    <Box sx={{ width: '100%' }}>
      {/* Compact Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        pb: 1,
        borderBottom: '1px solid',
        borderColor: colors.neutral[200],
      }}>
        <Typography variant="h6" sx={{ fontWeight: 200 }}>
          Recommendations ({filteredRecommendations.length})
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label="All"
            size="small"
            variant={filter === 'all' ? 'filled' : 'outlined'}
            onClick={() => setFilter('all')}
            clickable
            sx={{ backgroundColor: filter === 'all' ? colors.neutral[200] : 'transparent', borderRadius: 2  }}
          />
          <Chip
            label={`Actions (${actionRequiredCount})`}
            size="small"
            variant={filter === 'action-required' ? 'filled' : 'outlined'}
            onClick={() => setFilter(filter === 'action-required' ? 'all' : 'action-required')}
            clickable
            sx={{ backgroundColor: filter === 'action-required' ? colors.neutral[200] : 'transparent', borderRadius: 2  }}
          />
          <Chip
            label={`Critical (${criticalCount})`}
            size="small"
            variant={filter === 'critical' ? 'filled' : 'outlined'}
            onClick={() => setFilter(filter === 'critical' ? 'all' : 'critical')}
            clickable
            sx={{ backgroundColor: filter === 'critical' ? colors.neutral[200] : 'transparent', borderRadius: 2  }}
          />
        </Box>
      </Box>

      {/* Recommendations List */}
      <Box>
        {filteredRecommendations.length > 0 ? (
          <Box>
            {filteredRecommendations.map((recommendation, index) => (
              <RecommendationItem
                key={recommendation.id}
                recommendation={recommendation}
                index={index}
              />
            ))}
          </Box>
        ) : (
          <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 1,
                  backgroundColor: colors.neutral[25],
                  border: '1px solid',
                  borderColor: colors.neutral[200],
                }}
              >
                <CheckIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: colors.neutral[500],
                    mb: 2,
                    opacity: 0.7,
                  }} 
                />
                <Typography variant="h6" sx={{ fontWeight: 200, mb: 1 }}>
                  All Clear!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No recommendations match the current filter. 
                  {filter !== 'all' && ' Try selecting "All Recommendations" to see more.'}
                </Typography>
              </Paper>
            </Box>
          )}
      </Box>
    </Box>
  );
};

export default RecommendationsPanel;