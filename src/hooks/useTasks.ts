import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface TaskFilters {
  search?: string;
  status?: 'all' | 'todo' | 'in-progress' | 'completed';
  priority?: 'all' | 'low' | 'medium' | 'high';
  sortBy?: 'created_at' | 'title' | 'due_date' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<TaskFilters>({
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const { toast } = useToast();
  const ITEMS_PER_PAGE = 10;

  const fetchTasks = useCallback(async (page = 1, taskFilters = filters) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Apply filters
      if (taskFilters.status && taskFilters.status !== 'all') {
        query = query.eq('status', taskFilters.status);
      }

      if (taskFilters.priority && taskFilters.priority !== 'all') {
        query = query.eq('priority', taskFilters.priority);
      }

      if (taskFilters.search) {
        query = query.or(`title.ilike.%${taskFilters.search}%,description.ilike.%${taskFilters.search}%`);
      }

      // Apply sorting
      const sortColumn = taskFilters.sortBy || 'created_at';
      const ascending = taskFilters.sortOrder === 'asc';
      query = query.order(sortColumn, { ascending });

      // Apply pagination
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const formattedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status as 'todo' | 'in-progress' | 'completed',
        priority: task.priority as 'low' | 'medium' | 'high',
        dueDate: task.due_date || undefined,
        createdAt: task.created_at
      }));

      setTasks(formattedTasks);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully"
      });

      // Refresh tasks to maintain pagination
      fetchTasks(currentPage, filters);
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          due_date: updates.dueDate || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));

      toast({
        title: "Success",
        description: "Task updated successfully"
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task deleted successfully"
      });

      // Refresh tasks to maintain pagination
      fetchTasks(currentPage, filters);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const applyFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    fetchTasks(1, newFilters);
  };

  const goToPage = (page: number) => {
    fetchTasks(page, filters);
  };

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Refresh tasks when changes occur
          fetchTasks(currentPage, filters);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage, filters, fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    currentPage,
    totalPages,
    filters,
    createTask,
    updateTask,
    deleteTask,
    applyFilters,
    goToPage,
    refetch: () => fetchTasks(currentPage, filters)
  };
};