import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Flag } from "lucide-react";
import { format, isSameDay } from "date-fns";

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
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      try {
        const taskDate = new Date(task.dueDate);
        return isSameDay(taskDate, date);
      } catch (error) {
        console.error('Error parsing task date:', task.dueDate, error);
        return false;
      }
    });
  };

  const getTasksWithDueDates = () => {
    return tasks.filter(task => task.dueDate).map(task => {
      try {
        return {
          ...task,
          parsedDate: new Date(task.dueDate!)
        };
      } catch (error) {
        console.error('Error parsing task date:', task.dueDate, error);
        return null;
      }
    }).filter(Boolean);
  };

  const tasksWithDates = getTasksWithDueDates();
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

  // Create modifiers for dates with tasks
  const modifiers = {
    hasTasks: (date: Date) => {
      return tasksWithDates.some(task => 
        task && isSameDay(task.parsedDate, date)
      );
    }
  };

  const modifiersStyles = {
    hasTasks: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '50%'
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
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
              />
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-2">Legend:</p>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span>Days with tasks ({tasksWithDates.length} total)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 rounded-full"></div>
                  <span>Selected date</span>
                </div>
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
                    {selectedDate && (
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                    )}
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

            {/* Summary of all tasks with due dates */}
            {tasksWithDates.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                  All Upcoming Tasks ({tasksWithDates.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {tasksWithDates
                    .sort((a, b) => a!.parsedDate.getTime() - b!.parsedDate.getTime())
                    .map((task) => (
                      <div 
                        key={task!.id} 
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleDateSelect(task!.parsedDate)}
                      >
                        <span className="font-medium truncate">{task!.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {format(task!.parsedDate, 'MMM d')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
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