"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
    visible: boolean;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({ message, type, id, visible: true });

    setTimeout(() => {
      setNotification((current) => (current?.id === id ? { ...current, visible: false } : current));
    }, 2500);

    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 ${
            notification.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } ${getAlertClass(notification.type)}`}
        >
          {getIcon(notification.type)}
          <span className="font-medium">{notification.message}</span>
          <button
            className="ml-auto text-white opacity-70 hover:opacity-100"
            onClick={() => setNotification(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// Function to get alert colors
function getAlertClass(type: NotificationType): string {
  switch (type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    case "warning":
      return "bg-yellow-500";
    case "info":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

// Function to get corresponding icons
function getIcon(type: NotificationType) {
  const iconSize = 22;
  switch (type) {
    case "success":
      return <CheckCircle size={iconSize} />;
    case "error":
      return <XCircle size={iconSize} />;
    case "warning":
      return <AlertTriangle size={iconSize} />;
    case "info":
      return <Info size={iconSize} />;
    default:
      return <Info size={iconSize} />;
  }
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
}