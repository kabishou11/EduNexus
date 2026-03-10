import type {
  Question,
  Answer,
  Comment,
  Vote,
  QuestionFollow,
  QuestionBookmark,
  UserReputation,
  UserQABadge,
  QuestionCategory
} from './qa-types';

/**
 * 问答数据存储（客户端）
 */

const QA_STORAGE_KEY = 'edunexus_qa_data';

type QAStorage = {
  questions: Question[];
  answers: Answer[];
  comments: Comment[];
  votes: Vote[];
  follows: QuestionFollow[];
  bookmarks: QuestionBookmark[];
  userReputations: Record<string, UserReputation>;
  userBadges: UserQABadge[];
};

function getDefaultStorage(): QAStorage {
  return {
    questions: getSampleQuestions(),
    answers: getSampleAnswers(),
    comments: [],
    votes: [],
    follows: [],
    bookmarks: [],
    userReputations: {
      'user_001': {
        userId: 'user_001',
        reputation: 1250,
        questionsAsked: 15,
        answersGiven: 42,
        answersAccepted: 28,
        votesReceived: 156,
        bestAnswerCount: 28,
        helpfulCount: 89,
        updatedAt: new Date().toISOString()
      }
    },
    userBadges: []
  };
}

export function loadQAData(): QAStorage {
  if (typeof window === 'undefined') return getDefaultStorage();

  try {
    const data = localStorage.getItem(QA_STORAGE_KEY);
    if (!data) {
      const defaultData = getDefaultStorage();
      saveQAData(defaultData);
      return defaultData;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load QA data:', error);
    return getDefaultStorage();
  }
}

export function saveQAData(data: QAStorage): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(QA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save QA data:', error);
  }
}

// 问题操作
export function createQuestion(question: Omit<Question, 'questionId' | 'createdAt' | 'updatedAt' | 'lastActivityAt' | 'viewCount' | 'voteCount' | 'answerCount'>): Question {
  const data = loadQAData();
  const newQuestion: Question = {
    ...question,
    questionId: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    viewCount: 0,
    voteCount: 0,
    answerCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString()
  };
  data.questions.unshift(newQuestion);
  saveQAData(data);
  return newQuestion;
}

export function getQuestions(filters?: {
  category?: QuestionCategory;
  tags?: string[];
  status?: string;
  search?: string;
  sort?: 'newest' | 'hot' | 'unanswered' | 'bounty';
}): Question[] {
  const data = loadQAData();
  let questions = [...data.questions];

  if (filters?.category) {
    questions = questions.filter(q => q.category === filters.category);
  }

  if (filters?.tags && filters.tags.length > 0) {
    questions = questions.filter(q =>
      filters.tags!.some(tag => q.tags.includes(tag))
    );
  }

  if (filters?.status) {
    questions = questions.filter(q => q.status === filters.status);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    questions = questions.filter(q =>
      q.title.toLowerCase().includes(search) ||
      q.content.toLowerCase().includes(search)
    );
  }

  // 排序
  switch (filters?.sort) {
    case 'hot':
      questions.sort((a, b) => {
        const scoreA = a.voteCount * 2 + a.answerCount * 3 + a.viewCount * 0.1;
        const scoreB = b.voteCount * 2 + b.answerCount * 3 + b.viewCount * 0.1;
        return scoreB - scoreA;
      });
      break;
    case 'unanswered':
      questions = questions.filter(q => q.answerCount === 0);
      questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'bounty':
      questions = questions.filter(q => q.bounty > 0);
      questions.sort((a, b) => b.bounty - a.bounty);
      break;
    default: // newest
      questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return questions;
}

export function getQuestionById(questionId: string): Question | undefined {
  const data = loadQAData();
  return data.questions.find(q => q.questionId === questionId);
}

export function updateQuestionViews(questionId: string): void {
  const data = loadQAData();
  const question = data.questions.find(q => q.questionId === questionId);
  if (question) {
    question.viewCount++;
    saveQAData(data);
  }
}

// 答案操作
export function createAnswer(answer: Omit<Answer, 'answerId' | 'createdAt' | 'updatedAt' | 'voteCount' | 'isAccepted'>): Answer {
  const data = loadQAData();
  const newAnswer: Answer = {
    ...answer,
    answerId: `a_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    voteCount: 0,
    isAccepted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.answers.push(newAnswer);

  // 更新问题的答案数和最后活动时间
  const question = data.questions.find(q => q.questionId === answer.questionId);
  if (question) {
    question.answerCount++;
    question.lastActivityAt = new Date().toISOString();
  }

  saveQAData(data);
  return newAnswer;
}

export function getAnswersByQuestionId(questionId: string): Answer[] {
  const data = loadQAData();
  return data.answers
    .filter(a => a.questionId === questionId)
    .sort((a, b) => {
      if (a.isAccepted) return -1;
      if (b.isAccepted) return 1;
      return b.voteCount - a.voteCount;
    });
}

export function acceptAnswer(questionId: string, answerId: string, userId: string): boolean {
  const data = loadQAData();
  const question = data.questions.find(q => q.questionId === questionId);

  if (!question || question.userId !== userId) {
    return false;
  }

  // 取消之前的采纳
  if (question.acceptedAnswerId) {
    const oldAnswer = data.answers.find(a => a.answerId === question.acceptedAnswerId);
    if (oldAnswer) {
      oldAnswer.isAccepted = false;
    }
  }

  // 采纳新答案
  const answer = data.answers.find(a => a.answerId === answerId);
  if (answer) {
    answer.isAccepted = true;
    question.acceptedAnswerId = answerId;
    question.status = 'answered';
    saveQAData(data);
    return true;
  }

  return false;
}

// 投票操作
export function vote(targetId: string, targetType: 'question' | 'answer', userId: string, voteType: 'up' | 'down'): void {
  const data = loadQAData();

  // 检查是否已投票
  const existingVote = data.votes.find(
    v => v.targetId === targetId && v.userId === userId
  );

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      // 取消投票
      data.votes = data.votes.filter(v => v.voteId !== existingVote.voteId);
      updateVoteCount(data, targetId, targetType, voteType === 'up' ? -1 : 1);
    } else {
      // 改变投票
      existingVote.voteType = voteType;
      updateVoteCount(data, targetId, targetType, voteType === 'up' ? 2 : -2);
    }
  } else {
    // 新投票
    const newVote: Vote = {
      voteId: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      targetId,
      targetType,
      userId,
      voteType,
      createdAt: new Date().toISOString()
    };
    data.votes.push(newVote);
    updateVoteCount(data, targetId, targetType, voteType === 'up' ? 1 : -1);
  }

  saveQAData(data);
}

function updateVoteCount(data: QAStorage, targetId: string, targetType: 'question' | 'answer', delta: number): void {
  if (targetType === 'question') {
    const question = data.questions.find(q => q.questionId === targetId);
    if (question) {
      question.voteCount += delta;
    }
  } else {
    const answer = data.answers.find(a => a.answerId === targetId);
    if (answer) {
      answer.voteCount += delta;
    }
  }
}

export function getUserVote(targetId: string, userId: string): Vote | undefined {
  const data = loadQAData();
  return data.votes.find(v => v.targetId === targetId && v.userId === userId);
}

// 评论操作
export function createComment(comment: Omit<Comment, 'commentId' | 'createdAt'>): Comment {
  const data = loadQAData();
  const newComment: Comment = {
    ...comment,
    commentId: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  data.comments.push(newComment);
  saveQAData(data);
  return newComment;
}

export function getCommentsByTargetId(targetId: string): Comment[] {
  const data = loadQAData();
  return data.comments
    .filter(c => c.targetId === targetId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

// 关注和收藏
export function toggleFollow(questionId: string, userId: string): boolean {
  const data = loadQAData();
  const existing = data.follows.find(
    f => f.questionId === questionId && f.userId === userId
  );

  if (existing) {
    data.follows = data.follows.filter(f => f.followId !== existing.followId);
    saveQAData(data);
    return false;
  } else {
    const newFollow: QuestionFollow = {
      followId: `f_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      questionId,
      userId,
      createdAt: new Date().toISOString()
    };
    data.follows.push(newFollow);
    saveQAData(data);
    return true;
  }
}

export function toggleBookmark(questionId: string, userId: string): boolean {
  const data = loadQAData();
  const existing = data.bookmarks.find(
    b => b.questionId === questionId && b.userId === userId
  );

  if (existing) {
    data.bookmarks = data.bookmarks.filter(b => b.bookmarkId !== existing.bookmarkId);
    saveQAData(data);
    return false;
  } else {
    const newBookmark: QuestionBookmark = {
      bookmarkId: `b_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      questionId,
      userId,
      createdAt: new Date().toISOString()
    };
    data.bookmarks.push(newBookmark);
    saveQAData(data);
    return true;
  }
}

export function isFollowing(questionId: string, userId: string): boolean {
  const data = loadQAData();
  return data.follows.some(f => f.questionId === questionId && f.userId === userId);
}

export function isBookmarked(questionId: string, userId: string): boolean {
  const data = loadQAData();
  return data.bookmarks.some(b => b.questionId === questionId && b.userId === userId);
}

// 用户声誉
export function getUserReputation(userId: string): UserReputation {
  const data = loadQAData();
  return data.userReputations[userId] || {
    userId,
    reputation: 0,
    questionsAsked: 0,
    answersGiven: 0,
    answersAccepted: 0,
    votesReceived: 0,
    bestAnswerCount: 0,
    helpfulCount: 0,
    updatedAt: new Date().toISOString()
  };
}

// 示例数据
function getSampleQuestions(): Question[] {
  const now = new Date();
  return [
    {
      questionId: 'q_001',
      userId: 'user_001',
      userName: '张三',
      title: 'React Hooks 中 useEffect 的依赖数组应该如何正确使用？',
      content: `我在使用 useEffect 时遇到了一些困惑：

\`\`\`javascript
useEffect(() => {
  fetchData(userId);
}, []);
\`\`\`

这样写会有 ESLint 警告说缺少依赖项 \`userId\`，但如果加上 \`userId\` 又会导致无限循环。请问正确的做法是什么？`,
      category: 'programming',
      tags: ['React', 'JavaScript', 'Hooks'],
      bounty: 50,
      status: 'answered',
      viewCount: 234,
      voteCount: 15,
      answerCount: 3,
      acceptedAnswerId: 'a_001',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivityAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      questionId: 'q_002',
      userId: 'user_002',
      userName: '李四',
      title: '如何理解微积分中的极限概念？',
      content: `我是数学初学者，对极限的定义感到困惑：

> 当 x 趋近于 a 时，f(x) 趋近于 L

这里的"趋近"到底是什么意思？能否用更直观的方式解释一下？`,
      category: 'math',
      tags: ['微积分', '极限', '数学基础'],
      bounty: 0,
      status: 'open',
      viewCount: 89,
      voteCount: 8,
      answerCount: 2,
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      lastActivityAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      questionId: 'q_003',
      userId: 'user_003',
      userName: '王五',
      title: 'Python 中的装饰器是如何工作的？',
      content: `看到很多 Python 代码使用 @decorator 语法，但不太理解其工作原理。

\`\`\`python
@login_required
def my_view(request):
    return HttpResponse("Hello")
\`\`\`

这个 @ 符号到底做了什么？能否详细解释一下装饰器的实现机制？`,
      category: 'programming',
      tags: ['Python', '装饰器', '高级特性'],
      bounty: 30,
      status: 'open',
      viewCount: 156,
      voteCount: 12,
      answerCount: 0,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      lastActivityAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      questionId: 'q_004',
      userId: 'user_004',
      userName: '赵六',
      title: '英语中的虚拟语气应该如何使用？',
      content: `对于虚拟语气的各种时态总是搞不清楚：

- If I were you...
- If I had known...
- If I were to do...

这些有什么区别？什么时候用哪一种？`,
      category: 'language',
      tags: ['英语', '语法', '虚拟语气'],
      bounty: 0,
      status: 'open',
      viewCount: 67,
      voteCount: 5,
      answerCount: 1,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      lastActivityAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    }
  ];
}

function getSampleAnswers(): Answer[] {
  const now = new Date();
  return [
    {
      answerId: 'a_001',
      questionId: 'q_001',
      userId: 'user_005',
      userName: '前端专家',
      content: `这是一个常见的问题！让我详细解释一下：

## 问题原因

ESLint 警告是对的 - 如果 \`useEffect\` 使用了外部变量但没有在依赖数组中声明，可能会导致闭包陷阱。

## 正确做法

有几种解决方案：

### 1. 使用 useCallback 包装函数

\`\`\`javascript
const fetchDataCallback = useCallback(() => {
  fetchData(userId);
}, [userId]);

useEffect(() => {
  fetchDataCallback();
}, [fetchDataCallback]);
\`\`\`

### 2. 将函数移到 useEffect 内部

\`\`\`javascript
useEffect(() => {
  const loadData = async () => {
    await fetchData(userId);
  };
  loadData();
}, [userId]);
\`\`\`

### 3. 使用 useRef 存储最新值（特殊情况）

\`\`\`javascript
const userIdRef = useRef(userId);
userIdRef.current = userId;

useEffect(() => {
  fetchData(userIdRef.current);
}, []); // 只在挂载时执行
\`\`\`

## 推荐方案

**方案 2** 是最简单直接的，也是 React 官方推荐的做法。`,
      voteCount: 23,
      isAccepted: true,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      answerId: 'a_002',
      questionId: 'q_002',
      userId: 'user_006',
      userName: '数学老师',
      content: `让我用一个生活化的例子来解释极限：

## 直观理解

想象你在走向一扇门：
- 第一步：走了一半距离
- 第二步：又走了剩余距离的一半
- 第三步：再走剩余距离的一半
- ...

你会**无限接近**门，但理论上永远不会真正到达。这就是"趋近"的含义。

## 数学定义

用 ε-δ 语言：

> 对于任意小的正数 ε，总存在 δ，使得当 0 < |x - a| < δ 时，有 |f(x) - L| < ε

翻译成人话：
- 无论你要求多么接近（ε 多小）
- 我都能找到一个范围（δ）
- 在这个范围内，函数值确实那么接近目标值

## 关键点

1. **趋近不等于到达** - x 可以无限接近 a，但不一定等于 a
2. **极限可能不存在** - 比如 sin(1/x) 在 x→0 时
3. **函数在该点可以无定义** - 极限只关心"附近"的行为

希望这个解释有帮助！`,
      voteCount: 15,
      isAccepted: false,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
    }
  ];
}
