"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { cookieAuth } from "@/utils/cookieAuth";

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api")
  .replace("/api", "");

let sharedSocket: Socket | null = null;

export function getSocket(): Socket {
  if (!sharedSocket || !sharedSocket.connected) {
    const token = cookieAuth.getToken();
    sharedSocket = io(SOCKET_URL, {
      query: { token: token || "" },
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return sharedSocket;
}

export interface ShiftAssignedPayload {
  type: "SHIFT_ASSIGNED";
  shiftId: string;
  storeId: string;
  startTime: string;
  endTime: string;
  heldUsd: number;
  message: string;
  timestamp: string;
}

export function useSocket(userId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    socket.once("connect", () => {
      socket.emit("join-user-room", { userId, userType: "promoter" });
    });

    // If already connected, join room immediately
    if (socket.connected) {
      socket.emit("join-user-room", { userId, userType: "promoter" });
    }

    return () => {
      // Don't disconnect on unmount — socket is shared across the app.
      // Room membership persists until page unload or explicit logout.
    };
  }, [userId]);

  const on = useCallback(
    <T = unknown>(event: string, handler: (data: T) => void) => {
      const socket = socketRef.current;
      if (!socket) return () => {};
      socket.on(event, handler);
      return () => socket.off(event, handler);
    },
    []
  );

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { on, emit };
}

export function disconnectSocket(userId: string) {
  if (sharedSocket?.connected) {
    sharedSocket.emit("leave-user-room", { userId, userType: "promoter" });
    sharedSocket.disconnect();
    sharedSocket = null;
  }
}
