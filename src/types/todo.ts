export type Priority = 'low' | 'medium' | 'high';

export type Category = '전체' | '업무' | '공부' | '일상' | '건강' | '프로젝트' | '기타';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  subtasks: SubTask[];
  pinned: boolean;
  createdAt: string;
  completedAt?: string;
}

export type FilterStatus = 'all' | 'today' | 'upcoming' | 'completed' | 'starred';
export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';

export interface PresetTemplate {
  id: string;
  title: string;
  category: Category;
  description: string;
  icon: string;
  tasks: {
    title: string;
    priority: Priority;
    estimatedDays: number;
    subtasks?: string[];
  }[];
}
