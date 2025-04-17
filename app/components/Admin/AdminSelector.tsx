'use client';

import { FormControl, InputLabel, Select, MenuItem, Card, CardContent } from '@mui/material';

export const entities = [
  'Users',
  'Tasks',
  'Products',
  'Organizations',
  'Events',
  //'Categories',
  //'Addresses'
];

interface AdminSelectorProps {
  selectedEntity: string;
  onEntityChange: (entity: string) => void;
}

export default function AdminSelector({ selectedEntity, onEntityChange }: AdminSelectorProps) {
  return (
    <Card>
      <CardContent>
        <FormControl fullWidth>
          <InputLabel id="entity-select-label">Manage Entity</InputLabel>
          <Select
            labelId="entity-select-label"
            id="entity-select"
            value={selectedEntity}
            label="Manage Entity"
            onChange={(e) => onEntityChange(e.target.value)}
          >
            {entities.map((entity) => (
              <MenuItem key={entity} value={entity}>
                {entity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}