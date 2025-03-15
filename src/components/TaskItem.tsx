
import { useState } from "react";
import { Task, toggleTaskCompletion, formatDate, isOverdue, getDaysUntil, deleteTask } from "@/utils/taskUtils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Trash, Clock, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CategoryBadge from "./CategoryBadge";
import { useToast } from "@/components/ui/use-toast";

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

const TaskItem = ({ task, onUpdate }: TaskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const isTaskOverdue = isOverdue(task.deadline);
  const daysUntil = getDaysUntil(task.deadline);

  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
    onUpdate();
    
    if (!task.completed) {
      toast({
        title: "Task completed!",
        description: `You've completed "${task.title}"`,
      });
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onUpdate();
    toast({
      title: "Task deleted",
      description: `"${task.title}" has been removed`,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white rounded-xl shadow-subtle border p-4 mb-3 transition-all",
        task.completed ? "opacity-70" : "",
        isTaskOverdue && !task.completed ? "border-red-200" : "border-gray-100"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleCompletion}
            className="h-5 w-5 transition-all"
          />
          
          <div className="flex-1">
            <h3
              className={cn(
                "font-medium mb-0.5 transition-all",
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              )}
            >
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CategoryBadge category={task.category} />
              
              <div className={cn(
                "flex items-center", 
                isTaskOverdue && !task.completed ? "text-red-500" : ""
              )}>
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(task.deadline)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!task.completed && !isTaskOverdue && daysUntil <= 3 && (
            <div className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full flex items-center",
              daysUntil <= 1 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
            )}>
              <Clock className="h-3 w-3 mr-1" />
              {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
            </div>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="sr-only">Toggle details</span>
            <svg
              className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-gray-100"
        >
          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          <div className="flex justify-end">
            <button
              onClick={handleDelete}
              className="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-800"
            >
              <Trash className="h-3 w-3 mr-1" />
              Delete task
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskItem;
