import { useRef, useEffect } from 'react';
import type { Message as MessageType } from '../types';
import Message from './Message';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  messages: MessageType[];
  onSendMessage: (content: string) => void;
  isDisabled: boolean;
}

function ChatWindow({ messages, onSendMessage, isDisabled }: ChatWindowProps) {
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
          messages.map((msg) => (
            <Message key={msg.id} sender={msg.sender} content={msg.content} timestamp={msg.timestamp} />
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <MessageInput onSendMessage={onSendMessage} isDisabled={isDisabled} />
    </div>
  );
}

export default ChatWindow;
