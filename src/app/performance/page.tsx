'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/Layout/AppLayout';

const PerformancePage = () => {
  // Datos para el gráfico
  const chartData = [
    { day: 'Lun', value: 35 },
    { day: 'Mar', value: 60 },
    { day: 'Mié', value: 85 },
    { day: 'Jue', value: 40 },
    { day: 'Vie', value: 95 },
    { day: 'Sáb', value: 70 },
    { day: 'Dom', value: 55 },
  ];

  // Datos para el progreso del objetivo con estrellas
  const progressData = [
    {value: 0},
    { value: 300 },
    { value: 600 },
    { value: 800 },
    { value: 1000 },
  ];

const CheckSVG = (props) => (
  <svg
    width={58}
    height={58}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="24" cy="24" r="24" fill="white" />
    <path
      d="M16 24.5L22 30.5L32 18.5"
      stroke="#EC008C"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoneySVG = (props) => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="24" cy="24" r="24" fill="white" />
    <g transform="translate(14, 14)">
      <ellipse cx="10" cy="10" rx="6" ry="8" stroke="#EC008C" strokeWidth="2.5" />
      <text
        x="10"
        y="13"
        textAnchor="middle"
        fill="#EC008C"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial"
      >
        $
      </text>
    </g>
  </svg>
);

const ClockSVG = (props) => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="24" cy="24" r="24" fill="white" />
    <g transform="translate(14, 14)">
      <circle cx="10" cy="10" r="8" stroke="#EC008C" strokeWidth="2.5" />
      <line x1="5" y1="3" x2="15" y2="3" stroke="#EC008C" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="1" x2="10" y2="3" stroke="#EC008C" strokeWidth="2.5" strokeLinecap="round" />
      <text
        x="10"
        y="14"
        textAnchor="middle"
        fill="#EC008C"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial"
      >
        %
      </text>
    </g>
  </svg>
);



  // SVG personalizado para ubicación
  const LocationSVG = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#e91e63" />
      <circle cx="12" cy="10" r="3" fill="white" />
    </svg>
  );

  // SVG personalizado para tiempo
  const TimeSVG = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#e91e63" />
      <polyline
        points="12,6 12,12 16,14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // SVG personalizado para check pequeño
  const SmallCheckSVG = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="#4caf50"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const CalendarSVG = (props) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm12 6H5v12h14V8z"
      fill="#EC008C"
    />
  </svg>
);

const HourglassSVG = (props) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 2v2c0 1.1.9 2 2 2h.01c0 1.64.78 3.1 2 4.06v1.88A5.999 5.999 0 018.01 18H8a2 2 0 00-2 2v2h12v-2a2 2 0 00-2-2h-.01a5.999 5.999 0 01-2-4.06v-1.88A5.999 5.999 0 0016.01 6H16a2 2 0 002-2V2H6z"
      fill="#EC008C"
    />
  </svg>
);

  return (
    <AppLayout currentPage="performance">
      <Box
        sx={{
          backgroundColor: '',
          minHeight: '100vh',
          padding: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            backgroundColor: '#e5e5e5',
            maxWidth: 360,
            width: '100%',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ padding: 3 }}>
            {/* Header */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                color: '#333',
                fontSize: '18px',
              }}
            >
              Estadísticas Generales
            </Typography>

            {/* Estadísticas principales - Cards grisáceas con números a la derecha */}
            <Box sx={{ mb: 4 }}>
              {/* Total de Turnos */}
             <Card
  sx={{
    mb: 2,
    backgroundColor: '#F2F2F2',
    borderRadius: '16px',
    boxShadow: 'none',
  }}
>
  <CardContent
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 2,
      py: 2.5,
      px: 2,
      '&:last-child': { pb: 2.5 },
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CheckSVG />
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#000',
        }}
      >
        Total de Turnos
      </Typography>
      <Typography
        sx={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#000',
          lineHeight: 1.2,
        }}
      >
        3
      </Typography>
    </Box>
  </CardContent>
</Card>



              {/* Comisiones Generadas */}
              <Card
  sx={{
    mb: 2,
    backgroundColor: '#F2F2F2',
    borderRadius: '16px',
    boxShadow: 'none',
  }}
>
  <CardContent
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 2,
      py: 2.5,
      px: 2,
      '&:last-child': { pb: 2.5 },
    }}
  >
    {/* Círculo blanco con ícono de moneda */}
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MoneySVG />
    </Box>

    {/* Texto + valor */}
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#000',
        }}
      >
        Ganancias Totales
      </Typography>
      <Typography
        sx={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#000',
          lineHeight: 1.2,
        }}
      >
        $375
      </Typography>
    </Box>
  </CardContent>
</Card>


              {/* Promedio por turno */}
             <Card
  sx={{
    mb: 2,
    backgroundColor: '#F2F2F2',
    borderRadius: '16px',
    boxShadow: 'none',
  }}
>
  <CardContent
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 2,
      py: 2.5,
      px: 2,
      '&:last-child': { pb: 2.5 },
    }}
  >
    {/* Ícono de cronómetro */}
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ClockSVG />
    </Box>

    {/* Texto + valor */}
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#000',
        }}
      >
        Promedio por turno
      </Typography>
      <Typography
        sx={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#000',
          lineHeight: 1.2,
        }}
      >
        $75
      </Typography>
    </Box>
  </CardContent>
</Card>

            </Box>

            {/* Turno en Curso */}

            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                color: '#333',
                fontSize: '18px',
              }}
            >
             Turno en Curso
            </Typography>
            
<Box
  sx={{
    mb: 3,
    p: 2.5,
    backgroundColor: '#F2F2F2',
    borderRadius: 1, // antes era 3
  }}
>
  <Typography
    variant="subtitle1"
    sx={{
      fontWeight: 'bold',
      mb: 1,
      fontSize: '16px',
      color: '#000',
    }}
  >
    CTown Supermarket
  </Typography>

  {/* Dirección */}
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
    <LocationSVG />
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        fontSize: '13px',
        lineHeight: 1.4,
        ml: 1.5,
      }}
    >
      CTown Supermarket 272<br />
      Maple St, Perth Amboy, NJ 08861, USA
    </Typography>
  </Box>

  {/* Hora */}
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
    <TimeSVG />
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        fontSize: '13px',
        ml: 1.5,
      }}
    >
      Hora: 8:00 AM - 12:00 PM
    </Typography>
  </Box>

  {/* Números captados */}
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
    <CalendarSVG />
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        fontSize: '13px',
        ml: 1.5,
      }}
    >
      Números captados: 300
    </Typography>
  </Box>

  {/* Tiempo restante */}
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <HourglassSVG />
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        fontSize: '13px',
        ml: 1.5,
      }}
    >
      Tiempo restante: 1h 45m
    </Typography>
  </Box>
</Box>



            {/* Botón Iniciar a Prospectar */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#e91e63',
                color: 'white',
                fontWeight: 'bold',
                py: 1.2,
                mb: 4,
                borderRadius: 4,
                textTransform: 'none',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
                '&:hover': {
                  backgroundColor: '#c2185b',
                  boxShadow: '0 6px 16px rgba(233, 30, 99, 0.4)',
                },
              }}
            >
              Comenzar a Captar Contactos
            </Button>

            {/* Progreso del Objetivo */}
           <Typography
  variant="h6"
  sx={{
    fontWeight: 'bold',
    mb: 2,
    color: '#000',
    fontSize: '16px',
  }}
>
  Progreso del Objetivo
</Typography>
<Box sx={{ mb: 3 }}>
  {/* Barra de progreso con efecto 3D */}
  <Box
    sx={{
      position: 'relative',
      height: 20,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: '#e0e0e0',
      boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.2), inset 0 -1px 2px rgba(255,255,255,0.5)',
      backgroundImage:
        'repeating-linear-gradient(45deg, #EC008C 0px, #EC008C 8px, #e0e0e0 8px, #e0e0e0 16px)',
      backgroundSize: '60% 100%',
      backgroundRepeat: 'no-repeat',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(0,0,0,0.1))',
        borderRadius: 10,
      },
    }}
  />
</Box>

<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
  <Box
        
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        
        <Typography
          variant="caption"
          sx={{
            paddingTop: '32px',
            paddingLeft: '15px',
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#EC008C',
            mt: 1,
          }}
        >
          0
        </Typography>
      </Box>
  {progressData.map((item, index) => {
    if (index === 0) return null; // Oculta el primer elemento
    return (
      <Box
        key={index}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            filter:
              'drop-shadow(0px 1px 2px rgba(0,0,0,0.3)) drop-shadow(0px 2px 6px rgba(255,255,255,0.2))',
          }}
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="#EC008C"
            stroke="#C2185B"
            strokeWidth="0.5"
          />
        </svg>
        <Typography
          variant="caption"
          sx={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#EC008C',
            mt: 1,
          }}
        >
          {item.value}
        </Typography>
      </Box>
    );
  })}
</Box>





            {/* Rendimiento Histórico */}
            <Typography
  variant="h6"
  sx={{
    fontWeight: 'bold',
    mb: 2,
    color: '#000',
    paddingTop:'15px',
    fontSize: '16px',
  }}
>
  Rendimiento Histórico
</Typography>

<Box
  sx={{
    height: 180,
    px: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 1.5, // Más cuadrado
    py: 1.5,
  }}
>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={chartData}
      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      barCategoryGap="20%"
    >
      <XAxis
        dataKey="day"
        axisLine={false}
        tickLine={false}
        tick={{
          fontSize: 12,
          fill: '#333',
        }}
      />
      <YAxis hide />
      <Bar
        dataKey="value"
        fill="#EC008C"
        radius={[6, 6, 0, 0]}
        barSize={28}
      />
    </BarChart>
  </ResponsiveContainer>
</Box>

          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
};

export default PerformancePage;
