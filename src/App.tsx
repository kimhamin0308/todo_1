import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { AiPlannerModal } from './components/AiPlannerModal';
import { TodoDetailModal } from './components/TodoDetailModal';
import { SupabaseAuthModal } from './components/SupabaseAuthModal';
import { Todo } from './types/todo';
import { 
  loadTodos, 
  saveTodos, 
  initialTodos, 
  loadStreak, 
  updateStreakOnComplete,
  StreakInfo 
} from './utils/storage';
import { getSupabase } from './lib/supabase';
import { todoService } from './services/todoService';
import { Heart } from 'lucide-react';

export function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [streak, setStreak] = useState<StreakInfo>(() => loadStreak());
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [selectedTodoForDetail, setSelectedTodoForDetail] = useState<Todo | null>(null);

  // 다크모드 관리
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskcraft_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taskcraft_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taskcraft_theme', 'light');
    }
  }, [darkMode]);

  // todos 변경 시 LocalStorage 영구 보존
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Supabase 세션 및 클라우드 데이터 로드
  const loadCloudTodos = async () => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        setIsCloudConnected(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsCloudConnected(true);
        const cloudData = await todoService.fetchTodos();
        if (cloudData && cloudData.length > 0) {
          setTodos(cloudData);
        }
      } else {
        setIsCloudConnected(false);
      }
    } catch (e) {
      console.warn('Could not fetch cloud todos:', e);
      setIsCloudConnected(false);
    }
  };

  useEffect(() => {
    loadCloudTodos();
  }, []);

  // 1. 단일 할 일 추가
  const handleAddTodo = (newTodoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...newTodoData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);

    // 클라우드 동기화 (백그라운드)
    todoService.addTodo(newTodo).catch((err) => console.warn('Supabase sync error', err));
  };

  // 2. AI 생성 다중 할 일 추가
  const handleAddGeneratedTodos = (generatedTodos: Omit<Todo, 'id' | 'createdAt'>[]) => {
    const newTodos: Todo[] = generatedTodos.map((item, idx) => ({
      ...item,
      id: `ai-task-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    }));
    setTodos((prev) => [...newTodos, ...prev]);

    // 클라우드 동기화
    newTodos.forEach((todo) => {
      todoService.addTodo(todo).catch((err) => console.warn('Supabase sync error', err));
    });
  };

  // 3. 완료 상태 토글
  const handleToggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const nextCompleted = !todo.completed;
          if (nextCompleted) {
            const updatedStreak = updateStreakOnComplete();
            setStreak(updatedStreak);
          }
          const updated = {
            ...todo,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
          todoService.updateTodo(id, { 
            completed: nextCompleted, 
            completedAt: updated.completedAt 
          }).catch((err) => console.warn('Supabase sync error', err));
          return updated;
        }
        return todo;
      })
    );
  };

  // 4. 고정 토글
  const handleTogglePin = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const updated = { ...todo, pinned: !todo.pinned };
          todoService.updateTodo(id, { pinned: updated.pinned }).catch((err) => console.warn(err));
          return updated;
        }
        return todo;
      })
    );
  };

  // 5. 삭제
  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    todoService.deleteTodo(id).catch((err) => console.warn('Supabase sync error', err));
  };

  // 6. 업데이트 (인라인 / 상세 모달)
  const handleUpdate = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
    todoService.updateTodo(id, updates).catch((err) => console.warn('Supabase sync error', err));
  };

  // 7. 완료된 항목 일괄 삭제
  const handleClearCompleted = () => {
    if (confirm('완료된 모든 항목을 삭제하시겠습니까?')) {
      const completedTodos = todos.filter((t) => t.completed);
      setTodos((prev) => prev.filter((todo) => !todo.completed));
      completedTodos.forEach((t) => {
        todoService.deleteTodo(t.id).catch((err) => console.warn(err));
      });
    }
  };

  // 8. 데이터 불러오기 및 리셋
  const handleImportTodos = (imported: Todo[]) => {
    setTodos(imported);
  };

  const handleResetTodos = () => {
    if (confirm('기본 샘플 데이터로 복원하시겠습니까? 현재 작성된 데이터는 덮어씌워집니다.')) {
      setTodos(initialTodos);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 고정 헤더 */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAiPlanner={() => setIsAiModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isCloudConnected={isCloudConnected}
        todos={todos}
        onImportTodos={handleImportTodos}
        onResetTodos={handleResetTodos}
      />

      {/* 메인 컨테이너 */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* 생산성 지표 & 달성률 배너 */}
        <StatsCard todos={todos} streak={streak} />

        {/* 할 일 입력 바 */}
        <TodoInput onAddTodo={handleAddTodo} />

        {/* 메인 할 일 리스트 (필터, 정렬, 검색 포함) */}
        <TodoList
          todos={todos}
          onToggleComplete={handleToggleComplete}
          onTogglePin={handleTogglePin}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onOpenDetail={(todo) => setSelectedTodoForDetail(todo)}
          onOpenAiPlanner={() => setIsAiModalOpen(true)}
          onClearCompleted={handleClearCompleted}
        />

      </main>

      {/* 푸터 */}
      <footer className="py-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="flex items-center justify-center gap-1 font-medium">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>by TaskCraft • 스마트 AI To-Do 플래너</span>
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          로컬 스토리지 및 Supabase 클라우드 하이브리드 동기화 지원
        </p>
      </footer>

      {/* 스마트 AI 생성 모달 */}
      <AiPlannerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddGeneratedTodos={handleAddGeneratedTodos}
      />

      {/* Supabase 클라우드 인증 및 설정 모달 */}
      <SupabaseAuthModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        todos={todos}
        onRefreshCloudTodos={loadCloudTodos}
      />

      {/* 할 일 상세 편집 모달 */}
      <TodoDetailModal
        todo={selectedTodoForDetail}
        isOpen={Boolean(selectedTodoForDetail)}
        onClose={() => setSelectedTodoForDetail(null)}
        onSave={handleUpdate}
        onDelete={handleDelete}
      />

    </div>
  );
}

export default App;
