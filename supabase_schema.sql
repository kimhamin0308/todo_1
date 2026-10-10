-- Supabase SQL Editor에 복사하여 실행하세요.

-- 1. todos 테이블 생성
CREATE TABLE IF NOT EXISTS public.todos (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT '일상',
  due_date TEXT,
  subtasks JSONB DEFAULT '[]'::jsonb,
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 3. 본인 데이터만 CRUD 가능하도록 정책 설정
CREATE POLICY "Users can view own todos" 
ON public.todos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos" 
ON public.todos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" 
ON public.todos FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" 
ON public.todos FOR DELETE 
USING (auth.uid() = user_id);

-- 4. 실시간 동기화(Realtime) 활성화 (선택)
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
