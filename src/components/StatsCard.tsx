import React from 'react';
import { Flame, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Todo } from '../types/todo';
import { StreakInfo } from '../utils/storage';

interface StatsCardProps {
  todos: Todo[];
  streak: StreakInfo;
}

export const StatsCard: React.FC<StatsCardProps> = ({ todos, streak }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const remaining = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  // 오늘 마감인데 아직 미완료된 항목 수
  const todayStr = new Date().toISOString().split('T')[0];
  const urgentCount = todos.filter(
    (t) => !t.completed && (t.dueDate === todayStr || (t.dueDate && t.dueDate < todayStr))
  ).length;

  const getCheerMessage = () => {
    if (total === 0) return '새로운 할 일을 추가하거나 AI 생성기로 계획을 세워보세요!';
    if (percent === 100) return '🎉 대단해요! 오늘의 모든 할 일을 완료했습니다!';
    if (percent >= 70) return '🔥 거의 다 왔어요! 조금만 더 힘내세요!';
    if (percent >= 40) return '💪 순조롭게 진행 중입니다. 집중을 유지해보세요!';
    return '🌱 작은 첫 걸음부터 시작해보세요. 한 걸음씩 나아가면 됩니다!';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. 진행률 메인 카드 */}
      <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-indigo-50 border border-white/20">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                {streak.count}일 연속 달성 중!
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-2.5">
                오늘의 성취율 <span className="text-amber-300">{percent}%</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold tracking-tight">
                {completed}
                <span className="text-indigo-200 text-lg font-medium">/{total}</span>
              </span>
              <p className="text-xs text-indigo-100/80">완료된 태스크</p>
            </div>
          </div>

          <div>
            {/* 프로그레스 바 */}
            <div className="w-full bg-white/20 backdrop-blur-md rounded-full h-3 overflow-hidden p-0.5 border border-white/15">
              <div
                className="bg-gradient-to-r from-amber-300 to-emerald-300 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-3">
              {getCheerMessage()}
            </p>
          </div>
        </div>

        {/* 배경 은은한 데코 원 */}
        <div className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />
      </div>

      {/* 2. 세부 지표 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4">
        {/* 남은 할 일 */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">진행 중</p>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {remaining} <span className="text-xs font-normal text-slate-400">개</span>
              </h3>
            </div>
          </div>
        </div>

        {/* 오늘 마감 / 지연 알림 */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">마감 임박</p>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {urgentCount} <span className="text-xs font-normal text-slate-400">개</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
