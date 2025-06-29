
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Calendar as CalendarIcon, Flag, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    priority: 'all' | 'low' | 'medium' | 'high';
    dateRange: { from: Date; to: Date } | null;
    progress: 'all' | 'todo' | 'in-progress' | 'completed';
  }) => void;
  currentFilters: {
    priority: 'all' | 'low' | 'medium' | 'high';
    dateRange: { from: Date; to: Date } | null;
    progress: 'all' | 'todo' | 'in-progress' | 'completed';
  };
}

export const AdvancedFiltersModal = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}: AdvancedFiltersModalProps) => {
  const [priority, setPriority] = useState(currentFilters.priority);
  const [progress, setProgress] = useState(currentFilters.progress);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(currentFilters.dateRange);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(currentFilters.dateRange?.from);
  const [dateTo, setDateTo] = useState<Date | undefined>(currentFilters.dateRange?.to);

  const handleApply = () => {
    const finalDateRange = dateFrom && dateTo ? { from: dateFrom, to: dateTo } : null;
    onApplyFilters({
      priority,
      dateRange: finalDateRange,
      progress
    });
  };

  const handleReset = () => {
    setPriority('all');
    setProgress('all');
    setDateRange(null);
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = priority !== 'all' || progress !== 'all' || dateRange !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Priority Filter */}
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label htmlFor="priority" className="text-sm font-medium flex items-center space-x-2">
                  <Flag className="h-4 w-4" />
                  <span>Priority Level</span>
                </Label>
                <Select value={priority} onValueChange={(value: 'all' | 'low' | 'medium' | 'high') => setPriority(value)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Progress Filter */}
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label htmlFor="progress" className="text-sm font-medium flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Task Status</span>
                </Label>
                <Select value={progress} onValueChange={(value: 'all' | 'todo' | 'in-progress' | 'completed') => setProgress(value)}>
                  <SelectTrigger id="progress">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Date Range Filter */}
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Date Range</span>
                </Label>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom" className="text-xs text-gray-600 dark:text-gray-400">From Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="dateFrom"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateTo" className="text-xs text-gray-600 dark:text-gray-400">To Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="dateTo"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "MMM dd") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {dateFrom && dateTo && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Range: {format(dateFrom, "MMM dd, yyyy")} - {format(dateTo, "MMM dd, yyyy")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Active Filters:</h4>
                <div className="space-y-1 text-xs text-blue-700 dark:text-blue-200">
                  {priority !== 'all' && <div>• Priority: {priority}</div>}
                  {progress !== 'all' && <div>• Status: {progress.replace('-', ' ')}</div>}
                  {dateFrom && dateTo && (
                    <div>• Date: {format(dateFrom, "MMM dd")} - {format(dateTo, "MMM dd")}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between space-x-3">
            <Button variant="outline" onClick={handleReset}>
              Reset All
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700 text-white">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
