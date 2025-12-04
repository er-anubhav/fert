import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Button,
  Collapse,
  Divider,
  useTheme,
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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Recommendation } from '../../types';
import { colors, getStatusColor } from '../../utils/theme';

// Mock recommendations data
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'irrigation',
    priority: 'high',
    title: 'Irrigation Recommended',
    description: 'Soil moisture in North Field has dropped to 45%. Consider activating irrigation system for 30 minutes.',
    probeId: 'probe-001',
    actionRequired: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    estimatedImpact: 'Prevent crop stress, maintain optimal growth',
    icon: 'irrigation',
    color: colors.sensor.moisture,
  },
  {
    id: '2',
    type: 'fertilizer',
    priority: 'medium',
    title: 'Nitrogen Deficiency Detected',
    description: 'Nitrogen levels in South Field are below optimal range (32 ppm vs 45-60 ppm recommended).',
    probeId: 'probe-003',
    actionRequired: true,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    estimatedImpact: 'Improve leaf development and overall plant health',
    icon: 'fertilizer',
    color: colors.sensor.nitrogen,
  },
  {
    id: '3',
    type: 'warning',
    priority: 'critical',
    title: 'pH Level Alert',
    description: 'pH in greenhouse has risen to 8.2. This may affect nutrient uptake. Immediate attention required.',
    probeId: 'probe-002',
    actionRequired: true,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    estimatedImpact: 'Restore optimal nutrient absorption',
    icon: 'warning',
    color: colors.status.error,
  },
  {
    id: '4',
    type: 'harvest',
    priority: 'low',
    title: 'Harvest Window Opening',
    description: 'Weather conditions and crop maturity indicators suggest optimal harvest conditions in 5-7 days.',
    actionRequired: false,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    estimatedImpact: 'Maximize crop quality and yield',
    icon: 'harvest',
    color: colors.secondary[500],
  },
  {
    id: '5',
    type: 'irrigation',
    priority: 'medium',
    title: 'Water Usage Optimization',
    description: 'Current irrigation schedule could be optimized to save 15% water while maintaining crop health.',
    actionRequired: false,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    estimatedImpact: 'Reduce water consumption, lower costs',
    icon: 'irrigation',
    color: colors.primary[500],
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
    case 'critical': return colors.status.error;
    case 'high': return colors.status.warning;
    case 'medium': return colors.status.info;
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
  const [expanded, setExpanded] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const theme = useTheme();
  
  const Icon = iconMap[recommendation.icon as keyof typeof iconMap];

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <ListItem
        sx={{
          borderRadius: 2,
          mb: 1,
          border: '1px solid',
          borderColor: acknowledged ? colors.neutral[200] : `${getPriorityColor(recommendation.priority)}40`,
          backgroundColor: acknowledged ? colors.neutral[50] : 'white',
          opacity: acknowledged ? 0.7 : 1,
          '&:hover': {
            backgroundColor: colors.neutral[50],
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              backgroundColor: `${recommendation.color}20`,
              color: recommendation.color,
              border: '2px solid',
              borderColor: `${recommendation.color}40`,
            }}
          >
            <Icon />
          </Avatar>
        </ListItemAvatar>

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {recommendation.title}
            </Typography>
            <Chip
              label={recommendation.priority.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: `${getPriorityColor(recommendation.priority)}20`,
                color: getPriorityColor(recommendation.priority),
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
            {recommendation.actionRequired && !acknowledged && (
              <Chip
                label="ACTION REQUIRED"
                size="small"
                color="error"
                variant="outlined"
              />
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {recommendation.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" color="text.secondary">
                {getTimeAgo(recommendation.timestamp)}
              </Typography>
            </Box>
            {recommendation.probeId && (
              <Typography variant="caption" color="primary">
                {recommendation.probeId}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!acknowledged && recommendation.actionRequired && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={handleAcknowledge}
            >
              Acknowledge
            </Button>
          )}
          <IconButton
            onClick={handleToggleExpand}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: theme.transitions.create('transform'),
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 2 }}>
          <Card variant="outlined" sx={{ backgroundColor: colors.neutral[25] }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ImpactIcon sx={{ fontSize: 18, color: colors.primary[500] }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Expected Impact
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {recommendation.estimatedImpact}
              </Typography>
              
              {recommendation.actionRequired && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="outlined" size="small">
                    View Details
                  </Button>
                  <Button variant="outlined" size="small">
                    Schedule Action
                  </Button>
                  <Button variant="outlined" size="small">
                    Dismiss
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Collapse>
    </motion.div>
  );
};

const RecommendationsPanel: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'action-required'>('all');

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
    <Card sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Smart Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-powered insights and action items for your farm
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`${actionRequiredCount} Actions`}
              color="primary"
              size="small"
              variant={filter === 'action-required' ? 'filled' : 'outlined'}
              onClick={() => setFilter(filter === 'action-required' ? 'all' : 'action-required')}
              clickable
            />
            <Chip
              label={`${criticalCount} Critical`}
              color="error"
              size="small"
              variant={filter === 'critical' ? 'filled' : 'outlined'}
              onClick={() => setFilter(filter === 'critical' ? 'all' : 'critical')}
              clickable
            />
          </Box>
        </Box>

        <List sx={{ p: 0 }}>
          <AnimatePresence>
            {filteredRecommendations.map((recommendation, index) => (
              <RecommendationItem
                key={recommendation.id}
                recommendation={recommendation}
                index={index}
              />
            ))}
          </AnimatePresence>
        </List>

        {filteredRecommendations.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              No recommendations match the current filter
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationsPanel;