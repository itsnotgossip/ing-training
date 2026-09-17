// Text fields support **bold** and *italic* markers, rendered by renderInline().

export type Block =
  | { kind: "lead"; body: string }
  | { kind: "card"; body: string; variant?: "purple"; align?: "center" }
  | {
      kind: "tiles";
      // `more` makes a box tap-to-expand: `body` is the calm surface line,
      // `more` is the depth revealed on tap.
      items: { emoji?: string; title?: string; body: string; more?: string }[];
    }
  | { kind: "note"; body: string; align?: "center" }
  | { kind: "quote"; text: string; cite: string; variant?: "purple" }
  | { kind: "stats"; items: { n: string; d: string }[]; source?: string }
  | { kind: "numbered"; items: { title: string; body: string }[] }
  | {
      kind: "hearRespond";
      pairs: { hear: string; respond: string; why: string }[];
    }
  | { kind: "details"; summary: string; paragraphs: string[] };

export type QuizQuestion = {
  q: string;
  opts: string[];
  a: number;
  fb: string;
};

export type Step =
  | {
      type: "hero";
      navTitle: string;
      kicker: string;
      title: string;
      subtitle: string;
      blocks?: Block[];
    }
  | {
      type: "content";
      navTitle: string;
      kicker: string;
      title: string;
      blocks: Block[];
    }
  | {
      type: "quiz";
      navTitle: string;
      kicker: string;
      title: string;
      intro?: Block[];
      questions: QuizQuestion[];
    }
  | {
      type: "survey";
      navTitle: string;
      phase: "pre" | "post";
      kicker: string;
      title: string;
      intro: string;
    }
  | {
      type: "finish";
      navTitle: string;
      kicker: string;
      title: string;
      blocks: Block[];
    };

export type SurveyQuestion = {
  id: string;
  label: string;
};

export type TrainingModule = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  minutes: string;
  surveyQuestions: SurveyQuestion[];
  steps: Step[];
};
