export interface SavedCommand {
  id: number;
  description?: string | null;
  type?: string | null;
  textChannel?: boolean | null;
  attributes?: Record<string, unknown> | null;
}

