import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCheck, 
  Sparkles, 
  Inbox,
  CalendarDays,
  ListTodo,
  Star
} from 'lucide-react';
import { Category, FilterStatus, SortOption, Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onOpenDetail: (todo: Todo) => void;
  onOpenAiPlanner: () => void;
  onClearCompleted: () => void;
}

const CATEGORIES: Category[] = ['전체', '업무', '공부', '일상', '건강', '프로젝트', '기타'];

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onUpdate,
  onOpenDetail,
  onOpenAiPlanner,
  onClearCompleted,
}) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. 필터링 로직
  const filteredTodos = todos.filter((todo) => {
    // 상태 필터
    if (filterStatus === 'today') {
      if (todo.dueDate !== todayStr) return false;
    } else if (filterStatus === 'upcoming') {
      if (!todo.dueDate || todo.dueDate <= todayStr) return false;
    } else if (filterStatus === 'completed') {
      if (!todo.completed) return false;
    } else if (filterStatus === 'starred') {
      if (!todo.pinned && todo.priority !== 'high') return false;
    }

    // 카테고리 필터
    if (selectedCategory !== '전체' && todo.category !== selectedCategory) {
      return false;
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = todo.title.toLowerCase().includes(q);
      const matchDesc = todo.description?.toLowerCase().includes(q);
      const matchSub = todo.subtasks.some((s) => s.title.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSub) return false;
    }

    return true;
  });

  // 2. 정렬 로직 (고정된 핀은 항상 최상단 유지)
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }

    if (sortOption === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }

    if (sortOption === 'priority') {
      const weight = { high: 3, medium: 2, low: 1 };
      return weight[b.priority] - weight[a.priority];
    }

    if (sortOption === 'title') {
      return a.title.localeCompare(b.title, 'ko-KR');
    }

    // 기본: createdAt 최신순
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-4">
      {/* 검색 & 정렬 바 */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* 검색 인풋 */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="할 일, 메모, 하위 작업 검색..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-indigo-500 transition shadow-sm"
          />
        </div>

        {/* 정렬 드롭다운 & 완료 비우기 */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="createdAt" className="dark:bg-slate-900">최신 등록순</option>
              <option value="dueDate" className="dark:bg-slate-900">마감일순</option>
              <option value="priority" className="dark:bg-slate-900">우선순위순</option>
              <option value="title" className="dark:bg-slate-900">가나다순</option>
            </select>
          </div>

          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200 transition cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>완료 정리</span>
            </button>
          )}
        </div>
      </div>

      {/* 상태 필터 탭 바 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: '전체', count: todos.length, icon: ListTodo },
          { key: 'today', label: '오늘 마감', count: todos.filter(t => t.dueDate === todayStr).length, icon: CalendarDays },
          { key: 'upcoming', label: '예정', count: todos.filter(t => t.dueDate && t.dueDate > todayStr).length, icon: CalendarDays },
          { key: 'starred', label: '중요/고정', count: todos.filter(t => t.pinned || t.priority === 'high').length, icon: Star },
          { key: 'completed', label: '완료됨', count: completedCount, icon: CheckCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = filterStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key as FilterStatus)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive
                  ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 카테고리 칩 필터 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const isCatActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                isCatActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 할 일 리스트 렌더링 */}
      <div className="space-y-2.5 pt-2">
        {sortedTodos.length > 0 ? (
          sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onOpenDetail={onOpenDetail}
            />
          ))
        ) : (
          /* 빈 화면 (Empty State) */
          <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              표시할 할 일이 없습니다
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              새로운 할 일을 추가하거나, AI 플래너를 사용해 단계별 실행 계획을 자동으로 생성해보세요!
            </p>
            <div className="mt-4">
              <button
                onClick={onOpenAiPlanner}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI로 할 일 생성하기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
