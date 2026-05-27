import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { authService } from "../services/api";

export function useLocationTracker() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!userId || typeof window === "undefined" || !navigator.geolocation) {
      return;
    }

    const sendLocationUpdate = (lat: number, lng: number) => {
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
        .catch((err) => {
          console.error("Error updating location heartbeat:", err);
        })
        .finally(() => {
          isUpdatingRef.current = false;
        });
    };

    // Request position and send initial update
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendLocationUpdate(latitude, longitude);
      },
      (error) => {
        console.warn("Geolocation permission denied or error:", error.message);
        // Even if geolocation fails, we send a heartbeat updating lastActive
        if (userId) {
          authService.updateProfile(userId, {
            // @ts-ignore
            lastActive: new Date(),
          }).catch(() => {});
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Watch position to update in real-time if they move
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

    // Heartbeat fallback: update lastActive every 45 seconds even if they don't move
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendLocationUpdate(latitude, longitude);
        },
        () => {
          // Heartbeat if location fails
          if (userId) {
            authService.updateProfile(userId, {
              // @ts-ignore
              lastActive: new Date(),
            }).catch(() => {});
          }
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }, 45000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
    };
  }, [userId]);
}
