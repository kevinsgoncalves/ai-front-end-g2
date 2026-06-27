export interface ConversationItemData {
  id: number;
  title: string;
  date: string;
  messageCount: number;
}

export interface HistorySidebarState {
  conversations: ConversationItemData[];
  selectedId: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface HistorySidebarActions {
  selectSession: (id: number) => void;
  refresh: () => void;
}
