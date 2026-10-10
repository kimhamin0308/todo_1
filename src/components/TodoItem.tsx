import React, { useState } from 'react';
import { 
  Check, 
  Pin, 
  Trash2, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Priority, SubTask, Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onOpenDetail: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onUpdate,
  onOpenDetail,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!todo.completed) {
      // 폭죽 효과 트리거
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'],
      });
    }
    onToggleComplete(todo.id);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleToggleSubtask = (stId: string) => {
    const updatedSubtasks = todo.subtasks.map((st) =>
      st.id === stId ? { ...st, completed: !st.completed } : st
    );
    onUpdate(todo.id, { subtasks: updatedSubtasks });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub: SubTask = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    onUpdate(todo.id, { subtasks: [...todo.subtasks, newSub] });
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (stId: string) => {
    const updatedSubtasks = todo.subtasks.filter((st) => st.id !== stId);
    onUpdate(todo.id, { subtasks: updatedSubtasks });
  };

  // 마감일 상태 계산
  const getDueStatus = () => {
    if (!todo.dueDate) return null;
    const today = new Date().toISOString().split('T')[0];
    if (todo.dueDate < today) {
      return { label: '지연됨', isOverdue: true };
    }
    if (todo.dueDate === today) {
      return { label: '오늘 마감', isToday: true };
    }
    const diffDays = Math.ceil(
      (new Date(todo.dueDate).getTime() - new Date(today).getTime()) / (1000 * 3600 * 24)
    );
    return { label: `D-${diffDays}`, isUpcoming: true };
  };

  const dueStatus = getDueStatus();

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
            높음
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
            보통
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            낮음
          </span>
        );
    }
  };

  const completedSubtasksCount = todo.subtasks.filter((s) => s.completed).length;

  return (
    <div
      className={`group relative rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-sm hover:shadow-md ${
        todo.pinned
          ? 'border-indigo-300 dark:border-indigo-700/60 shadow-indigo-100/50 dark:shadow-none'
          : 'border-slate-200/90 dark:border-slate-800'
      } ${todo.completed ? 'opacity-70 bg-slate-50/70 dark:bg-slate-900/40' : ''}`}
    >
      <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
        
        {/* 원형 체크박스 */}
        <button
          onClick={handleCheck}
          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer flex-shrink-0 ${
            todo.completed
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
          }`}
        >
          {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* 할 일 본문 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 고정 핀 아이콘 표시 */}
            {todo.pinned && (
              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-0.5">
                <Pin className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400" />
                고정됨
              </span>
            )}
            
            {/* 카테고리 뱃지 */}
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {todo.category}
            </span>

            {/* 우선순위 뱃지 */}
            {getPriorityBadge(todo.priority)}

            {/* 마감일 뱃지 */}
            {dueStatus && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  dueStatus.isOverdue
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200'
                    : dueStatus.isToday
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {dueStatus.label}
              </span>
            )}
          </div>

          {/* 제목 영역 (인라인 편집 가능) */}
          <div className="mt-1.5">
            {isEditingTitle ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                autoFocus
                className="w-full text-base font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg outline-none border border-indigo-500"
              />
            ) : (
              <p
                onClick={() => onOpenDetail(todo)}
                className={`text-base font-semibold tracking-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition ${
                  todo.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-100'
                }`}
              >
                {todo.title}
              </p>
            )}

            {/* 설명 미리보기 */}
            {todo.description && (
              <p
                onClick={() => onOpenDetail(todo)}
                className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 cursor-pointer"
              >
                {todo.description}
              </p>
            )}
          </div>

          {/* 하위 태스크 토글 버튼 */}
          {todo.subtasks.length > 0 && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
              >
                {showSubtasks ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                하위 작업 ({completedSubtasksCount}/{todo.subtasks.length})
              </button>
            </div>
          )}

          {/* 하위 태스크 목록 */}
          {showSubtasks && (
            <div className="mt-2.5 space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
              {todo.subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between text-xs group/sub">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span
                      className={`${
                        st.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st.title}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="opacity-0 group-hover/sub:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* 하위 태스크 간편 추가 */}
              <form onSubmit={handleAddSubtask} className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="하위 작업 추가..."
                  className="text-xs bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 outline-none flex-1 text-slate-700 dark:text-slate-200"
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-600 dark:text-slate-300 text-xs transition disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 액션 버튼들 (고정, 수정, 삭제) */}
        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          {/* 핀 고정 */}
          <button
            onClick={() => onTogglePin(todo.id)}
            title={todo.pinned ? '고정 해제' : '상단 고정'}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer ${
              todo.pinned ? 'text-indigo-600 dark:text-indigo-400' : ''
            }`}
          >
            <Pin className={`w-4 h-4 ${todo.pinned ? 'fill-current' : ''}`} />
          </button>

          {/* 상세 편집 모달 열기 */}
          <button
            onClick={() => onOpenDetail(todo)}
            title="상세 편집"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* 삭제 */}
          <button
            onClick={() => onDelete(todo.id)}
            title="삭제"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
