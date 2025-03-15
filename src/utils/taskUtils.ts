
import { toast } from "@/components/ui/use-toast";

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  deadline: Date;
  completed: boolean;
  createdAt: Date;
}

export type Category = 
  | "assignment"
  | "exam"
  | "reading"
  | "project"
  | "lecture"
  | "other";

export const categoryColors: Record<Category, string> = {
  assignment: "bg-blue-100 text-blue-800 border-blue-200",
  exam: "bg-red-100 text-red-800 border-red-200",
  reading: "bg-purple-100 text-purple-800 border-purple-200",
  project: "bg-amber-100 text-amber-800 border-amber-200",
  lecture: "bg-emerald-100 text-emerald-800 border-emerald-200",
  other: "bg-gray-100 text-gray-800 border-gray-200",
};

export const categoryIcons: Record<Category, string> = {
  assignment: "file-text",
  exam: "book-open",
  reading: "book",
  project: "folder",
  lecture: "presentation",
  other: "circle",
};

// Local storage keys
const TASKS_STORAGE_KEY = "student-tasks";

// Task management functions
export const getTasks = (): Task[] => {
  const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
  return savedTasks ? JSON.parse(savedTasks) : [];
};

export const saveTask = (task: Task): void => {
  const tasks = getTasks();
  const updatedTasks = [task, ...tasks];
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
};

export const updateTask = (updatedTask: Task): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === updatedTask.id ? updatedTask : task
  );
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
};

export const deleteTask = (taskId: string): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
};

export const toggleTaskCompletion = (taskId: string): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
};

// Date and deadline utilities
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const isOverdue = (deadline: Date): boolean => {
  return new Date(deadline) < new Date();
};

export const getDaysUntil = (deadline: Date): number => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Reminder utilities
export const checkForDueTasksAndNotify = (): void => {
  const tasks = getTasks();

  tasks.forEach(task => {
    if (!task.completed) {
      const daysUntil = getDaysUntil(task.deadline);
      
      if (daysUntil <= 1 && daysUntil >= 0) {
        const timeText = daysUntil === 0 ? "today" : "tomorrow";
        toast({
          title: `Task due ${timeText}!`,
          description: `"${task.title}" is due ${formatDate(task.deadline)}`,
          duration: 5000,
        });
      }
    }
  });
};

// Sorting and filtering
export const sortTasksByDeadline = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => 
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );
};

export const filterTasksByCategory = (tasks: Task[], category: Category): Task[] => {
  return tasks.filter(task => task.category === category);
};

export const filterCompletedTasks = (tasks: Task[], showCompleted: boolean): Task[] => {
  return showCompleted ? tasks : tasks.filter(task => !task.completed);
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
