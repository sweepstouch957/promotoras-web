import { Box, Typography, Card, CardContent } from '@mui/material';

export default function MapSection() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        backgroundColor: '#e0e0e0',
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Ubicación de los Turnos
      </Typography>
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 320,
          margin: '0 auto',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <iframe
            title="Ubicación de los Turnos"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3020.7881702105535!2d-75.04964078459499!3d41.7683738792327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dbba6cd5fc27f5%3A0x6a5b6ffb6e1c3d4e!2sCallicoon%2C%20NY%2012748%2C%20EE.%20UU.!5e0!3m2!1ses!2sar!4v1625837742666!5m2!1ses!2sar"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </CardContent>
      </Card>
    </Box>
  );
}
