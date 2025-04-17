'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useState } from 'react';

import CreateUserForm from '@/app/components/Admin/Forms/CreateUserForm';
import UserTable from '@/app/components/Admin/Tables/UserTable';
import CreateTaskForm from '@/app/components/Admin/Forms/CreateTaskForm';
import TaskTable from '@/app/components/Admin/Tables/TaskTable';
import CreateProductForm from '@/app/components/Admin/Forms/CreateProductForm';
import ProductTable from '@/app/components/Admin/Tables/ProductTable';
import CreateOrganizationForm from '@/app/components/Admin/Forms/CreateOrganizationForm';
import OrganizationTable from '@/app/components/Admin/Tables/OrganizationTable';
import CreateEventForm from '@/app/components/Admin/Forms/CreateEventForm';
import EventTable from '@/app/components/Admin/Tables/EventTable';
import AdminSelector from '@/app/components/Admin/AdminSelector';

export default function AdminPage() {
  const [selectedEntity, setSelectedEntity] = useState('Users');

  const renderEntityComponents = () => {
    switch (selectedEntity) {
      case 'Users':
        return (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Create New User
                  </Typography>
                  <CreateUserForm />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <UserTable />
                </CardContent>
              </Card>
            </Grid>
          </>
        );
      case 'Tasks':
        return (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Create New Task
                  </Typography>
                  <CreateTaskForm />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <TaskTable />
                </CardContent>
              </Card>
            </Grid>
          </>
        );
      case 'Products':
        return (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Create New Product
                  </Typography>
                  <CreateProductForm />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <ProductTable />
                </CardContent>
              </Card>
            </Grid>
          </>
        );
      case 'Organizations':
        return (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Create New Organization
                  </Typography>
                  <CreateOrganizationForm />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <OrganizationTable />
                </CardContent>
              </Card>
            </Grid>
          </>
        );
      case 'Events':
        return (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Create New Event
                  </Typography>
                  <CreateEventForm />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <EventTable />
                </CardContent>
              </Card>
            </Grid>
          </>
        );
      default:
        return (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Create New {selectedEntity.slice(0, -1)}
                  </Typography>
                  <Typography color="textSecondary">
                    Form coming soon...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedEntity} List
                  </Typography>
                  <Typography color="textSecondary">
                    Table coming soon...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        );
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AdminSelector 
            selectedEntity={selectedEntity}
            onEntityChange={setSelectedEntity}
          />
        </Grid>

        {renderEntityComponents()}
      </Grid>
    </Box>
  );
}