
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Flag } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onDateSelect: (date: Date) => void;
}

export const CalendarModal = ({ isOpen, onClose, tasks, onDateSelect }: CalendarModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getTasksForDate = (date: Date) => {
    if (!date) return [];
    const dateString = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDateString = format(new Date(task.dueDate), 'yyyy-MM-dd');
      return taskDateString === dateString;
    });
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onDateSelect(date);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Task Calendar</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border-0"
                modifiers={{
                  hasTasks: (date) => {
                    const tasksForDate = getTasksForDate(date);
                    return tasksForDate.length > 0;
                  }
                }}
                modifiersStyles={{
                  hasTasks: {
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-1">Legend:</p>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Days with tasks</span>
              </div>
            </div>
          </div>

          {/* Tasks for Selected Date */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Tasks for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
              </h3>
              
              {selectedDateTasks.length === 0 ? (
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No tasks scheduled for this date
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {selectedDateTasks.map((task) => (
                    <Card key={task.id} className="border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {task.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              <Flag className="h-3 w-3 mr-1" />
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('-', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Due: {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
