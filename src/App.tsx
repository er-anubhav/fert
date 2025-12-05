import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout/Layout';
import PWAInstallButton from './components/PWA/PWAInstallButton';
import Dashboard from './pages/Dashboard/Dashboard';
import ProbeManagement from './pages/ProbeManagement/ProbeManagement';
import ProbeDetail from './pages/ProbeDetail/ProbeDetail';
import SprinklerControl from './pages/SprinklerControl/SprinklerControl';
import SecurityCamera from './pages/SecurityCamera/SecurityCamera';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      touchAction: 'pan-x pan-y',
      userSelect: 'none',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      '& *': {
        WebkitTapHighlightColor: 'transparent',
      }
    }}>
      <PWAInstallButton variant="banner" />
      <Layout>
        <Routes>
          {/* Main Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Probe Management */}
          <Route path="/probes" element={<ProbeManagement />} />
          <Route path="/probes/:probeId" element={<ProbeDetail />} />
          
          {/* Irrigation & Sprinkler Control */}
          <Route path="/irrigation" element={<SprinklerControl />} />
          
          {/* Security & Camera */}
          <Route path="/security" element={<SecurityCamera />} />
          
          
          {/* User Profile */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;