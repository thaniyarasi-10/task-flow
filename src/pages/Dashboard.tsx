
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, Search, Filter, Calendar, CheckCircle, Clock, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
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

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design landing page',
      description: 'Create a beautiful and responsive landing page for the new product',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-15',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Review marketing strategy',
      description: 'Analyze current marketing performance and plan next quarter',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-01-20',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Team meeting preparation',
      description: 'Prepare agenda and materials for weekly team sync',
      status: 'completed',
      priority: 'low',
      createdAt: '2024-01-09'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-purple-100 dark:border-purple-800 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient">TaskLove</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                <span>Good morning! ✨</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  {completedTasks}/{totalTasks} completed
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="hidden sm:inline">Profile</span>
                <div className="sm:hidden w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-semibold">J</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Tasks</p>
                    <p className="text-3xl font-bold">{totalTasks}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-100" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-orange-500 to-pink-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">In Progress</p>
                    <p className="text-3xl font-bold">{inProgressTasks}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-100" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Completed</p>
                    <p className="text-3xl font-bold">{completedTasks}</p>
                  </div>
                  <Star className="h-8 w-8 text-green-100" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Completion Rate</p>
                    <p className="text-3xl font-bold">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-100" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-purple-100 dark:border-purple-700 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gradient">Your Tasks</CardTitle>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-purple-200 focus:border-purple-400 dark:border-purple-700"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {(['all', 'todo', 'in-progress', 'completed'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={statusFilter === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className={statusFilter === status 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                          : "border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400"
                        }
                      >
                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        {searchQuery || statusFilter !== 'all' ? 'No tasks found' : 'No tasks yet'}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {searchQuery || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filters' 
                          : 'Create your first task to get started on your productive journey'
                        }
                      </p>
                      {!searchQuery && statusFilter === 'all' && (
                        <Button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Task
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <TaskCard
                          task={task}
                          onUpdate={handleUpdateTask}
                          onDelete={handleDeleteTask}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-purple-100 dark:border-purple-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gradient">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/50"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">You're doing great! 🎉</h3>
                <p className="text-purple-100 text-sm mb-4">
                  You've completed {completedTasks} tasks. Keep up the momentum!
                </p>
                <div className="bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-purple-100 text-xs">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% Complete
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default Dashboard;
