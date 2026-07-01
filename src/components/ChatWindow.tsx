import { useEffect, useRef } from 'react';
import type { Message as MessageType, AttachmentDetail } from '../types';
import Message from './Message';
import MessageInput from './MessageInput';
import AttachmentList from './AttachmentList';

interface ChatWindowProps {
  messages: MessageType[];
  onSendMessage: (content: string) => void;
  onAttachClick?: () => void;
  isDisabled: boolean;
  attachments?: AttachmentDetail[];
  onRefreshAttachments?: () => void;
}

function ChatWindow({
  messages,
  onSendMessage,
  onAttachClick,
  isDisabled,
  attachments,
  onRefreshAttachments,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, attachments]);

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
        attachments={attachments ?? []}
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
