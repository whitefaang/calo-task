import { nanoid } from "nanoid";
import React, { ReactElement, useCallback, useState } from "react";
import ReactDOM from "react-dom";

/**
 * Notification model
 */
interface INotification {
  id: string;
  message: string;
  level: "danger";
}

// notification context
// contains 2 methods : show (used to show notifications) , remove (used to remove notifcations)
export const notificationCtx = React.createContext<{
  show: (msg: string) => string;
  remove: (id: string) => void;
} | null>(null);

interface Props {
  children: ReactElement;
}

/**
 * Notification Provider context
 */
function NotificationProvider({ children }: Props) {
  // list of notifications
  const [notifications, setNotifications] = useState<INotification[]>([]);

  // shows a notification by adding it to the state and removing it after default 5 seconds
  // supports only danger (error /failure) notification since fullfledged notification context not required
  const show = useCallback((message: string) => {
    const id = nanoid();
    setNotifications((prev) => {
      setTimeout(() => {
        remove(id);
      }, 5000);
      return [
        { id, message, level: "danger" },
        // dont keep more than 5 notifications
        // since entire screen amybe occupied
        ...(prev.length === 5 ? prev.slice(-1) : prev),
      ];
    });
    return id;
  }, []);

  // remove a particular notification
  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <notificationCtx.Provider value={{ show, remove }}>
      {/*
       * portal for the notification lust
       */}
      {ReactDOM.createPortal(
        <div className="fixed w-screen top-10 flex flex-col gap-3 items-center">
          {/*
           * notifications are mapped over and all are showed here
           */}
          {notifications.map((n) => (
            <div
              key={n.id}
              className="text-danger flex items-center bg-color rounded-lg shadow-gray shadow-2xl p-3 font-bold text-sm"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </span>
              <span className="ml-2">{n.message}</span>
            </div>
          ))}
        </div>,
        document.getElementById("notifications")!
      )}
      {children}
    </notificationCtx.Provider>
  );
}

export default NotificationProvider;
