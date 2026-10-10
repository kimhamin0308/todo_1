import { getSupabase } from '../lib/supabase';
import { Todo } from '../types/todo';

export const todoService = {
  // 클라우드에서 할 일 목록 가져오기
  async fetchTodos(): Promise<Todo[] | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos from Supabase:', error);
      throw error;
    }

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      priority: row.priority,
      category: row.category,
      dueDate: row.due_date,
      subtasks: row.subtasks || [],
      pinned: row.pinned,
      createdAt: row.created_at,
      completedAt: row.completed_at,
    }));
  },

  // 할 일 추가
  async addTodo(todo: Todo): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase.from('todos').insert({
      id: todo.id,
      user_id: session.user.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      priority: todo.priority,
      category: todo.category,
      due_date: todo.dueDate,
      subtasks: todo.subtasks,
      pinned: todo.pinned,
      created_at: todo.createdAt,
      completed_at: todo.completedAt,
    });

    if (error) {
      console.error('Error inserting todo to Supabase:', error);
      throw error;
    }
  },

  // 할 일 수정
  async updateTodo(id: string, updates: Partial<Todo>): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const dbPayload: Record<string, any> = {};
    if (updates.title !== undefined) dbPayload.title = updates.title;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.completed !== undefined) dbPayload.completed = updates.completed;
    if (updates.priority !== undefined) dbPayload.priority = updates.priority;
    if (updates.category !== undefined) dbPayload.category = updates.category;
    if (updates.dueDate !== undefined) dbPayload.due_date = updates.dueDate;
    if (updates.subtasks !== undefined) dbPayload.subtasks = updates.subtasks;
    if (updates.pinned !== undefined) dbPayload.pinned = updates.pinned;
    if (updates.completedAt !== undefined) dbPayload.completed_at = updates.completedAt;

    const { error } = await supabase
      .from('todos')
      .update(dbPayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating todo in Supabase:', error);
      throw error;
    }
  },

  // 할 일 삭제
  async deleteTodo(id: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo from Supabase:', error);
      throw error;
    }
  },

  // 로컬 데이터를 Supabase로 일괄 업로드(동기화)
  async syncLocalTodosToCloud(localTodos: Todo[]): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const rows = localTodos.map((todo) => ({
      id: todo.id,
      user_id: session.user.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      priority: todo.priority,
      category: todo.category,
      due_date: todo.dueDate,
      subtasks: todo.subtasks,
      pinned: todo.pinned,
      created_at: todo.createdAt,
      completed_at: todo.completedAt,
    }));

    const { error } = await supabase.from('todos').upsert(rows);
    if (error) {
      console.error('Error syncing todos to Supabase:', error);
      throw error;
    }
  },
};
