import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Share2, Mail, User, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const ShareTaskModal = ({ isOpen, onClose, task }: ShareTaskModalProps) => {
  const [shareEmails, setShareEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const addEmail = () => {
    if (currentEmail && !shareEmails.includes(currentEmail)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(currentEmail)) {
        setShareEmails([...shareEmails, currentEmail]);
        setCurrentEmail('');
      } else {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
      }
    }
  };

  const removeEmail = (email: string) => {
    setShareEmails(shareEmails.filter(e => e !== email));
  };

  const handleShare = async () => {
    if (!task || shareEmails.length === 0) return;

    setIsSharing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Create shared task records
      const sharedTasks = shareEmails.map(email => ({
        original_task_id: task.id,
        shared_with_email: email,
        shared_by_user_id: user.id,
        message: message || null,
        task_data: {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate
        }
      }));

      const { error } = await supabase
        .from('shared_tasks')
        .insert(sharedTasks);

      if (error) throw error;

      toast({
        title: "Task Shared Successfully",
        description: `Task shared with ${shareEmails.length} user(s)`
      });

      // Reset form
      setShareEmails([]);
      setCurrentEmail('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sharing task:', error);
      toast({
        title: "Error",
        description: "Failed to share task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share Task</span>
          </DialogTitle>
        </DialogHeader>

        {task && (
          <div className="space-y-6">
            {/* Task Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {task.description}
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Share with (Email addresses)
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addEmail}
                  size="sm"
                  disabled={!currentEmail}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Email List */}
            {shareEmails.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Recipients:</Label>
                <div className="flex flex-wrap gap-2">
                  {shareEmails.map((email) => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <Mail className="h-3 w-3" />
                      <span>{email}</span>
                      <button
                        onClick={() => removeEmail(email)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Add a message for the recipients..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleShare}
                disabled={shareEmails.length === 0 || isSharing}
              >
                {isSharing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sharing...</span>
                  </div>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Task
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};