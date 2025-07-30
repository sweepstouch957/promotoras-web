import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  MenuItem,
  Select,
} from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function ShiftCard({ shift, onSuccess }) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState('');
  const [currentMonth, setCurrentMonth] = React.useState(new Date(2025, 6)); // Julio 2025
  const [step, setStep] = React.useState('calendar');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);

  const today = new Date();

  const handleRequest = () => {
    setShowDialog(true);
    setStep('calendar');
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleSelectDate = (day) => {
    const chosen = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (chosen >= new Date(today.setHours(0, 0, 0, 0))) {
      setSelectedDate(chosen);
      setStep('time');
    }
  };

  const handleSubmit = () => setShowSuccess(true);

  const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
  const timeOptions = [
    '08:00 AM - 12:00 PM',
    '09:00 AM - 13:00 PM',
    '10:00 AM - 14:00 PM',
    '11:00 AM - 15:00 PM',
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const { firstDay, totalDays } = getDaysInMonth(currentMonth);

  return (
    <Box sx={{ p: 2 }}>
      <Card
        sx={{
          borderRadius: 2,
          p: 2,
          bgcolor: '#F8F8F8',
          boxShadow: 0,
          maxWidth: 320,
          mx: 'auto',
        }}
      >
        <CardContent>
          <Typography fontWeight={700}>{shift.supermarketName}</Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.4 }}
          >
            {shift.address}
          </Typography>

          {selectedDate && selectedTime && (
            <Stack direction="row" spacing={2} my={2} alignItems="center">
              <CalendarMonthIcon sx={{ color: '#e91e63' }} />
              <Typography fontWeight={700} fontSize={14}>
                {selectedDate.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>
              <AccessTimeIcon sx={{ color: '#e91e63', ml: 2 }} />
              <Typography fontWeight={700} fontSize={14}>
                {selectedTime}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" justifyContent="space-around" my={2}>
            <CalendarMonthIcon sx={{ color: '#e91e63', fontSize: 32 }} />
            <AccessTimeIcon sx={{ color: '#e91e63', fontSize: 32 }} />
          </Stack>

          <Box textAlign="center">
            {requestSent ? (
              <Box
                mt={1}
                px={2}
                py={1}
                sx={{
                  borderRadius: 99,
                  backgroundColor: '#eeeeee',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 20, color: '#e91e63' }} />
                <Typography fontWeight={700} fontSize={14}>
                  Solicitud Enviada
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={handleRequest}
                sx={{
                  backgroundColor: '#ff007f',
                  borderRadius: 99,
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Enviar Solicitud
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={showDialog && !showSuccess}
        onClose={() => setShowDialog(false)}
        fullWidth
      >
        <DialogContent>
          {step === 'calendar' && (
            <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
              <Typography align="center" fontWeight={700} mb={2}>
                Selecciona un Día
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <IconButton
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1
                      )
                    )
                  }
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <Typography>
                  {currentMonth.toLocaleDateString('es-ES', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Typography>
                <IconButton
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1
                      )
                    )
                  }
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Grid
                container
                spacing={1}
                justifyContent="center"
                sx={{ maxWidth: 280, mx: 'auto' }}
              >
                {daysOfWeek.map((d) => (
                  <Grid item key={d} xs={1.5}>
                    <Typography align="center" fontWeight={600}>
                      {d}
                    </Typography>
                  </Grid>
                ))}
                {Array.from({ length: firstDay }, (_, i) => (
                  <Grid item key={`empty-${i}`} xs={1.5}></Grid>
                ))}
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const current = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  );
                  const isToday =
                    current.toDateString() === new Date().toDateString();
                  const isPast = current < new Date(today.setHours(0, 0, 0, 0));
                  const isSelectable = !isPast;
                  const isSelected = selectedDate?.getDate() === day;

                  return (
                    <Grid item key={day} xs={1.5}>
                      <Button
                        onClick={() => handleSelectDate(day)}
                        disabled={!isSelectable}
                        sx={{
                          minWidth: 0,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: isSelected
                            ? '#ff007f'
                            : isToday
                            ? 'transparent'
                            : 'transparent',
                          border: isSelectable ? '1px solid #ddd' : 'none',
                          boxShadow: isSelectable
                            ? '0 1px 2px rgba(0,0,0,0.15)'
                            : 'none',
                          color: isSelected
                            ? 'white'
                            : isToday
                            ? '#ff007f'
                            : isPast
                            ? '#ccc'
                            : 'black',
                          fontWeight: isToday ? 700 : 600,
                        }}
                      >
                        {day}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          )}

          {step === 'time' && (
            <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
              <Typography align="center" fontWeight={700} mb={2}>
                Selecciona un Horario
              </Typography>
              <Select
                fullWidth
                displayEmpty
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                sx={{ bgcolor: '#fff', borderRadius: 2, mb: 3 }}
              >
                <MenuItem value="">
                  <em>00:00 - 00:00</em>
                </MenuItem>
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
              <Box textAlign="center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedTime}
                  variant="contained"
                  sx={{
                    borderRadius: 99,
                    backgroundColor: '#ff007f',
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Confirmar Solicitud
                </Button>
              </Box>
            </Paper>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setShowDialog(false);
          setRequestSent(true);
          onSuccess?.();
        }}
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
          <Typography variant="h6" fontWeight={700} mt={2}>
            ¡Solicitud Enviada!
          </Typography>
          <Typography mt={1}>
            Tu solicitud ha sido enviada exitosamente.
          </Typography>
          <Typography mb={3}>
            Te notificaremos cuando sea confirmada.
          </Typography>
          <Button
            onClick={() => {
              setShowSuccess(false);
              setShowDialog(false);
              setRequestSent(true);
              onSuccess?.();
            }}
            variant="contained"
            sx={{
              borderRadius: 999,
              backgroundColor: '#ff007f',
              textTransform: 'none',
            }}
          >
            Continuar
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
