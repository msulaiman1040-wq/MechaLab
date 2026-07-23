let listeners = [];

export const subscribeToNotifications = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

export const showNotification = (message) => {
  listeners.forEach((listener) => listener(message));
};