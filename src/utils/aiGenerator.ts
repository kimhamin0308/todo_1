import { Category, Priority, PresetTemplate, Todo } from '../types/todo';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'travel',
    title: '✈️ 해외/국내 여행 완벽 준비',
    category: '일상',
    description: '항공권 예매부터 환전, 필수 준비물 짐싸기까지 한 번에',
    icon: 'Plane',
    tasks: [
      {
        title: '여권 유효기간 확인 (6개월 이상) 및 항공권 예매',
        priority: 'high',
        estimatedDays: 1,
        subtasks: ['e티켓 발권 및 인쇄/캡처', '여권 만료일 확인'],
      },
      {
        title: '숙소 예약 및 체크인 시간 확인',
        priority: 'high',
        estimatedDays: 2,
        subtasks: ['주요 관광지 동선과 숙소 위치 점검', '예약 바우처 저장'],
      },
      {
        title: '현지 통화 환전 및 해외 결제 카드(트래블로그/월렛) 충전',
        priority: 'medium',
        estimatedDays: 3,
        subtasks: ['모바일 환전 신청', '현지 비상용 현금 확보'],
      },
      {
        title: '해외 여행자 보험 가입 및 eSIM / 로밍 신청',
        priority: 'medium',
        estimatedDays: 4,
        subtasks: ['스마트폰 기종 지원 eSIM 구매', '보장 내역 확인'],
      },
      {
        title: '캐리어 짐 싸기 & 필수 상비약 챙기기',
        priority: 'medium',
        estimatedDays: 5,
        subtasks: ['충전기/변압 어댑터', '세면도구 및 여벌 옷', '소화제/진통제'],
      },
    ],
  },
  {
    id: 'study-exam',
    title: '📚 자격증 / 시험 단기 합격 플랜',
    category: '공부',
    description: '출제 경향 파악부터 기출 5개년 오답정리까지',
    icon: 'GraduationCap',
    tasks: [
      {
        title: '시험 범위 파악 및 수험서 1회독 완독하기',
        priority: 'high',
        estimatedDays: 3,
        subtasks: ['목차별 중요도 마킹', '핵심 개념 형광펜 정리'],
      },
      {
        title: '기출문제 최근 3~5개년 풀이 & 빈출 유형 분석',
        priority: 'high',
        estimatedDays: 7,
        subtasks: ['시간 재고 실전처럼 풀기', '점수 기록 및 약점 단원 파악'],
      },
      {
        title: '틀린 문제 오답노트 작성 및 개념 재확인',
        priority: 'high',
        estimatedDays: 10,
        subtasks: ['자주 헷갈리는 공식 암기', '요약본 만들기'],
      },
      {
        title: '실전 모의고사 2회분 풀고 최종 점검',
        priority: 'medium',
        estimatedDays: 12,
        subtasks: ['마킹 연습', '수험표 및 신분증 챙기기'],
      },
    ],
  },
  {
    id: 'web-dev',
    title: '💻 웹 서비스 / 사이드 프로젝트 론칭',
    category: '프로젝트',
    description: '아이디어 구체화부터 MVP 개발 및 배포까지',
    icon: 'Code',
    tasks: [
      {
        title: '아이디어 정의 및 핵심 기능 요구사항(MVP) 도출',
        priority: 'high',
        estimatedDays: 1,
        subtasks: ['사용자 페르소나 정의', '필수 기능 3가지 선정'],
      },
      {
        title: 'UI/UX 와이어프레임 설계 및 기술 스택 선정',
        priority: 'medium',
        estimatedDays: 2,
        subtasks: ['화면 플로우 스케치', 'React / Next.js / Tailwind 결정'],
      },
      {
        title: '프론트엔드 핵심 컴포넌트 & 반응형 UI 구현',
        priority: 'high',
        estimatedDays: 5,
        subtasks: ['상태 관리 구조화', '모바일 반응형 검증'],
      },
      {
        title: '테스트 및 버그 픽스, 성능 최적화',
        priority: 'medium',
        estimatedDays: 7,
        subtasks: ['에러 핸들링 점검', 'Lighthouse 성능 체크'],
      },
      {
        title: 'Vercel 무료 배포 및 도메인 연결 & README 작성',
        priority: 'high',
        estimatedDays: 8,
        subtasks: ['환경 변수 세팅', '소셜 공유 링크 테스트'],
      },
    ],
  },
  {
    id: 'health-diet',
    title: '🏃 4주 건강 습관 & 다이어트 루틴',
    category: '건강',
    description: '식단 조절과 규칙적인 유산소/근력 운동 실천',
    icon: 'Activity',
    tasks: [
      {
        title: '초기 인바디 측정 및 목표 체지방률/몸무게 설정',
        priority: 'high',
        estimatedDays: 1,
        subtasks: ['기상 직후 공복 몸무게 기록', '목표 캘린더 작성'],
      },
      {
        title: '매일 물 2리터 마시기 & 정제 탄수화물/야식 줄이기',
        priority: 'high',
        estimatedDays: 3,
        subtasks: ['탄산음료 대신 보리차/탄산수', '저녁 8시 이후 금식'],
      },
      {
        title: '주 3회 30분 이상 유산소(조깅/인클라인 런닝)',
        priority: 'medium',
        estimatedDays: 7,
        subtasks: ['스마트워치 심박수 체크', '운동 후 폼롤러 스트레칭'],
      },
      {
        title: '주 2회 전신 근력 운동 루틴 (스쿼트, 푸시업, 플랭크)',
        priority: 'medium',
        estimatedDays: 14,
        subtasks: ['세트당 15회 3세트 완수', '단백질 섭취 챙기기'],
      },
    ],
  },
  {
    id: 'moving',
    title: '📦 신규 입주 / 원룸 이사 체크리스트',
    category: '일상',
    description: '이사 전 계약부터 공과금 정산, 전입신고까지 누락 없이',
    icon: 'Home',
    tasks: [
      {
        title: '이사 업체 견적 비교 및 이사 날짜 확정',
        priority: 'high',
        estimatedDays: 7,
        subtasks: ['손 없는 날/사다리차 필요 여부 확인', '버릴 대형 폐기물 스티커 구매'],
      },
      {
        title: '안 쓰는 짐 미리 정리 및 카테고리별 박스 패킹',
        priority: 'medium',
        estimatedDays: 14,
        subtasks: ['깨지기 쉬운 물건 뽁뽁이 포장', '박스 겉면에 내용물 기재'],
      },
      {
        title: '도시가스/관리비/전기요금 정산 및 이전 신청',
        priority: 'high',
        estimatedDays: 20,
        subtasks: ['계량기 사진 촬영', '자동이체 해지'],
      },
      {
        title: '주민센터 방문 또는 정부24 전입신고 및 확정일자 부여',
        priority: 'high',
        estimatedDays: 21,
        subtasks: ['신분증 지참', '등본 발급 확인'],
      },
    ],
  },
  {
    id: 'deep-clean',
    title: '🧹 주말 대청소 & 미니멀 정리정돈',
    category: '일상',
    description: '쾌적한 공간을 만드는 체계적인 구역별 청소',
    icon: 'Sparkles',
    tasks: [
      {
        title: '환기 후 침구류 세탁 및 건조기 돌리기',
        priority: 'medium',
        estimatedDays: 1,
        subtasks: ['베개 커버 교체', '매트리스 청소기 흡입'],
      },
      {
        title: '책상 및 거실 테이블 잡동사니 제자리 정리',
        priority: 'medium',
        estimatedDays: 1,
        subtasks: ['서류/영수증 파쇄', '케이블 선 정리'],
      },
      {
        title: '욕실 락스 소독 & 배수구/거울 물때 제거',
        priority: 'high',
        estimatedDays: 1,
        subtasks: ['타일 곰팡이 제거제 도포', '환풍기 가동'],
      },
      {
        title: '바닥 청소기 흡입 및 물걸레질 마무리',
        priority: 'medium',
        estimatedDays: 1,
        subtasks: ['구석 먼지 닦기', '쓰레기 분리수거 배출'],
      },
    ],
  },
];

/**
 * 지능형 키워드 및 프롬프트 기반 할 일 자동 생성기
 */
export function generateSmartTasks(prompt: string): {
  title: string;
  category: Category;
  tasks: {
    title: string;
    description: string;
    priority: Priority;
    category: Category;
    dueDaysOffset: number;
    subtasks: string[];
  }[];
} {
  const p = prompt.trim().toLowerCase();

  // 1. 여행 관련
  if (p.includes('여행') || p.includes('일본') || p.includes('제주') || p.includes('휴가') || p.includes('캠핑') || p.includes('travel')) {
    return {
      title: `✈️ [${prompt}] 스마트 여행 계획`,
      category: '일상',
      tasks: [
        {
          title: '항공권/교통편 및 숙소 최종 예약 확인',
          description: '교통편 일정과 체크인/체크아웃 시간 및 모바일 바우처 점검',
          priority: 'high',
          category: '일상',
          dueDaysOffset: 1,
          subtasks: ['교통 예약 내역 캡처', '숙소 위치 및 주변 편의시설 확인'],
        },
        {
          title: '여행 필수 준비물 및 캐리어 패킹',
          description: '여권/신분증, 충전기, 보조배터리, 세면도구, 비상약 챙기기',
          priority: 'high',
          category: '일상',
          dueDaysOffset: 2,
          subtasks: ['전자기기 및 멀티어댑터', '상비약(진통제, 소화제)', '현지 날씨 맞춤 의류'],
        },
        {
          title: '현지 통화 환전 / 결제 수단 및 통신(eSIM/로밍) 준비',
          description: '해외 결제 수수료 무료 카드 충전 및 데이터 로밍 설정',
          priority: 'medium',
          category: '일상',
          dueDaysOffset: 3,
          subtasks: ['모바일 환전 수령', 'eSIM 등록 및 활성화 가이드 확인'],
        },
        {
          title: '주요 방문지 맛집/관광 코스 동선 저장 (네이버/구글맵)',
          description: '동선 낭비 없는 하루 일정 계획 및 예약 필수 장소 체크',
          priority: 'medium',
          category: '일상',
          dueDaysOffset: 4,
          subtasks: ['구글 지도 저장 목록 생성', '휴무일 및 운영 시간 확인'],
        },
      ],
    };
  }

  // 2. 공부 / 시험 / 자격증
  if (p.includes('시험') || p.includes('자격증') || p.includes('공부') || p.includes('토익') || p.includes('영어') || p.includes('학습') || p.includes('study')) {
    return {
      title: `📚 [${prompt}] 합격 마스터 플랜`,
      category: '공부',
      tasks: [
        {
          title: '시험 기본 개념 및 핵심 이론 1회독 완독',
          description: '전체 목차 구조화 및 출제 비중 높은 단원 중심 정독',
          priority: 'high',
          category: '공부',
          dueDaysOffset: 3,
          subtasks: ['핵심 키워드 형광펜 표시', '모르는 용어 단어장에 정리'],
        },
        {
          title: '기출문제 풀이 및 취약 파트 분석',
          description: '최근 3개년 출제 문제 풀고 점수대 및 빈출 유형 점검',
          priority: 'high',
          category: '공부',
          dueDaysOffset: 7,
          subtasks: ['시간 재고 실전처럼 풀기', '틀린 원인 분석'],
        },
        {
          title: '오답노트 및 헷갈리는 공식/개념 암기 복습',
          description: '자주 실수하는 함정 문제 완벽 마스터',
          priority: 'high',
          category: '공부',
          dueDaysOffset: 10,
          subtasks: ['요약집 반복 암기', '모의 테스트 진행'],
        },
        {
          title: '실전 마인드셋 & 수험표/신분증 사전 준비',
          description: '시험 당일 컨디션 관리 및 필수 준비물 점검',
          priority: 'medium',
          category: '공부',
          dueDaysOffset: 12,
          subtasks: ['시험장 위치 및 입실 시간 확인', '컴퓨터용 사인펜/신분증 챙기기'],
        },
      ],
    };
  }

  // 3. 운동 / 다이어트 / 건강
  if (p.includes('운동') || p.includes('다이어트') || p.includes('헬스') || p.includes('런닝') || p.includes('건강') || p.includes('살')) {
    return {
      title: `💪 [${prompt}] 건강 & 바디 체인지 루틴`,
      category: '건강',
      tasks: [
        {
          title: '현재 상태 측정(몸무게/눈바디) 및 현실적 목표 수립',
          description: '무리하지 않는 주간 감량 목표 및 운동 시간표 작성',
          priority: 'high',
          category: '건강',
          dueDaysOffset: 1,
          subtasks: ['시작 사진 촬영', '주간 운동 요일 3일 정하기'],
        },
        {
          title: '클린 식단 실천: 매일 물 2L + 정제당/야식 금지',
          description: '충분한 단백질 섭취와 야식 배달 앱 삭제/제한',
          priority: 'high',
          category: '건강',
          dueDaysOffset: 2,
          subtasks: ['식단 일기 기록', '간식 대신 견과류/방울토마토'],
        },
        {
          title: '유산소 운동 주 3회 35분 달성',
          description: '심박수 올려 지방 연소 (빠르게 걷기 / 조깅 / 사이클)',
          priority: 'medium',
          category: '건강',
          dueDaysOffset: 5,
          subtasks: ['운동 후 스트레칭 10분', '운동 기록 앱에 인증'],
        },
        {
          title: '기초 근력 운동 (스쿼트 50개 + 플랭크 1분 x 3세트)',
          description: '코어 및 하체 근육 활성화로 기초대사량 증진',
          priority: 'medium',
          category: '건강',
          dueDaysOffset: 7,
          subtasks: ['바른 자세 유지 집중', '세트간 휴식 60초'],
        },
      ],
    };
  }

  // 4. 개발 / 코딩 / 웹사이트
  if (p.includes('개발') || p.includes('코딩') || p.includes('웹') || p.includes('앱') || p.includes('프로젝트') || p.includes('사이트')) {
    return {
      title: `⚡ [${prompt}] 프로덕트 론칭 로드맵`,
      category: '프로젝트',
      tasks: [
        {
          title: '프로젝트 스코프 정의 & MVP 핵심 기능 선정',
          description: '가장 핵심적인 가치를 제공할 단일 핵심 플로우 정의',
          priority: 'high',
          category: '프로젝트',
          dueDaysOffset: 1,
          subtasks: ['기능 우선순위 매트릭스 작성', '화면 흐름 스케치'],
        },
        {
          title: '프로젝트 초기화 및 기본 UI 레이아웃 구축',
          description: 'Vite / Next.js 프로젝트 세팅 및 반응형 스타일링 구현',
          priority: 'high',
          category: '프로젝트',
          dueDaysOffset: 3,
          subtasks: ['컴포넌트 폴더 구조 확립', '다크모드 및 기본 테마 설정'],
        },
        {
          title: '핵심 비즈니스 로직 및 상태 관리 연동',
          description: '사용자 인터랙션 처리, 데이터 영속화(LocalStorage/API)',
          priority: 'high',
          category: '프로젝트',
          dueDaysOffset: 5,
          subtasks: ['예외 상황 에러 핸들링', '사용자 피드백 토스트 알림 추가'],
        },
        {
          title: 'Vercel 클라우드 배포 & 오픈 피드백 수집',
          description: '원클릭 자동 배포 세팅 및 프로덕션 빌드 최적화',
          priority: 'medium',
          category: '프로젝트',
          dueDaysOffset: 7,
          subtasks: ['Vercel 프로덕션 도메인 생성', '모바일 브라우저 크로스 테스트'],
        },
      ],
    };
  }

  // 5. 일반/맞춤 생성 (자연어 구조화 분석)
  return {
    title: `✨ [${prompt}] 단계별 실행 플랜`,
    category: '업무',
    tasks: [
      {
        title: `1단계: '${prompt}' 사전 리서치 및 준비 작업`,
        description: '필요한 자료, 레퍼런스 수집 및 목표 달성을 위한 기본 정보 정리',
        priority: 'high',
        category: '업무',
        dueDaysOffset: 1,
        subtasks: ['참고자료 3개 수집', '필요 도구 및 예산 검토'],
      },
      {
        title: `2단계: 세부 실행 계획 수립 및 뼈대 구축`,
        description: '전체 과정을 소규모 단위로 쪼개어 단계별 마일스톤 생성',
        priority: 'high',
        category: '업무',
        dueDaysOffset: 2,
        subtasks: ['우선순위 순서 결정', '타임라인 캘린더에 표시'],
      },
      {
        title: `3단계: 핵심 실천 작업 집중 수행 (MVP)`,
        description: '가장 핵심이 되는 작업에 80%의 에너지를 쏟아 1차 결과물 도출',
        priority: 'high',
        category: '업무',
        dueDaysOffset: 4,
        subtasks: ['핵심 결과물 초안 완성', '진행 중간 자체 피드백'],
      },
      {
        title: `4단계: 결과물 검토, 보완 및 최종 완료 보고`,
        description: '부족한 부분 피드백 반영 및 완벽한 마무리를 위한 정리',
        priority: 'medium',
        category: '업무',
        dueDaysOffset: 6,
        subtasks: ['최종 체크리스트 전수 확인', '완료 후 성취 기록 및 회고'],
      },
    ],
  };
}

export function convertGeneratedPlanToTodos(
  generated: ReturnType<typeof generateSmartTasks>
): Omit<Todo, 'id' | 'createdAt'>[] {
  const today = new Date();

  return generated.tasks.map((task) => {
    const targetDate = new Date(today.getTime() + task.dueDaysOffset * 86400000);
    const dueDateStr = targetDate.toISOString().split('T')[0];

    return {
      title: task.title,
      description: task.description,
      completed: false,
      priority: task.priority,
      category: task.category,
      dueDate: dueDateStr,
      subtasks: task.subtasks.map((st, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        title: st,
        completed: false,
      })),
      pinned: task.priority === 'high',
    };
  });
}
