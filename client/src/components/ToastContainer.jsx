import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToNotifications } from "../managers/NotificationManager";
import "./Notification.css";

export default function ToastContainer() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const unsubscribe = subscribeToNotifications((msg) => {
      const id = Date.now();
      setMessages((prev) => [...prev, { id, text: msg }]);
      setTimeout(() => { 
        setMessages((prev) => prev.filter((m) => m.id !== id)); 
      }, 3000);
    });
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  return (
    <div className="notification-container">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div 
            key={msg.id} 
            className="notification-toast" 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 50 }}
          >
            {msg.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}