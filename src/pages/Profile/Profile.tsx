import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Sensors as SensorsIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  stagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

const Profile: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.stagger}
    >
      <Box sx={{ maxWidth: 600, mx: 'auto', px: { xs: 2, sm: 0 }, pb: { xs: 10, sm: 4 } }}>
        {/* Profile Header */}
        <motion.div variants={animationVariants.fadeIn}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    bgcolor: 'primary.main',
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                  }}
                >
                  <PersonIcon sx={{ fontSize: '3rem' }} />
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    border: 2,
                    borderColor: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                John Farmer
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1, 
                mb: 2 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SensorsIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
                    Farm Administrator • FertoBot Pro
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    12
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active Probes
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    5.2
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hectares
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    847
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Days Active
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={animationVariants.fadeIn}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Contact Information
              </Typography>
              
              <List dense sx={{ '& .MuiListItem-root': { py: { xs: 1, sm: 1.5 } } }}>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="john.farmer@fertobot.com"
                    secondary="Primary Email"
                  />
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="+1 (555) 123-4567"
                    secondary="Mobile Phone"
                  />
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings & Preferences */}
        <motion.div variants={animationVariants.fadeIn}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Settings & Preferences
              </Typography>
              
              <List sx={{ '& .MuiListItem-root': { py: { xs: 1, sm: 1.5 } } }}>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Get alerts for probe status changes"
                  />
                  <Switch defaultChecked />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Badge badgeContent={4} color="error">
                      <BadgeIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary="Alert Badges"
                    secondary="Show notification counts on icons"
                  />
                  <Switch defaultChecked />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Language"
                    secondary="English (US)"
                  />
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div variants={animationVariants.fadeIn}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Account
              </Typography>
              
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security & Privacy"
                    secondary="Password, 2FA, data privacy"
                  />
                </ListItem>
                
                <ListItem button>
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Help & Support"
                    secondary="Documentation, FAQs, contact support"
                  />
                </ListItem>

                <Divider sx={{ my: 1 }} />
                
                <ListItem button sx={{ color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sign Out"
                    secondary="Log out of your FertoBot account"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Information */}
        <motion.div variants={animationVariants.fadeIn}>
          <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: { xs: 20, sm: 24 },
                  height: 24,
                  borderRadius: 1,
                  background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SensorsIcon sx={{ color: 'white', fontSize: 16 }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                FertoBot
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Version 1.0.0 • Smart Agriculture System
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default Profile;