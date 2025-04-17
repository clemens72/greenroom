import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BusinessIcon from '@mui/icons-material/Business';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';

export default function OrganizationsPage() {
  // Sample data for organizations
  const organizations = [
    {
      id: 1,
      name: 'Grand Plaza Hotel',
      type: 'Venue',
      location: 'Downtown, City',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.j@grandplaza.com',
      status: 'active',
      lastEvent: '2024-02-15',
    },
    {
      id: 2,
      name: 'Corporate Events Inc.',
      type: 'Corporate Client',
      location: 'Business District',
      contactPerson: 'Michael Chen',
      email: 'm.chen@corpevents.com',
      status: 'active',
      lastEvent: '2024-01-30',
    },
    {
      id: 3,
      name: 'Riverside Manor',
      type: 'Venue',
      location: 'Riverside Area',
      contactPerson: 'Emma Wilson',
      email: 'events@riversidemanor.com',
      status: 'inactive',
      lastEvent: '2023-12-20',
    },
  ];

  // Sample data for recent activities
  const recentActivities = [
    {
      id: 1,
      organization: 'Grand Plaza Hotel',
      activity: 'Contract renewed for 2024',
      date: '2024-02-10',
    },
    {
      id: 2,
      organization: 'Corporate Events Inc.',
      activity: 'New event booking confirmed',
      date: '2024-02-08',
    },
    {
      id: 3,
      organization: 'Riverside Manor',
      activity: 'Updated contact information',
      date: '2024-02-05',
    },
  ];

  // Sample data for organization statistics
  const statistics = [
    { label: 'Total Organizations', value: '15', icon: <BusinessIcon /> },
    { label: 'Active Partnerships', value: '12', icon: <TimelineIcon /> },
    { label: 'Total Contacts', value: '45', icon: <GroupIcon /> },
  ];

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'default';
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
        Organizations Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        {statistics.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
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
                <Typography color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Organizations Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Organizations List
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Contact Person</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Event</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>{org.name}</TableCell>
                        <TableCell>{org.type}</TableCell>
                        <TableCell>{org.contactPerson}</TableCell>
                        <TableCell>{org.email}</TableCell>
                        <TableCell>{org.location}</TableCell>
                        <TableCell>
                          <Chip
                            label={org.status}
                            color={getStatusColor(org.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{org.lastEvent}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <BusinessIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.organization}
                      secondary={`${activity.activity} - ${activity.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}