import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Circle, Calendar, Trash2, Edit, MoreHorizontal, Share2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onShare?: (task: Task) => void;
}

export const TaskCard = ({ task, onUpdate, onDelete, onShare }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const toggleStatus = () => {
    const statusOrder: Task['status'][] = ['todo', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onUpdate(task.id, { status: statusOrder[nextIndex] });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`transition-all duration-300 cursor-pointer border-l-4 ${
        task.status === 'completed' 
          ? 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10' 
          : task.status === 'in-progress'
          ? 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10'
          : 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10'
      } ${isHovered ? 'shadow-lg shadow-purple-200/50 dark:shadow-purple-800/30' : 'shadow-sm'} 
      ${isOverdue ? 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={toggleStatus}
                  className="flex-shrink-0 hover:scale-110 transition-transform duration-200"
                >
                  {getStatusIcon()}
                </button>
                
                <h3 className={`font-semibold text-lg truncate ${
                  task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {task.title}
                </h3>
              </div>

              <p className={`text-gray-600 dark:text-gray-300 mb-3 leading-relaxed ${
                task.status === 'completed' ? 'line-through opacity-60' : ''
              }`}>
                {task.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusColor()}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                </Badge>
                
                <Badge className={getPriorityColor()}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>

                {task.dueDate && (
                  <Badge variant="outline" className={`flex items-center gap-1 ${
                    isOverdue ? 'border-red-300 text-red-600 dark:border-red-700 dark:text-red-400' : 
                    'border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400'
                  }`}>
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                    {isOverdue && <span className="text-xs font-semibold">OVERDUE</span>}
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
                <DropdownMenuItem className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/50">
                  <Edit className="h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
                {onShare && (
                  <DropdownMenuItem 
                    className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/50"
                    onClick={() => onShare(task)}
                  >
                    <Share2 className="h-4 w-4" />
                    Share Task
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/50">
                  <Calendar className="h-4 w-4" />
                  Change Due Date
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};