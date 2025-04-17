import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

export default function DashboardPage() {
  // Sample data for tasks
  const tasks = [
    { id: 1, title: 'Contact new client about wedding performance', due: '2024-02-20', status: 'pending' },
    { id: 2, title: 'Update performance contract template', due: '2024-02-18', status: 'completed' },
    { id: 3, title: 'Schedule rehearsal for corporate event', due: '2024-02-25', status: 'pending' },
    { id: 4, title: 'Review equipment inventory', due: '2024-02-19', status: 'in-progress' },
  ];

  // Sample data for upcoming events
  const events = [
    { id: 1, name: 'Smith Wedding Reception', date: '2024-03-15', location: 'Grand Plaza Hotel' },
    { id: 2, name: 'Corporate Annual Gala', date: '2024-03-20', location: 'Convention Center' },
    { id: 3, name: 'Birthday Celebration', date: '2024-03-25', location: 'Riverside Manor' },
  ];

  // Sample data for financial summary
  const financialData = [
    { month: 'January', revenue: 28500, expenses: 12300, profit: 16200 },
    { month: 'February', revenue: 32000, expenses: 14500, profit: 17500 },
    { month: 'March', revenue: 35500, expenses: 15200, profit: 20300 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
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
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Tasks Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasks
              </Typography>
              <List>
                {tasks.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemText
                      primary={task.title}
                      secondary={`Due: ${task.due}`}
                    />
                    <Chip
                      label={task.status}
                      color={getStatusColor(task.status) as any}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              <List>
                {events.map((event) => (
                  <ListItem key={event.id} divider>
                    <ListItemText
                      primary={event.name}
                      secondary={`${event.date} - ${event.location}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Report Section */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Summary
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Expenses</TableCell>
                      <TableCell align="right">Profit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {financialData.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell component="th" scope="row">
                          {row.month}
                        </TableCell>
                        <TableCell align="right">${row.revenue.toLocaleString()}</TableCell>
                        <TableCell align="right">${row.expenses.toLocaleString()}</TableCell>
                        <TableCell align="right">${row.profit.toLocaleString()}</TableCell>
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