import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Loader2, 
  BookOpen, 
  Briefcase, 
  Smile, 
  Compass, 
  Cpu 
} from 'lucide-react';
import { PRESET_TEMPLATES, generateSmartTasks, convertGeneratedPlanToTodos } from '../utils/aiGenerator';
import { PresetTemplate, Todo } from '../types/todo';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGeneratedTodos: (todos: Omit<Todo, 'id' | 'createdAt'>[]) => void;
}

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({
  isOpen,
  onClose,
  onAddGeneratedTodos,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<ReturnType<typeof generateSmartTasks> | null>(null);
  const [selectedTaskIndices, setSelectedTaskIndices] = useState<number[]>([]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: PresetTemplate) => {
    setIsLoading(true);
    setTimeout(() => {
      const generated = generateSmartTasks(preset.title);
      setGeneratedResult(generated);
      setSelectedTaskIndices(generated.tasks.map((_, i) => i));
      setIsLoading(false);
    }, 400);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const generated = generateSmartTasks(prompt);
      setGeneratedResult(generated);
      setSelectedTaskIndices(generated.tasks.map((_, i) => i));
      setIsLoading(false);
    }, 600);
  };

  const toggleTaskSelection = (index: number) => {
    setSelectedTaskIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleSelectAll = () => {
    if (!generatedResult) return;
    if (selectedTaskIndices.length === generatedResult.tasks.length) {
      setSelectedTaskIndices([]);
    } else {
      setSelectedTaskIndices(generatedResult.tasks.map((_, i) => i));
    }
  };

  const handleAddSelectedToTodos = () => {
    if (!generatedResult) return;
    const allConverted = convertGeneratedPlanToTodos(generatedResult);
    const filtered = allConverted.filter((_, idx) => selectedTaskIndices.includes(idx));
    
    if (filtered.length === 0) {
      alert('추가할 할 일을 최소 1개 이상 선택해주세요.');
      return;
    }

    onAddGeneratedTodos(filtered);
    onClose();
    setGeneratedResult(null);
    setPrompt('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">스마트 AI 할 일 생성기</h3>
              <p className="text-xs text-indigo-100">
                목표를 입력하면 실행 가능한 단계별 To-Do를 자동으로 분해해드립니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 (스크롤) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* 1. 목표 입력 폼 */}
          <form onSubmit={handleGenerate} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>어떤 목표나 프로젝트를 계획하고 싶으신가요?</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: 3박 4일 일본 여행, 토익 850점 달성, 유튜브 채널 개설 등..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer flex-shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>AI 생성</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 2. 인기 추천 프리셋 템플릿 라이브러리 */}
          {!generatedResult && (
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                인기 플랜 템플릿 원클릭 시작
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_TEMPLATES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 hover:border-indigo-200 dark:hover:border-indigo-800 text-left transition duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {preset.title}
                      </h4>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. 생성된 결과 프리뷰 & 체크리스트 */}
          {generatedResult && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {generatedResult.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    추가할 할 일을 선택해주세요 ({selectedTaskIndices.length}/{generatedResult.tasks.length}개 선택됨)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  {selectedTaskIndices.length === generatedResult.tasks.length ? '전체 해제' : '전체 선택'}
                </button>
              </div>

              {/* 태스크 카드 목록 */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {generatedResult.tasks.map((task, idx) => {
                  const isSelected = selectedTaskIndices.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTaskSelection(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              D+{task.dueDaysOffset}
                            </span>
                            <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {task.title}
                            </h5>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {task.description}
                          </p>

                          {/* 하위 작업 미리보기 */}
                          {task.subtasks.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {task.subtasks.map((st, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                >
                                  • {st}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* 모달 푸터 */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            닫기
          </button>

          {generatedResult && (
            <button
              type="button"
              onClick={handleAddSelectedToTodos}
              disabled={selectedTaskIndices.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>선택한 {selectedTaskIndices.length}개 할 일 추가하기</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
