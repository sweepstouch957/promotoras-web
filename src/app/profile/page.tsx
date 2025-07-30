'use client';
import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Help as HelpIcon,
  ExitToApp as LogoutIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AppLayout from '../../components/Layout/AppLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

const ProfileContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ProfileHeader = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  marginBottom: theme.spacing(3),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  fontSize: '2rem',
}));

const InfoCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const SettingsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const EditButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: 'none',
}));

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateUser({
      name: editedUser.name,
      email: editedUser.email,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/welcome';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <AppLayout currentPage="profile">
      <ProfileContainer>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Mi Perfil
        </Typography>

        {/* Profile Header */}
        <ProfileHeader>
          <ProfileAvatar sx={{ bgcolor: 'primary.main' }}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials(user?.name || 'Usuario')
            )}
          </ProfileAvatar>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {user?.name || 'Usuario'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Impulsadora de Ventas
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
            {!isEditing ? (
              <EditButton
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Editar Perfil
              </EditButton>
            ) : (
              <>
                <EditButton
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{ mr: 1 }}
                >
                  Guardar
                </EditButton>
                <EditButton
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  Cancelar
                </EditButton>
              </>
            )}
          </Box>
        </ProfileHeader>

        {/* Personal Information */}
        <InfoCard>
          <Typography variant="h6" fontWeight={500} gutterBottom>
            Información Personal
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                value={editedUser.phone}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={editedUser.address}
                onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                InputProps={{
                  startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
          </Grid>
        </InfoCard>

        {/* Statistics */}
        <InfoCard>
          <Typography variant="h6" fontWeight={500} gutterBottom>
            Estadísticas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" fontWeight={600}>
                  {user?.totalShifts || 5}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Turnos Totales
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight={600}>
                  ${user?.totalEarnings || 375}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ganancias Totales
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight={600}>
                  4.8
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calificación
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" fontWeight={600}>
                  95%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tasa de Finalización
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </InfoCard>

        {/* Settings */}
        <SettingsCard>
          <Typography variant="h6" fontWeight={500} gutterBottom>
            Configuración
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notificaciones" secondary="Recibir alertas de nuevos turnos" />
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                color="primary"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="Idioma" secondary="Español" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Privacidad y Seguridad" secondary="Gestionar configuración de privacidad" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Ayuda y Soporte" secondary="Centro de ayuda y contacto" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Cerrar Sesión" 
                secondary="Salir de la aplicación"
                primaryTypographyProps={{ color: 'error.main' }}
              />
            </ListItem>
          </List>
        </SettingsCard>
      </ProfileContainer>
    </AppLayout>
    </ProtectedRoute>
  );
}

