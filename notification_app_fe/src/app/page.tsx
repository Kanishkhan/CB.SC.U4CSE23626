'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, 
  Switch, FormControlLabel, IconButton, 
  CircularProgress, Stack, Chip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { fetchNotifications, Notification, sortNotifications } from '@/lib/api';
import { Log } from '@/lib/logger';
import { format } from 'date-fns';

export default function NotificationDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  const loadData = async () => {
    // Only set loading if not already true
    setLoading(prev => !prev ? true : prev);
    try {
      await Log('frontend', 'info', 'api', 'Fetching notifications dashboard data');
      const data = await fetchNotifications();
      setNotifications(data);
    } catch {
      await Log('frontend', 'error', 'api', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('read_notifications');
    if (saved) {
      setReadIds(new Set(JSON.parse(saved)));
    }
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    loadData();
  }, []);

  // ... (moved after useMemo) ...

  const handleMarkAsRead = (id: string) => {
    const nextRead = new Set(readIds);
    nextRead.add(id);
    setReadIds(nextRead);
    localStorage.setItem('read_notifications', JSON.stringify(Array.from(nextRead)));
    Log('frontend', 'debug', 'state', `Marked notification ${id} as read`);
  };

  const filteredData = useMemo(() => {
    let result = activeTab === 'All' 
      ? notifications 
      : notifications.filter(n => n.Type === activeTab);

    if (priorityOnly) {
      result = sortNotifications(result).slice(0, 10);
    }
    return result;
  }, [notifications, activeTab, priorityOnly]);

  if (!mounted) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Placement': return 'error';
      case 'Result': return 'primary';
      case 'Event': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NotificationsIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">Campus Notifications</Typography>
        </Box>
        <IconButton onClick={loadData} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, val) => setActiveTab(val)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All" value="All" />
          <Tab label="Placements" value="Placement" />
          <Tab label="Results" value="Result" />
          <Tab label="Events" value="Event" />
        </Tabs>
      </Paper>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch 
              checked={priorityOnly} 
              onChange={(e) => {
                setPriorityOnly(e.target.checked);
                Log('frontend', 'info', 'component', `Priority toggle: ${e.target.checked}`);
              }} 
            />
          }
          label="Show Top 10 Priority Only"
        />
        <Typography variant="body2" color="text.secondary">
          {filteredData.length} items found
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredData.map((notif) => (
          <Paper 
            key={notif.ID} 
            elevation={readIds.has(notif.ID) ? 1 : 4}
            onClick={() => handleMarkAsRead(notif.ID)}
            sx={{ 
              p: 2, 
              cursor: 'pointer',
              transition: '0.2s',
              borderLeft: `6px solid`,
              borderLeftColor: readIds.has(notif.ID) ? 'transparent' : 'primary.main',
              opacity: readIds.has(notif.ID) ? 0.7 : 1,
              '&:hover': { transform: 'translateX(4px)', bgcolor: 'background.paper' }
            }}
          >
            <Stack 
              sx={{ 
                width: '100%',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { sm: 'center' },
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip 
                    label={notif.Type} 
                    size="small" 
                    color={getTypeColor(notif.Type) as 'error' | 'primary' | 'success' | 'default'} 
                    variant={readIds.has(notif.ID) ? 'outlined' : 'filled'}
                  />
                  {!readIds.has(notif.ID) && (
                    <Chip label="NEW" size="small" color="secondary" sx={{ height: 20, fontSize: 10 }} />
                  )}
                </Box>
                <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{notif.Message}</Typography>
              </Box>
              <Box sx={{ textAlign: { sm: 'right' }, minWidth: 120 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {format(new Date(notif.Timestamp), 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(notif.Timestamp), 'HH:mm:ss')}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
        {!loading && filteredData.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ py: 8 }}>
            No notifications in this category.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
