'use client';

import React, { useState } from 'react';
import { 
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  MenuItem
} from '@mui/material';

interface FormData {
  name: string;
  address: string;
  year: number;
  type: string;
}

const defaultFormData: FormData = {
  name: '',
  address: '',
  year: new Date().getFullYear(),
  type: 'Client'
};

const organizationTypes = [
  'Client',
  'Venue',
  'Vendor',
  'Partner'
];

interface CreateOrganizationFormProps {
  onOrganizationCreated?: () => void;
}

export default function CreateOrganizationForm({ onOrganizationCreated }: CreateOrganizationFormProps) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/organizations/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Organization created successfully!',
          severity: 'success',
        });
        setFormData(defaultFormData);
        if (onOrganizationCreated) {
          onOrganizationCreated();
        }
      } else {
        throw new Error(data.error || 'Failed to create organization');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to create organization',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ maxWidth: '100%', mb: 4 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            label="Year Established"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 1800, max: new Date().getFullYear() }}
          />

          <TextField
            select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            fullWidth
          >
            {organizationTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? 'Creating...' : 'Create Organization'}
          </Button>
        </Box>
      </form>

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