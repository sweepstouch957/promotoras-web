import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { getSocket } from "./useSocket";

// Module-level state persists across re-mounts (route changes don't reset throttle)
let _lastEmitMs = 0;
let _lastLat: number | null = null;
let _lastLng: number | null = null;

const MIN_MOVE_METERS = 10;
const MIN_INTERVAL_MS = 30_000;
const HEARTBEAT_INTERVAL_MS = 60_000;
const HEARTBEAT_FORCE_AFTER_MS = 90_000;

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function shouldEmit(lat: number, lng: number): boolean {
  const elapsed = Date.now() - _lastEmitMs;
  if (elapsed < MIN_INTERVAL_MS) return false;
  if (_lastLat !== null && _lastLng !== null && elapsed < HEARTBEAT_FORCE_AFTER_MS) {
    if (haversineMeters(_lastLat, _lastLng, lat, lng) < MIN_MOVE_METERS) return false;
  }
  return true;
}

function emitLocation(userId: string, lat: number, lng: number) {
  if (!shouldEmit(lat, lng)) return;
  _lastEmitMs = Date.now();
  _lastLat = lat;
  _lastLng = lng;
  const sock = getSocket();
  if (!sock.connected) sock.connect();
  sock.emit("location:update", { userId, coordinates: [lng, lat] });
}

export function useLocationTracker() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId || typeof window === "undefined" || !navigator.geolocation) return;

    // Initial position — throttle applies; won't fire twice on rapid re-mounts
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => emitLocation(userId, latitude, longitude),
      (err) => console.warn("Geolocation error:", err.message),
      { enableHighAccuracy: true, timeout: 10_000 },
    );

    // Live position watch
    const watchId = navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => emitLocation(userId, latitude, longitude),
      (err) => console.warn("watchPosition error:", err.message),
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 15_000 },
    );

    // Heartbeat: forces emit after 90s idle to keep lastActive fresh
    const heartbeatId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          if (Date.now() - _lastEmitMs >= HEARTBEAT_FORCE_AFTER_MS) {
            _lastEmitMs = 0; // reset so shouldEmit passes distance check
          }
          emitLocation(userId, latitude, longitude);
        },
        () => {},
        { enableHighAccuracy: false, timeout: 5_000 },
      );
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(heartbeatId);
    };
  }, [userId]);
}
