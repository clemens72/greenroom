'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from 'dayjs';

export default function EventsPage() {
  // Sample data for events
  const events = [
    {
      id: 1,
      name: 'Smith Wedding Reception',
      date: '2024-03-15',
      time: '6:00 PM',
      location: 'Grand Plaza Hotel',
      type: 'Wedding',
      attendees: 150,
      status: 'confirmed',
    },
    {
      id: 2,
      name: 'Corporate Annual Gala',
      date: '2024-03-20',
      time: '7:30 PM',
      location: 'Convention Center',
      type: 'Corporate',
      attendees: 300,
      status: 'pending',
    },
    {
      id: 3,
      name: 'Birthday Celebration',
      date: '2024-03-25',
      time: '8:00 PM',
      location: 'Riverside Manor',
      type: 'Private',
      attendees: 80,
      status: 'confirmed',
    },
    {
      id: 4,
      name: 'Charity Fundraiser',
      date: '2024-04-05',
      time: '6:30 PM',
      location: 'City Hall',
      type: 'Charity',
      attendees: 200,
      status: 'confirmed',
    },
  ];

  // Sample data for event statistics
  const statistics = [
    {
      title: 'Upcoming Events',
      value: '12',
      icon: <EventIcon />,
    },
    {
      title: 'Total Attendees',
      value: '730',
      icon: <GroupIcon />,
    },
    {
      title: 'Venues',
      value: '8',
      icon: <LocationOnIcon />,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - 65px)` },
        ml: { sm: `65px` },
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Events Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        {statistics.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    margin: '0 auto',
                    width: 56,
                    height: 56,
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" component="div">
                  {stat.value}
                </Typography>
                <Typography color="text.secondary">{stat.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Calendar and Events List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calendar
              </Typography>
              <DateCalendar 
                defaultValue={dayjs()}
                views={['day']}
                sx={{
                  width: '100%',
                  '.MuiPickersDay-root.Mui-selected': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Event</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.slice(0, 5).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={event.status}
                            color={getStatusColor(event.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* All Events Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                All Events
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Attendees</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.type}</TableCell>
                        <TableCell>{event.attendees}</TableCell>
                        <TableCell>
                          <Chip
                            label={event.status}
                            color={getStatusColor(event.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}