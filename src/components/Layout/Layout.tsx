import React, { useState } from 'react';
import {
  Box,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Sensors as SensorsIcon,
  Water as WaterIcon,
  Security as SecurityIcon,
  Bluetooth as BluetoothIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
  },
  {
    id: 'probes',
    label: 'Probes',
    icon: SensorsIcon,
    path: '/probes',
    badge: 3,
  },
  {
    id: 'irrigation',
    label: 'Irrigation',
    icon: WaterIcon,
    path: '/irrigation',
  },
  {
    id: 'security',
    label: 'Security',
    icon: SecurityIcon,
    path: '/security',
  },
  {
    id: 'bluetooth',
    label: 'Bluetooth',
    icon: BluetoothIcon,
    path: '/bluetooth',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: ProfileIcon,
    path: '/profile',
  },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [bottomNavValue, setBottomNavValue] = useState(0);
  
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Find current navigation index based on location
  React.useEffect(() => {
    const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1) {
      setBottomNavValue(currentIndex);
    }
  }, [location.pathname]);

  const handleBottomNavChange = (_event: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
    navigate(navigationItems[newValue].path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          pb: 8, // Account for bottom navigation
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
        elevation={8}
      >
        <BottomNavigation
          value={bottomNavValue}
          onChange={handleBottomNavChange}
          sx={{
            height: 64,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0 8px',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              fontWeight: 500,
              '&.Mui-selected': {
                fontSize: '0.75rem',
              },
            },
          }}
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <BottomNavigationAction
                key={item.id}
                label={item.label}
                icon={
                  item.badge ? (
                    <Badge badgeContent={item.badge} color="error" variant="dot">
                      <Icon />
                    </Badge>
                  ) : (
                    <Icon />
                  )
                }
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.5rem',
                  },
                }}
              />
            );
          })}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;