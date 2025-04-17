'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import dayjs, { Dayjs } from 'dayjs';

interface Event {
  id: string;
  name: string;
  price: number;
  leader: string;
  location: string;
  start_time: string;
  end_time: string;
  note: string;
  description: string;
  booking_contact: string;
}

export default function EventTable({ onRefresh }: { onRefresh?: () => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRefresh = () => {
    fetchEvents();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setSnackbar({
        open: true,
        message: 'Event deleted successfully',
        severity: 'success',
      });
      
      fetchEvents();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to delete event',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).format('MMM D, YYYY h:mm A');
  };

  const getEventsForDate = (date: Dayjs) => {
    return events.filter(event => 
      dayjs(event.start_time).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  const ServerDay = (props: PickersDayProps<Dayjs>) => {
    const { day, ...other } = props;
    const eventsOnDay = getEventsForDate(day);
    const hasEvents = eventsOnDay.length > 0;

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={hasEvents ? eventsOnDay.length : undefined}
        color="primary"
      >
        <PickersDay {...other} day={day} />
      </Badge>
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <Box sx={{ maxWidth: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Event List
        </Typography>
        <IconButton onClick={handleRefresh} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Calendar View */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Calendar
              </Typography>
              <DateCalendar 
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                slots={{
                  day: ServerDay
                }}
                sx={{
                  width: '100%',
                  '.MuiPickersDay-root.Mui-selected': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            </CardContent>
          </Card>

          {selectedDate && selectedDateEvents.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Events on {selectedDate.format('MMMM D, YYYY')}
                </Typography>
                <List>
                  {selectedDateEvents.map((event) => (
                    <ListItem key={event.id} divider>
                      <ListItemText
                        primary={event.name}
                        secondary={`${dayjs(event.start_time).format('h:mm A')} - ${dayjs(event.end_time).format('h:mm A')}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Events Table */}
        <Grid item xs={12} md={8}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 2 }}>
              {error}
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="event table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Leader</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Booking Contact</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Tooltip title={event.description}>
                          <span>{event.name}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>${event.price.toLocaleString()}</TableCell>
                      <TableCell>{event.leader}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{formatDateTime(event.start_time)}</TableCell>
                      <TableCell>{formatDateTime(event.end_time)}</TableCell>
                      <TableCell>{event.booking_contact}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="delete event"
                          onClick={() => handleDelete(event.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {events.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No events found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}