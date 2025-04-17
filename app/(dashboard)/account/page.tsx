import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AccountPage() {

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
        Account Overview
      </Typography>
    </Box>
  );
}