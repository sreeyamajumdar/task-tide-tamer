
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Task, getTasks, isOverdue, formatDate } from "@/utils/taskUtils";

const Navbar = () => {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    const tasks = getTasks();
    const upcoming = tasks.filter(task => {
      if (task.completed) return false;
      
      const deadline = new Date(task.deadline);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays <= 3;
    });
    
    setUpcomingTasks(upcoming);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary"
          >
            <span className="text-sm font-semibold text-primary-foreground">ST</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold tracking-tight"
          >
            Student Tasks
          </motion.h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {upcomingTasks.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {upcomingTasks.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
              <div className="p-3 border-b border-gray-100">
                <h3 className="font-medium">Upcoming Deadlines</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <AnimatePresence>
                  {upcomingTasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-8 text-center"
                    >
                      <p className="text-sm text-gray-500">No upcoming deadlines</p>
                    </motion.div>
                  ) : (
                    upcomingTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "border-b border-gray-100 p-3",
                          isOverdue(task.deadline) ? "bg-red-50" : "bg-white"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-xs text-gray-500">
                              Due: {formatDate(task.deadline)}
                            </p>
                          </div>
                          <Badge
                            variant={isOverdue(task.deadline) ? "destructive" : "outline"}
                            className="text-[10px]"
                          >
                            {isOverdue(task.deadline) ? "Overdue" : "Upcoming"}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
