
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Calendar, CheckCircle, Clock, Star, User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { ProfileModal } from "@/components/ProfileModal";
import { CalendarModal } from "@/components/CalendarModal";
import { AdvancedFiltersModal } from "@/components/AdvancedFiltersModal";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    priority: 'all' as 'all' | 'low' | 'medium' | 'high',
    dateRange: null as { from: Date; to: Date } | null,
    progress: 'all' as 'all' | 'todo' | 'in-progress' | 'completed'
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = advancedFilters.priority === 'all' || task.priority === advancedFilters.priority;
    const matchesProgress = advancedFilters.progress === 'all' || task.status === advancedFilters.progress;
    
    let matchesDateRange = true;
    if (advancedFilters.dateRange && task.dueDate) {
      const taskDate = new Date(task.dueDate);
      matchesDateRange = taskDate >= advancedFilters.dateRange.from && taskDate <= advancedFilters.dateRange.to;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProgress && matchesDateRange;
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleApplyAdvancedFilters = (filters: typeof advancedFilters) => {
    setAdvancedFilters(filters);
    setIsAdvancedFiltersOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">TaskSpace</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {completedTasks}/{totalTasks} completed
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsProfileModalOpen(true)}
                className="border-gray-300 dark:border-gray-600"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="border-gray-300 dark:border-gray-600 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
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
            <Card className="bg-blue-600 text-white border-0 shadow-lg">
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
            <Card className="bg-orange-600 text-white border-0 shadow-lg">
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
            <Card className="bg-green-600 text-white border-0 shadow-lg">
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
            <Card className="bg-gray-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-sm">Completion Rate</p>
                    <p className="text-3xl font-bold">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-gray-100" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-3">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Tasks</CardTitle>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
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
                      className="pl-10 border-gray-300 focus:border-blue-500 dark:border-gray-600"
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
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
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
                      <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        {searchQuery || statusFilter !== 'all' ? 'No tasks found' : 'No tasks yet'}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {searchQuery || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filters' 
                          : 'Create your first task to get started'
                        }
                      </p>
                      {!searchQuery && statusFilter === 'all' && (
                        <Button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
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
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setIsCalendarModalOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setIsAdvancedFiltersOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Progress Overview</h3>
                <p className="text-blue-100 text-sm mb-4">
                  You've completed {completedTasks} out of {totalTasks} tasks.
                </p>
                <div className="bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-blue-100 text-xs">
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

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        tasks={tasks}
        onDateSelect={(date) => {
          // Filter tasks for selected date and show them
          console.log('Selected date:', date);
        }}
      />

      <AdvancedFiltersModal
        isOpen={isAdvancedFiltersOpen}
        onClose={() => setIsAdvancedFiltersOpen(false)}
        onApplyFilters={handleApplyAdvancedFilters}
        currentFilters={advancedFilters}
      />
    </div>
  );
};

export default Dashboard;
