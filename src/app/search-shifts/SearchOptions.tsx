import { Stack, Button, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function SearchOptions() {
  const options = [
    'Buscar por nombre o ubicación',
    'Buscar por zip code',
    'Buscar por turno disponible',
  ];

  return (
    <Stack spacing={1.5} alignItems="center" sx={{ my: 3 }}>
      {options.map((label, index) => (
        <Button
          key={index}
          variant="contained"
          startIcon={
            <SearchRoundedIcon
              sx={{ color: '#e91e63', fontSize: 24, fontWeight: 'bold' }}
            />
          }
          sx={{
            justifyContent: 'flex-start',
            backgroundColor: '#f5f5f5',
            borderRadius: '24px',
            color: '#212121',
            boxShadow: 'none',
            textTransform: 'none',
            padding: '8px 16px',
            width: '100%',
            maxWidth: 300,
            '&:hover': {
              backgroundColor: '#e0e0e0',
              boxShadow: 'none',
            },
          }}
        >
          <Typography variant="body1">{label}</Typography>
        </Button>
      ))}
    </Stack>
  );
}
