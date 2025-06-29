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
import { ShareTaskModal } from "@/components/ShareTaskModal";
import { TaskPagination } from "@/components/TaskPagination";
import { TaskSortingControls } from "@/components/TaskSortingControls";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTasks } from "@/hooks/useTasks";

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
  const { 
    tasks, 
    loading, 
    currentPage, 
    totalPages, 
    filters, 
    createTask, 
    updateTask, 
    deleteTask, 
    applyFilters, 
    goToPage 
  } = useTasks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTaskForShare, setSelectedTaskForShare] = useState<Task | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState({
    priority: 'all' as 'all' | 'low' | 'medium' | 'high',
    dateRange: null as { from: Date; to: Date } | null,
    progress: 'all' as 'all' | 'todo' | 'in-progress' | 'completed'
  });

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
    createTask(taskData);
    setIsCreateModalOpen(false);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleShareTask = (task: Task) => {
    setSelectedTaskForShare(task);
    setIsShareModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleApplyAdvancedFilters = (filters: typeof advancedFilters) => {
    setAdvancedFilters(filters);
    setIsAdvancedFiltersOpen(false);
  };

  const handleSearch = () => {
    applyFilters({
      ...filters,
      search: searchQuery,
      status: statusFilter !== 'all' ? statusFilter : undefined
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    applyFilters({
      ...filters,
      sortBy: sortBy as any,
      sortOrder
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OfflineIndicator />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">TaskSpace</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {completedTasks}/{totalTasks} completed
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsProfileModalOpen(true)}
                className="border-gray-300 dark:border-gray-600 hidden sm:flex"
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
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm">Total Tasks</p>
                    <p className="text-2xl sm:text-3xl font-bold">{totalTasks}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-100" />
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
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-xs sm:text-sm">In Progress</p>
                    <p className="text-2xl sm:text-3xl font-bold">{inProgressTasks}</p>
                  </div>
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-100" />
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
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs sm:text-sm">Completed</p>
                    <p className="text-2xl sm:text-3xl font-bold">{completedTasks}</p>
                  </div>
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-green-100" />
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
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-xs sm:text-sm">Completion Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
                  </div>
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-gray-100" />
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Your Tasks</CardTitle>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10 border-gray-300 focus:border-blue-500 dark:border-gray-600"
                      />
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto">
                      {(['all', 'todo', 'in-progress', 'completed'] as const).map((status) => (
                        <Button
                          key={status}
                          variant={statusFilter === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => setStatusFilter(status)}
                          className={`whitespace-nowrap ${statusFilter === status 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Sorting and Advanced Filters */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TaskSortingControls
                      sortBy={filters.sortBy || 'created_at'}
                      sortOrder={filters.sortOrder || 'desc'}
                      onSortChange={handleSortChange}
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAdvancedFiltersOpen(true)}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading tasks...</p>
                    </div>
                  ) : filteredTasks.length === 0 ? (
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
                    <>
                      {filteredTasks.map((task, index) => (
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
                            onShare={handleShareTask}
                          />
                        </motion.div>
                      ))}
                      
                      <TaskPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                      />
                    </>
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 sm:hidden"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
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
          console.log('Selected date:', date);
        }}
      />

      <AdvancedFiltersModal
        isOpen={isAdvancedFiltersOpen}
        onClose={() => setIsAdvancedFiltersOpen(false)}
        onApplyFilters={handleApplyAdvancedFilters}
        currentFilters={advancedFilters}
      />

      <ShareTaskModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        task={selectedTaskForShare}
      />
    </div>
  );
};

export default Dashboard;