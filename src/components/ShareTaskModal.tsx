import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Share2, Mail, User, X, Plus, CheckCircle, AlertCircle } from "lucide-react";
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
  const [shareStatus, setShareStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const addEmail = () => {
    if (currentEmail && !shareEmails.includes(currentEmail)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(currentEmail)) {
        setShareEmails([...shareEmails, currentEmail]);
        setCurrentEmail('');
        setShareStatus('idle');
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
    setShareStatus('idle');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      console.log('🚀 Starting task sharing process...');

      // Step 1: Create shared task records in database
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

      console.log('💾 Saving shared tasks to database...');
      const { error: dbError } = await supabase
        .from('shared_tasks')
        .insert(sharedTasks);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('✅ Shared tasks saved to database');

      // Step 2: Send email notifications
      console.log('📧 Sending email notifications...');
      await sendEmailNotifications(shareEmails, task, user, message);

      setShareStatus('success');
      toast({
        title: "Task Shared Successfully! 🎉",
        description: `Task shared with ${shareEmails.length} user(s) and email notifications sent`,
      });

      // Reset form after a short delay
      setTimeout(() => {
        setShareEmails([]);
        setCurrentEmail('');
        setMessage('');
        setShareStatus('idle');
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error sharing task:', error);
      setShareStatus('error');
      toast({
        title: "Sharing Failed",
        description: error.message || "Failed to share task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const sendEmailNotifications = async (emails: string[], task: Task, user: any, message: string) => {
    try {
      console.log('📬 Calling email function with data:', {
        recipients: emails.length,
        taskTitle: task.title,
        sender: user.email
      });

      const { data, error } = await supabase.functions.invoke('send-task-email', {
        body: {
          to: emails,
          task: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate
          },
          sharedBy: {
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'TaskSpace User'
          },
          message: message
        }
      });

      if (error) {
        console.error('❌ Email function error:', error);
        throw new Error(`Email service error: ${error.message}`);
      }

      console.log('✅ Email function response:', data);
      
      if (data?.success) {
        console.log('🎉 Emails sent successfully to', data.recipients, 'recipients');
      } else {
        throw new Error('Email function returned unsuccessful response');
      }

    } catch (error: any) {
      console.error('❌ Error in email notification:', error);
      // Don't throw here - we want the sharing to succeed even if email fails
      toast({
        title: "Email Warning",
        description: "Task shared successfully, but email notifications may have failed to send.",
        variant: "default"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const resetAndClose = () => {
    setShareEmails([]);
    setCurrentEmail('');
    setMessage('');
    setShareStatus('idle');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share Task</span>
            {shareStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {shareStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
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
                {task.description || 'No description'}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {task.priority} priority
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {task.status.replace('-', ' ')}
                </Badge>
              </div>
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
                  disabled={isSharing}
                />
                <Button
                  type="button"
                  onClick={addEmail}
                  size="sm"
                  disabled={!currentEmail || isSharing}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Email List */}
            {shareEmails.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Recipients ({shareEmails.length}):</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {shareEmails.map((email) => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="flex items-center space-x-1 pr-1"
                    >
                      <Mail className="h-3 w-3" />
                      <span className="text-xs">{email}</span>
                      <button
                        onClick={() => removeEmail(email)}
                        className="ml-1 hover:text-red-600 disabled:opacity-50"
                        disabled={isSharing}
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
                Personal Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Add a personal message for the recipients..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                disabled={isSharing}
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {message.length}/500 characters
              </p>
            </div>

            {/* Status Messages */}
            {shareStatus === 'success' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Task shared successfully! Closing in a moment...
                  </span>
                </div>
              </div>
            )}

            {shareStatus === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Failed to share task. Please try again.
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={resetAndClose}
                disabled={isSharing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleShare}
                disabled={shareEmails.length === 0 || isSharing || shareStatus === 'success'}
                className="min-w-[120px]"
              >
                {isSharing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sharing...</span>
                  </div>
                ) : shareStatus === 'success' ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Shared!</span>
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