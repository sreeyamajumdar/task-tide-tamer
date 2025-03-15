
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Task, checkForDueTasksAndNotify } from "@/utils/taskUtils";

const Reminder = () => {
  useEffect(() => {
    // Check for due tasks when the component mounts
    checkForDueTasksAndNotify();
    
    // Set up an interval to check for due tasks every hour
    const interval = setInterval(() => {
      checkForDueTasksAndNotify();
    }, 60 * 60 * 1000); // 1 hour
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // This is a UI-less component that just manages reminders
  return null;
};

export default Reminder;
