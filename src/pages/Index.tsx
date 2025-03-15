
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Reminder from "@/components/Reminder";
import { checkForDueTasksAndNotify } from "@/utils/taskUtils";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check for due tasks when the page loads
  useEffect(() => {
    checkForDueTasksAndNotify();
  }, []);

  const handleTaskAdded = () => {
    setShowForm(false);
    // Trigger a refresh of the task list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Reminder />
      
      <main className="container py-8">
        <div className="mb-6 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Academic Planner</h1>
            <p className="text-gray-500">
              Organize your assignments, exams, and projects in one place.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={() => setShowForm(!showForm)} 
              className="flex items-center gap-1"
            >
              {showForm ? (
                "Cancel"
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Task
                </>
              )}
            </Button>
          </motion.div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {showForm && (
              <TaskForm 
                onTaskAdded={handleTaskAdded} 
                onCancel={() => setShowForm(false)} 
              />
            )}
          </AnimatePresence>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TaskList refreshTrigger={refreshTrigger} />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
