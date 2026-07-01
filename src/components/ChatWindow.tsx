import { useEffect, useRef } from 'react';
import type { Message as MessageType, Attachment } from '../types';
import Message from './Message';
import MessageInput from './MessageInput';
import AttachmentList from './AttachmentList';

interface ChatWindowProps {
  messages: MessageType[];
  onSendMessage: (content: string) => void;
  onAttachClick?: () => void;
  isDisabled: boolean;
  attachments: Attachment[];
  attachmentsLoading: boolean;
  attachmentsError: string | null;
  onRefreshAttachments: () => void;
}

function ChatWindow({
  messages,
  onSendMessage,
  onAttachClick,
  isDisabled,
  attachments,
  attachmentsLoading,
  attachmentsError,
  onRefreshAttachments,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-window__messages">
        {messages.length === 0 ? (
          <div className="chat-window__empty">
            Nenhuma mensagem ainda. Escreva algo!
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              sources={message.sources}
            />
          ))
        )}

        <div ref={bottomRef} />
      </div>

      <AttachmentList
        attachments={attachments}
        isLoading={attachmentsLoading}
        error={attachmentsError}
        onRefresh={onRefreshAttachments}
      />

      <MessageInput
        onSendMessage={onSendMessage}
        onAttachClick={onAttachClick}
        isDisabled={isDisabled}
      />
    </div>
  );
}

export default ChatWindow;