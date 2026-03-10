import { CourseLevel } from "@/lib/mock-data";

type Props = {
  level: CourseLevel;
};

const labels: Record<CourseLevel, string> = {
  beginner: "入門",
  intermediate: "中級",
  advanced: "上級",
};

export function LevelBadge({ level }: Props) {
  return <span className={`tp-level tp-level-${level}`}>{labels[level]}</span>;
}
