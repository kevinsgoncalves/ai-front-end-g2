import type { ConversationItemData } from '../types/historySidebar';
import { sessionsMock } from '../mocks/sessionsMock';

export async function fetchConversations(): Promise<ConversationItemData[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return sessionsMock;
}
