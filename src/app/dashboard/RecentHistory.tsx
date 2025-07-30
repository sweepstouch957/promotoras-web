import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';

export default function RecentHistory({ loading, recentShifts }) {
  if (loading) return <Typography>Cargando...</Typography>;

  if (!recentShifts.length) {
    return (
      <Box textAlign="center" py={5}>
        <Typography fontSize={48}>🏪</Typography>
        <Typography>No hay turnos recientes</Typography>
        <Typography fontSize={14} color="text.secondary">
          ¡Busca turnos disponibles para comenzar!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      

      {recentShifts.map((shift) => (
        <Card
          key={shift.id}
          sx={{
            borderRadius: 1, // Más cuadrado
            backgroundColor: '#f5f5f5',
            mb: 2,
            boxShadow: 'none',
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="flex-start" spacing={1} mb={1}>
              <EventIcon sx={{ color: '#e91e63' }} />
              <Typography color="text.secondary" fontWeight="bold">
                {new Date(shift.date).toLocaleDateString('es-ES')}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <AccessTimeIcon sx={{ color: '#e91e63', fontSize: 18 }} />
              <Typography fontSize={14}>
                {shift.startTime} - {shift.endTime}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
              <PlaceIcon sx={{ color: '#e91e63', fontSize: 18 }} />
              <Typography fontSize={14} color="text.secondary">
                {shift.supermarketName}
              </Typography>
            </Stack>

            <Typography fontSize={14} ml={3}>
              {shift.address.split(',')[0]}, {shift.address.split(',')[1]}
            </Typography>

            <Typography fontWeight="bold" mt={2}>
              Números captados:{' '}
              <Box component="span" fontWeight="bold">
                650
              </Box>
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
