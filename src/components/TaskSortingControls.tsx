import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface TaskSortingControlsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const TaskSortingControls = ({ sortBy, sortOrder, onSortChange }: TaskSortingControlsProps) => {
  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' }
  ];

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={sortBy} onValueChange={(value) => onSortChange(value, sortOrder)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleSortOrder}
        className="px-3"
      >
        {sortOrder === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};