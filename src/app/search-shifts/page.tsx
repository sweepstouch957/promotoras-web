'use client';
import { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { shiftAPI } from '../../services/api';
import { Shift } from '../../types';
import MapSection from './MapSection';
import SearchOptions from './SearchOptions';
import ShiftCard from './ShiftCard';

export default function SearchShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const availableShifts = await shiftAPI.getAvailableShifts();
        setShifts(availableShifts);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  const handleRequestShift = (shift: Shift) => {
    setSelectedShift(shift);
    setShowDateDialog(true);
  };

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
    setShowDateDialog(false);
    setShowTimeDialog(true);
  };

  const handleTimeSelected = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setShowTimeDialog(false);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSelectedShift(null);
    setSelectedTimeSlot('');
  };

  const shift = {
    supermarketName: 'CTown Supermarket',
    address: 'CTown Supermarket 272 Maple St, Perth Amboy, NJ 08861, USA',
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <AppLayout currentPage="search-shifts">
        <div className="mobile-container">
          <div className="search-shifts-container">
            {/* Header*/}
            <div className="search-header">
              <h1 className="search-title">Buscar Turnos</h1>
            </div>
            <p className="search-subtitle">
              Encuentra turnos disponibles en supermercados cercanos.
            </p>
            {/* Map Section */}
            <MapSection />
            {/* Search Options */}
            <SearchOptions />
            {/* Shifts Header */}
            <ShiftCard
              shift={shift}
              onSuccess={() => console.log('Solicitud confirmada')}
            />
            <ShiftCard
              shift={shift}
              onSuccess={() => console.log('Solicitud confirmada')}
            />
            <ShiftCard
              shift={shift}
              onSuccess={() => console.log('Solicitud confirmada')}
            />
            ;
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
