import type { ConversationItemData } from '../types/historySidebar';
import { getSessions } from '../../../services/sessionService';

export async function fetchConversations(): Promise<ConversationItemData[]> {
  const sessions = await getSessions();
  return sessions.map((session) => ({
    id: session.id,
    title: session.title,
    date: session.createdAt,
    messageCount: 0,
  }));
}
