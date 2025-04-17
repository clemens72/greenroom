'use client';

import React, { useState } from 'react';
import { 
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';

interface FormData {
  name: string;
  gross_price: number;
  note: string;
  description: string;
  booking_contact: string;
  leader: string;
}

const defaultFormData: FormData = {
  name: '',
  gross_price: 0,
  note: '',
  description: '',
  booking_contact: '',
  leader: ''
};

interface CreateProductFormProps {
  onProductCreated?: () => void;
}

export default function CreateProductForm({ onProductCreated }: CreateProductFormProps) {
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
      [name]: name === 'gross_price' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/products/add', {
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
          message: 'Product created successfully!',
          severity: 'success',
        });
        setFormData(defaultFormData);
        if (onProductCreated) {
          onProductCreated();
        }
      } else {
        throw new Error(data.error || 'Failed to create product');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to create product',
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
            label="Gross Price"
            name="gross_price"
            type="number"
            value={formData.gross_price}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            fullWidth
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

          <TextField
            label="Leader"
            name="leader"
            value={formData.leader}
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
            {submitting ? 'Creating...' : 'Create Product'}
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