import React, { useRef } from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  FileText, 
  RotateCcw,
  CheckCircle2,
  Database
} from 'lucide-react';
import { Todo } from '../types/todo';
import { exportTodosToJson, exportTodosToMarkdown } from '../utils/storage';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenAiPlanner: () => void;
  onOpenSupabaseModal: () => void;
  isCloudConnected: boolean;
  todos: Todo[];
  onImportTodos: (todos: Todo[]) => void;
  onResetTodos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenAiPlanner,
  onOpenSupabaseModal,
  isCloudConnected,
  todos,
  onImportTodos,
  onResetTodos,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());

  const handleCopyMarkdown = () => {
    const md = exportTodosToMarkdown(todos);
    navigator.clipboard.writeText(md);
    alert('📋 마크다운 형식으로 클립보드에 복사되었습니다! 노션이나 메모장에 붙여넣으세요.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImportTodos(imported);
          alert('✅ 데이터를 성공적으로 불러왔습니다!');
        } else {
          alert('❌ 올바르지 않은 JSON 파일 형식입니다.');
        }
      } catch {
        alert('❌ 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* 로고 & 날짜 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/20">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-100 dark:to-slate-200 bg-clip-text text-transparent">
                TaskCraft
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {todayStr}
            </p>
          </div>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Supabase 클라우드 동기화 버튼 */}
          <button
            onClick={onOpenSupabaseModal}
            title={isCloudConnected ? 'Supabase 클라우드 연결됨' : 'Supabase 클라우드 DB 연동하기'}
            className={`inline-flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer ${
              isCloudConnected
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            <Database className={`w-4 h-4 ${isCloudConnected ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden md:inline">
              {isCloudConnected ? '클라우드 동기화 중' : 'Supabase 연동'}
            </span>
          </button>

          {/* AI 할 일 생성기 버튼 */}
          <button
            onClick={onOpenAiPlanner}
            className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden xs:inline">AI 할 일 생성기</span>
            <span className="xs:hidden">AI 생성</span>
          </button>

          {/* 더보기 / 도구 아이콘 버튼들 */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={handleCopyMarkdown}
              title="마크다운으로 복사"
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => exportTodosToJson(todos)}
              title="JSON 백업 다운로드"
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="JSON 파일 가져오기"
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={onResetTodos}
              title="기본 샘플 데이터로 복원"
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* 다크모드 토글 */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            aria-label="테마 전환"
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
