'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E91E63', // Rosa/Magenta principal
      light: '#F48FB1',
      dark: '#AD1457',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#666666', // Gris para texto secundario
      light: '#999999',
      dark: '#333333',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5', // Fondo gris claro
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#F44336',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#000000',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#000000',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#000000',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#000000',
    },
    body1: {
      fontSize: '1rem',
      color: '#000000',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#666666',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 25, // Botones redondeados como en el diseño
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 500,
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(233, 30, 99, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
              borderColor: '#E91E63',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E91E63',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;

