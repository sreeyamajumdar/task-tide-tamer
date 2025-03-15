
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Task, Category, getTasks, sortTasksByDeadline, filterTasksByCategory, filterCompletedTasks } from "@/utils/taskUtils";
import TaskItem from "./TaskItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ListFilter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskListProps {
  refreshTrigger: number;
}

const TaskList = ({ refreshTrigger }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "overdue">("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");

  // Load tasks from localStorage
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, [refreshTrigger]);

  // Apply filters
  useEffect(() => {
    let filtered = [...tasks];
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filterTasksByCategory(filtered, categoryFilter as Category);
    }
    
    // Apply tab filter
    if (activeTab === "upcoming") {
      filtered = filtered.filter(task => {
        const deadline = new Date(task.deadline);
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        const daysUntil = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 7;
      });
    } else if (activeTab === "overdue") {
      filtered = filtered.filter(task => {
        const deadline = new Date(task.deadline);
        return deadline < new Date();
      });
    }
    
    // Apply completed filter
    filtered = filterCompletedTasks(filtered, showCompleted);
    
    // Sort by deadline
    filtered = sortTasksByDeadline(filtered);
    
    setFilteredTasks(filtered);
  }, [tasks, activeTab, showCompleted, categoryFilter]);

  return (
    <div className="bg-white rounded-xl shadow-subtle border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl font-medium">Your Tasks</h2>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor="show-completed" className="text-sm">
                Show completed
              </Label>
              <Switch
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              />
            </div>
            
            <div className="flex items-center">
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as Category | "all")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "all" | "upcoming" | "overdue")}
        className="w-full"
      >
        <div className="px-4 border-b border-gray-100">
          <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger 
              value="all"
              className="h-10 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="h-10 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Next 7 Days
            </TabsTrigger>
            <TabsTrigger
              value="overdue"
              className="h-10 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Overdue
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="m-0">
          <ScrollArea className="h-[calc(100vh-20rem)] p-4">
            {filteredTasks.length > 0 ? (
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={() => setTasks(getTasks())}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-32 text-center"
              >
                <div className="bg-gray-50 rounded-full p-2 mb-2">
                  <Check className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-500">No tasks found</p>
                <p className="text-sm text-gray-400">
                  {showCompleted
                    ? "Try changing your filters"
                    : "All caught up! Add a new task to get started."}
                </p>
              </motion.div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="upcoming" className="m-0">
          <ScrollArea className="h-[calc(100vh-20rem)] p-4">
            {filteredTasks.length > 0 ? (
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={() => setTasks(getTasks())}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-32 text-center"
              >
                <div className="bg-gray-50 rounded-full p-2 mb-2">
                  <Check className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-500">No upcoming tasks</p>
                <p className="text-sm text-gray-400">
                  You're all set for the next 7 days!
                </p>
              </motion.div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="overdue" className="m-0">
          <ScrollArea className="h-[calc(100vh-20rem)] p-4">
            {filteredTasks.length > 0 ? (
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={() => setTasks(getTasks())}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-32 text-center"
              >
                <div className="bg-gray-50 rounded-full p-2 mb-2">
                  <Check className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-500">No overdue tasks</p>
                <p className="text-sm text-gray-400">
                  You're on top of everything!
                </p>
              </motion.div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
