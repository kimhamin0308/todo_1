import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Key, 
  Globe, 
  Check, 
  AlertCircle, 
  Lock, 
  Mail, 
  User, 
  LogOut, 
  UploadCloud,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { getSupabase, getSupabaseConfig, saveSupabaseConfig } from '../lib/supabase';
import { todoService } from '../services/todoService';
import { Todo } from '../types/todo';

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  todos: Todo[];
  onRefreshCloudTodos: () => void;
}

export const SupabaseAuthModal: React.FC<SupabaseAuthModalProps> = ({
  isOpen,
  onClose,
  todos,
  onRefreshCloudTodos,
}) => {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [inputUrl, setInputUrl] = useState(config.url);
  const [inputKey, setInputKey] = useState(config.anonKey);
  const [activeTab, setActiveTab] = useState<'auth' | 'config'>('auth');

  // 인증 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkUser();
    }
  }, [isOpen]);

  const checkUser = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setActiveTab('config');
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    setCurrentUser(session?.user || null);
    if (!session?.user) {
      setActiveTab('auth');
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !inputKey.trim()) {
      setMessage({ type: 'error', text: 'Supabase URL과 Anon Key를 모두 입력해주세요.' });
      return;
    }

    saveSupabaseConfig(inputUrl.trim(), inputKey.trim());
    const updated = getSupabaseConfig();
    setConfig(updated);
    setMessage({ type: 'success', text: 'Supabase 연동 정보가 성공적으로 저장되었습니다!' });
    checkUser();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase 설정(URL/Key)을 먼저 완료해주세요.' });
      setActiveTab('config');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: data.session ? '회원가입 및 로그인이 완료되었습니다!' : '인증 메일이 발송되었습니다. 이메일을 확인해주세요.',
        });
        if (data.session) {
          setCurrentUser(data.session.user);
          onRefreshCloudTodos();
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        setMessage({ type: 'success', text: '로그인에 성공했습니다!' });
        setCurrentUser(data.user);
        onRefreshCloudTodos();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '인증 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setMessage({ type: 'success', text: '로그아웃되었습니다.' });
    }
  };

  const handleSyncToCloud = async () => {
    try {
      setLoading(true);
      await todoService.syncLocalTodosToCloud(todos);
      setMessage({ type: 'success', text: '로컬 할 일들이 Supabase 클라우드로 안전하게 업로드되었습니다!' });
      onRefreshCloudTodos();
    } catch (e: any) {
      setMessage({ type: 'error', text: '동기화 실패: ' + (e.message || '테이블 설정을 확인해주세요.') });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Database className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Supabase 클라우드 DB 연동</h3>
              <p className="text-xs text-emerald-100">
                어디서든 동기화되는 실시간 클라우드 데이터베이스
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

        {/* 탭 전환 */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('auth')}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              activeTab === 'auth'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {currentUser ? '내 계정 & 동기화' : '로그인 / 회원가입'}
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              activeTab === 'config'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Supabase API 키 설정
          </button>
        </div>

        {/* 알림 메시지 */}
        {message && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* 본문 영역 */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'auth' ? (
            currentUser ? (
              /* 로그인 상태 UI */
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    로그인되었습니다
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {currentUser.email}
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleSyncToCloud}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    <span>내 로컬 할 일 ({todos.length}개) 클라우드와 동기화</span>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            ) : (
              /* 미로그인 상태: 로그인/회원가입 폼 */
              <form onSubmit={handleAuth} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    이메일 주소
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="6자리 이상 비밀번호"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  {loading ? '처리 중...' : isSignUp ? '회원가입하고 시작하기' : '로그인'}
                </button>

                <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                  {isSignUp ? '이미 계정이 있으신가요?' : '아직 계정이 없으신가요?'}{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    {isSignUp ? '로그인하기' : '회원가입하기'}
                  </button>
                </p>
              </form>
            )
          ) : (
            /* Supabase URL & Key 설정 폼 */
            <form onSubmit={handleSaveConfig} className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
                <p className="font-semibold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> Supabase 프로젝트 연결 안내
                </p>
                <p className="leading-relaxed">
                  Supabase 대시보드 &gt; <strong>Project Settings &gt; Data API</strong>에서 URL과 <code>anon public</code> 키를 복사해 입력하세요.
                </p>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline mt-1"
                >
                  <span>Supabase 대시보드 바로가기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Project URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Anon Public Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  설정 저장 및 연결하기
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 푸터 */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
