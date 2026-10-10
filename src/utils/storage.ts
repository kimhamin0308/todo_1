import { Todo } from '../types/todo';

const STORAGE_KEY = 'taskcraft_todos_v1';
const STREAK_KEY = 'taskcraft_streak_v1';

export const initialTodos: Todo[] = [
  {
    id: 'demo-1',
    title: '🚀 TaskCraft 환영합니다! 첫 번째 할 일 완료해보기',
    description: '체크박스를 클릭하여 작업을 완료해보세요. 신나는 축하 효과가 나타납니다!',
    completed: false,
    priority: 'high',
    category: '일상',
    dueDate: new Date().toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-1', title: '체크박스 클릭해보기', completed: false },
      { id: 'sub-2', title: '스마트 AI 생성기로 맞춤 계획 만들어보기', completed: false },
    ],
    pinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: '🤖 상단의 [AI 맞춤 할 일 생성] 버튼 사용해보기',
    description: '여행, 시험공부, 운동, 프로젝트 등 목표만 적으면 세부 할 일과 일정을 자동으로 분해해줍니다.',
    completed: false,
    priority: 'high',
    category: '프로젝트',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    subtasks: [],
    pinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: '💧 매일 물 2L 마시기 & 가벼운 스트레칭',
    description: '건강한 하루를 위한 기초 수분 충전',
    completed: true,
    priority: 'medium',
    category: '건강',
    dueDate: new Date().toISOString().split('T')[0],
    subtasks: [],
    pinned: false,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    title: '📚 기술 서적 또는 관심 분야 아티클 30분 읽기',
    description: '매일 30분씩 꾸준히 역량 강화하기',
    completed: false,
    priority: 'low',
    category: '공부',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    subtasks: [],
    pinned: false,
    createdAt: new Date().toISOString(),
  },
];

export const loadTodos = (): Todo[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return initialTodos;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load todos from localStorage', e);
    return initialTodos;
  }
};

export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error('Failed to save todos to localStorage', e);
  }
};

export interface StreakInfo {
  count: number;
  lastCompletedDate: string;
}

export const loadStreak = (): StreakInfo => {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    if (!data) return { count: 1, lastCompletedDate: new Date().toISOString().split('T')[0] };
    return JSON.parse(data);
  } catch {
    return { count: 1, lastCompletedDate: new Date().toISOString().split('T')[0] };
  }
};

export const updateStreakOnComplete = (): StreakInfo => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const current = loadStreak();

  if (current.lastCompletedDate === today) {
    return current;
  }

  let newCount = current.count;
  if (current.lastCompletedDate === yesterday) {
    newCount += 1;
  } else {
    newCount = 1;
  }

  const updated = { count: newCount, lastCompletedDate: today };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  return updated;
};

export const exportTodosToJson = (todos: Todo[]): void => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(todos, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `taskcraft_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const exportTodosToMarkdown = (todos: Todo[]): string => {
  let md = `# 📋 TaskCraft 할 일 목록 (${new Date().toLocaleDateString('ko-KR')})\n\n`;
  
  const incomplete = todos.filter(t => !t.completed);
  const completed = todos.filter(t => t.completed);

  md += `## ⏳ 진행 중인 할 일 (${incomplete.length})\n`;
  incomplete.forEach(t => {
    md += `- [ ] **${t.title}** [${t.category}] (우선순위: ${t.priority.toUpperCase()}${t.dueDate ? `, 마감: ${t.dueDate}` : ''})\n`;
    if (t.description) md += `  - 설명: ${t.description}\n`;
    t.subtasks.forEach(st => {
      md += `  - [${st.completed ? 'x' : ' '}] ${st.title}\n`;
    });
  });

  md += `\n## ✅ 완료된 할 일 (${completed.length})\n`;
  completed.forEach(t => {
    md += `- [x] ~${t.title}~ [${t.category}]\n`;
  });

  return md;
};
