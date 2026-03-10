export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type Course = {
  id: number;
  title: string;
  description: string;
  level: CourseLevel;
};

export type Lesson = {
  id: number;
  courseId: number;
  title: string;
  content: string;
  estimatedMinutes: number;
};

export type QuizChoice = {
  id: number;
  label: "A" | "B" | "C" | "D";
  text: string;
};

export type QuizQuestion = {
  id: number;
  lessonId: number;
  question: string;
  explanation: string;
  answerId: number;
  choices: QuizChoice[];
};

export const courses: Course[] = [
  { id: 1, title: "そもそも税金って何？", description: "税金の基本をゼロから理解", level: "beginner" },
  { id: 2, title: "給与明細の読み方", description: "控除・税額・手取りの見方", level: "beginner" },
  { id: 3, title: "ふるさと納税ってお得なの？", description: "制度と注意点を学ぶ", level: "beginner" },
  { id: 4, title: "確定申告の手順と書類", description: "準備から提出までの流れ", level: "intermediate" },
  { id: 5, title: "副業の税金・経費のポイント", description: "副業で押さえる税務", level: "intermediate" },
  { id: 6, title: "iDeCo・NISAで賢く節税", description: "制度活用で将来に備える", level: "advanced" },
];

export const lessons: Lesson[] = [
  {
    id: 1,
    courseId: 1,
    title: "税金の役割を知ろう",
    estimatedMinutes: 5,
    content:
      "税金は、教育・医療・インフラなど社会を支えるための資金です。まずは『なぜ税金が必要なのか』を理解しましょう。",
  },
  {
    id: 2,
    courseId: 2,
    title: "給与明細の基本項目",
    estimatedMinutes: 8,
    content:
      "給与明細には、支給・控除・差引支給額が記載されています。所得税・住民税・社会保険料を区別して読めるようになるのが目標です。",
  },
  {
    id: 3,
    courseId: 4,
    title: "確定申告の準備",
    estimatedMinutes: 10,
    content:
      "必要書類を早めに準備することで、確定申告はスムーズに進みます。源泉徴収票、控除証明書、経費資料を整理しましょう。",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    lessonId: 1,
    question: "所得税は何を基準に計算されますか？",
    explanation: "収入から各種控除を引いた課税所得に税率を適用して計算します。",
    answerId: 2,
    choices: [
      { id: 1, label: "A", text: "総支給額" },
      { id: 2, label: "B", text: "課税所得" },
      { id: 3, label: "C", text: "手取り金額" },
      { id: 4, label: "D", text: "会社が自由に決める" },
    ],
  },
];
