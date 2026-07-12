import { useState, useEffect, useCallback } from "react";
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { useAuth } from "./auth";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "job_assigned" | "job_completed" | "verification_approved" | "verification_rejected" | "new_job" | "info";
  read: boolean;
  createdAt: string;
}

const STORAGE_KEY = "nuzia_notifications";

function getLocalNotifications(): AppNotification[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalNotifications(notifs: AppNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
}

export function useNotifications() {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setNotifications(getLocalNotifications());
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (!messaging || !userProfile) return;
    const requestPermission = async () => {
      try {
        const status = await Notification.requestPermission();
        setPermission(status);
        if (status === "granted") {
          const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
          if (token) {
            localStorage.setItem("nuzia_fcm_token", token);
          }
        }
      } catch (err) {
        console.warn("FCM permission denied or unavailable:", err);
      }
    };
    if (Notification.permission === "default") {
      requestPermission();
    }
  }, [userProfile]);

  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      const newNotif: AppNotification = {
        id: Date.now().toString(),
        title: payload.notification?.title || "Nuzia",
        body: payload.notification?.body || "",
        type: (payload.data?.type as AppNotification["type"]) || "info",
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        saveLocalNotifications(updated);
        return updated;
      });
    });
    return () => unsubscribe();
  }, []);

  const addNotification = useCallback((title: string, body: string, type: AppNotification["type"] = "info") => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      body,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      saveLocalNotifications(updated);
      return updated;
    });
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveLocalNotifications(updated);
      return updated;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveLocalNotifications(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveLocalNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, permission, addNotification, markRead, markAllRead, clearAll };
}
