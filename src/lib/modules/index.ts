import type { TrainingModule } from "./types";
import { turningConversations } from "./turning-conversations";

export const MODULES: TrainingModule[] = [turningConversations];

export function getModule(slug: string): TrainingModule | undefined {
  return MODULES.find((m) => m.slug === slug);
}
