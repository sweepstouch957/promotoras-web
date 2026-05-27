import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { authService } from "../services/api";

// Helper function to calculate distance in meters between two coordinates using the Haversine formula
function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useLocationTracker() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const isUpdatingRef = useRef(false);
  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const lastUpdateTimestampRef = useRef<number>(0);

  useEffect(() => {
    if (!userId || typeof window === "undefined" || !navigator.geolocation) {
      return;
    }

    const sendLocationUpdate = (lat: number, lng: number, force = false) => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimestampRef.current;

      // 1. Throttling: do not send updates faster than every 30 seconds unless forced
      if (!force && timeSinceLastUpdate < 30000) {
        return;
      }

      // 2. Distance threshold: do not send updates if moved less than 10 meters,
      // unless it's been more than 90 seconds (forces a heartbeat to stay online)
      if (!force && lastLocationRef.current && timeSinceLastUpdate < 90000) {
        const distance = haversineDistanceMeters(
          lastLocationRef.current.lat,
          lastLocationRef.current.lng,
          lat,
          lng
        );
        if (distance < 10) {
          return;
        }
      }

      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      authService
        .updateProfile(userId, {
          // @ts-ignore - bypass custom update fields
          lastLocation: {
            type: "Point",
            coordinates: [lng, lat], // GeoJSON order: [longitude, latitude]
          },
          lastActive: new Date(),
        })
        .then(() => {
          lastLocationRef.current = { lat, lng };
          lastUpdateTimestampRef.current = now;
        })
        .catch((err) => {
          console.error("Error updating location heartbeat:", err);
        })
        .finally(() => {
          isUpdatingRef.current = false;
        });
    };

    // Request initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendLocationUpdate(latitude, longitude, true); // Force initial position
      },
      (error) => {
        console.warn("Geolocation permission denied or error:", error.message);
        // Fallback: send simple heartbeat
        if (userId) {
          authService
            .updateProfile(userId, {
              // @ts-ignore
              lastActive: new Date(),
            })
            .then(() => {
              lastUpdateTimestampRef.current = Date.now();
            })
            .catch(() => {});
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Watch position for live movements
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendLocationUpdate(latitude, longitude);
      },
      (error) => {
        console.warn("watchPosition error:", error.message);
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 }
    );

    // Heartbeat fallback: every 60 seconds we check/send heartbeat
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendLocationUpdate(latitude, longitude);
        },
        () => {
          const now = Date.now();
          const timeSinceLastUpdate = now - lastUpdateTimestampRef.current;
          // Send simple heartbeat if it's been more than 90 seconds
          if (userId && timeSinceLastUpdate >= 90000) {
            authService
              .updateProfile(userId, {
                // @ts-ignore
                lastActive: new Date(),
              })
              .then(() => {
                lastUpdateTimestampRef.current = now;
              })
              .catch(() => {});
          }
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }, 60000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
    };
  }, [userId]);
}
