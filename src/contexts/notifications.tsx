import { createContext, PropsWithChildren, useContext, useState } from "react";
import { AlertColor } from "@mui/material";

// define notification object shape
export type Notification = {
  id: number;
  title: string;
  message: string;
  severity: AlertColor;
  date: Date;
};

/**
 * Define context shape
 */
interface INotificationContext {
  notifications: Notification[];
  new: (n: Omit<Notification, "id" | "date">) => number;
  dismiss: (id: Notification["id"]) => void;
}

/**
 * define default context, this is overwritten in the const "value"
 */
const defaultContext: INotificationContext = {
  notifications: [],
  new: () => 0,
  dismiss: () => void 0,
};

// create context
const NotificationsContext = createContext(defaultContext);

export function NotificationsContextProvider(props: PropsWithChildren<{}>) {
  const [notifications, setNotifications] = useState<Notification[]>(
    defaultContext.notifications
  );

  // add a new notification to state
  function addNotification(n: Omit<Notification, "id" | "date">) {
    const id = Math.floor(Math.random() * 1e15);
    setNotifications((_notifications) => {
      return [
        ..._notifications,
        {
          id,
          date: new Date(),
          ...n,
        },
      ];
    });
    return id;
  }

  // remove notification by it's ID
  function removeNotification(id: Notification["id"]) {
    setNotifications(notifications.filter((n) => n.id !== id));
  }

  // set the value of the context
  const value: INotificationContext = {
    notifications,
    new: addNotification,
    dismiss: removeNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {props.children}
    </NotificationsContext.Provider>
  );
}

// export a custom hooke to use this context
export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
