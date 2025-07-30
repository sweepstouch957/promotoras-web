'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '400px',
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid #e0e0e0',
  position: 'relative',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  backgroundColor: '#f5f5f5',
}));

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

// Default locations for demo (New Jersey area)
const defaultMarkers = [
  {
    position: { lat: 40.5186, lng: -74.3207 },
    title: 'Fresh Market',
    info: 'Fresh Market - 111 Main St, New Brunswick, NJ',
  },
  {
    position: { lat: 40.5087, lng: -74.3312 },
    title: 'IGA Supermarket',
    info: 'IGA Supermarket - 222 George St, New Brunswick, NJ',
  },
  {
    position: { lat: 40.5276, lng: -74.3102 },
    title: 'Village Market',
    info: 'Village Market - 333 Somerset St, New Brunswick, NJ',
  },
  {
    position: { lat: 40.5156, lng: -74.3407 },
    title: 'Metro Foodmarket',
    info: 'Metro Foodmarket - 444 Albany St, New Brunswick, NJ',
  },
];

export default function GoogleMap({
  center = { lat: 40.5186, lng: -74.3207 }, // New Brunswick, NJ
  zoom = 13,
  markers = defaultMarkers,
  onLocationSelect,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        // Use a demo API key or create a simple fallback
        const loader = new Loader({
          apiKey: 'DEMO_KEY', // In production, use a real API key
          version: 'weekly',
          libraries: ['places'],
        });

        // For demo purposes, create a simple map simulation
        if (mapRef.current) {
          // Create a simple visual representation instead of actual Google Maps
          createDemoMap();
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        // Create demo map as fallback
        createDemoMap();
      }
    };

    const createDemoMap = () => {
      if (mapRef.current) {
        // Create a demo map with CSS and HTML
        mapRef.current.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #e8f5e8 0%, #f0f8ff 50%, #fff3e0 100%);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
          ">
            <div style="
              position: absolute;
              top: 20px;
              left: 20px;
              background: white;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              font-size: 14px;
              font-weight: 600;
              color: #333;
            ">
              📍 New Brunswick, NJ
            </div>
            
            ${markers.map((marker, index) => `
              <div style="
                position: absolute;
                top: ${30 + (index * 60)}px;
                left: ${50 + (index * 80)}px;
                background: #e91e63;
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(233, 30, 99, 0.3);
                transform: translateX(-50%);
                transition: all 0.3s ease;
              "
              onmouseover="this.style.transform='translateX(-50%) scale(1.1)'"
              onmouseout="this.style.transform='translateX(-50%) scale(1)'"
              onclick="alert('${marker.info}')"
              >
                🏪 ${marker.title}
              </div>
            `).join('')}
            
            <div style="
              text-align: center;
              color: #666;
              font-size: 16px;
              margin-top: 100px;
            ">
              <div style="font-size: 48px; margin-bottom: 10px;">🗺️</div>
              <div style="font-weight: 600; margin-bottom: 5px;">Mapa de Ubicaciones</div>
              <div style="font-size: 14px;">Haz clic en los marcadores para ver detalles</div>
            </div>
          </div>
        `;
        
        setLoading(false);
        setError(null);
      }
    };

    initMap();
  }, [center, zoom, markers]);

  if (loading) {
    return (
      <MapContainer>
        <LoadingContainer>
          <CircularProgress color="primary" size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Cargando mapa...
          </Typography>
        </LoadingContainer>
      </MapContainer>
    );
  }

  if (error) {
    return (
      <MapContainer>
        <LoadingContainer>
          <Alert severity="info" sx={{ maxWidth: 300 }}>
            <Typography variant="body2">
              Mapa en modo demo. En producción se conectaría con Google Maps API.
            </Typography>
          </Alert>
        </LoadingContainer>
      </MapContainer>
    );
  }

  return (
    <MapContainer>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </MapContainer>
  );
}

