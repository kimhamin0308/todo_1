import React, { useState } from 'react';
import { Plus, Calendar, Tag, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, Priority, Todo } from '../types/todo';

interface TodoInputProps {
  onAddTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

const CATEGORIES: Category[] = ['업무', '공부', '일상', '건강', '프로젝트', '기타'];

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('일상');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      category,
      dueDate: dueDate || undefined,
      subtasks: [],
      pinned: false,
    });

    setTitle('');
    setDescription('');
    // 옵션 유지는 사용 편의상 유지
  };

  const getPriorityBadgeClass = (p: Priority) => {
    switch (p) {
      case 'high':
        return priority === 'high'
          ? 'bg-rose-500 text-white'
          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100';
      case 'medium':
        return priority === 'medium'
          ? 'bg-amber-500 text-white'
          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100';
      case 'low':
        return priority === 'low'
          ? 'bg-emerald-500 text-white'
          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100';
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-sm transition-all focus-within:shadow-md focus-within:border-indigo-500/50"
    >
      {/* 기본 입력 라인 */}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex-shrink-0" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="새로운 할 일을 입력하세요... (Enter 키로 추가)"
          className="flex-1 bg-transparent text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none font-medium"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>추가</span>
        </button>
      </div>

      {/* 확장 옵션 영역 (마감일, 카테고리, 우선순위, 상세설명) */}
      <div className={`pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          
          {/* 마감일 & 카테고리 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 마감일 */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent text-xs outline-none cursor-pointer text-slate-700 dark:text-slate-200"
              />
            </div>

            {/* 카테고리 선택 */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="bg-transparent text-xs outline-none cursor-pointer text-slate-700 dark:text-slate-200"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 우선순위 탭 */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 mr-1 hidden xs:inline">우선순위:</span>
            {(['low', 'medium', 'high'] as Priority[]).map((p) => {
              const label = p === 'high' ? '높음' : p === 'medium' ? '보통' : '낮음';
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${getPriorityBadgeClass(p)}`}
                >
                  {label}
                </button>
              );
            })}
          </div>

        </div>

        {/* 상세 설명 메모 필드 */}
        {isExpanded && (
          <div className="pt-1">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상세 설명이나 메모를 적어보세요 (선택사항)"
              className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none"
            />
          </div>
        )}
      </div>
    </form>
  );
};
