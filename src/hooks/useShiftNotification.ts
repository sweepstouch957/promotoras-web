"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import { ShiftAssignedNotification } from "@/types";

export function useShiftNotification(userId: string | undefined) {
  const { on } = useSocket(userId);
  const [pending, setPending] = useState<ShiftAssignedNotification | null>(null);

  useEffect(() => {
    if (!userId) return;
    const off = on<ShiftAssignedNotification>("shift-assigned", (data) => {
      setPending(data);
    });
    return off;
  }, [userId, on]);

  const dismiss = useCallback(() => setPending(null), []);

  return { pending, dismiss };
}
