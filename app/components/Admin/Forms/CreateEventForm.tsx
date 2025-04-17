'use client';

import React, { useState } from 'react';
import { 
  TextField,
  Button,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

interface FormData {
  name: string;
  price: number;
  leader: string;
  location: string;
  start_time: string | null;
  end_time: string | null;
  note: string;
  description: string;
  booking_contact: string;
}

const defaultFormData: FormData = {
  name: '',
  price: 0,
  leader: '',
  location: '',
  start_time: null,
  end_time: null,
  note: '',
  description: '',
  booking_contact: ''
};

interface CreateEventFormProps {
  onEventCreated?: () => void;
}

export default function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
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
      [name]: name === 'price' ? parseInt(value) || 0 : value,
    }));
  };

  const handleDateChange = (name: string) => (value: dayjs.Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: value ? value.toISOString() : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/events/add', {
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
          message: 'Event created successfully!',
          severity: 'success',
        });
        setFormData(defaultFormData);
        if (onEventCreated) {
          onEventCreated();
        }
      } else {
        throw new Error(data.error || 'Failed to create event');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to create event',
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
            label="Event Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Leader"
            name="leader"
            value={formData.leader}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={2}
          />

          <DateTimePicker
            label="Start Time"
            value={formData.start_time ? dayjs(formData.start_time) : null}
            onChange={handleDateChange('start_time')}
            sx={{ width: '100%' }}
          />

          <DateTimePicker
            label="End Time"
            value={formData.end_time ? dayjs(formData.end_time) : null}
            onChange={handleDateChange('end_time')}
            sx={{ width: '100%' }}
          />

          <TextField
            label="Note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={4}
          />

          <TextField
            label="Booking Contact"
            name="booking_contact"
            value={formData.booking_contact}
            onChange={handleChange}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? 'Creating...' : 'Create Event'}
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