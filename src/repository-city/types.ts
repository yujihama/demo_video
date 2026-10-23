export type VisualMode =
  | "city"
  | "journal"
  | "sheet"
  | "data"
  | "twin"
  | "edit"
  | "council";

export type RepositorySceneConfig = {
  index: number;
  chapter: string;
  repository: string;
  character: string;
  role: string;
  initials: string;
  accent: string;
  accent2: string;
  title: string;
  detail: string;
  metric?: string;
  mode: VisualMode;
};
