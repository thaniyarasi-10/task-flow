import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Edit, Save } from "lucide-react";
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

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSaveTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const EditTaskModal = ({ isOpen, onClose, task, onSaveTask }: EditTaskModalProps) => {
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate || ''
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSaveTask({
        ...formData,
        dueDate: formData.dueDate || undefined
      });
      
      setIsSubmitting(false);
    }, 500);
  };

  const handleChange = (field: keyof Omit<Task, 'id' | 'createdAt'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-purple-200 dark:border-purple-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient flex items-center gap-2">
            <Edit className="h-6 w-6 text-purple-500" />
            Edit Task
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6 pt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold">
              Task Title *
            </Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="border-purple-200 focus:border-purple-400 dark:border-purple-700 text-lg py-3"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add some details about this task..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="border-purple-200 focus:border-purple-400 dark:border-purple-700 min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-semibold">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => handleChange('priority', value)}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400 dark:border-purple-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
                  <SelectItem value="low" className="hover:bg-purple-50 dark:hover:bg-purple-900/50">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      Low Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="medium" className="hover:bg-purple-50 dark:hover:bg-purple-900/50">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      Medium Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="high" className="hover:bg-purple-50 dark:hover:bg-purple-900/50">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      High Priority
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-semibold">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'todo' | 'in-progress' | 'completed') => handleChange('status', value)}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400 dark:border-purple-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
                  <SelectItem value="todo" className="hover:bg-purple-50 dark:hover:bg-purple-900/50">To Do</SelectItem>
                  <SelectItem value="in-progress" className="hover:bg-purple-50 dark:hover:bg-purple-900/50">In Progress</SelectItem>
                  <SelectItem value="completed" className="hover:bg-purple-50 dark:hover:bg-purple-900/50">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date (Optional)
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="border-purple-200 focus:border-purple-400 dark:border-purple-700"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};