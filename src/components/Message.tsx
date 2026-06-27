import { memo } from 'react';
import type { Sender } from '../types';

interface MessageProps {
  sender: Sender;
  content: string;
  timestamp: string;
}

function Message({ sender, content, timestamp }: MessageProps) {
  const isUser = sender === 'USER';

  return (
    <div
      role="article"
      aria-label={`Mensagem do ${isUser ? 'usuário' : 'assistente'}`}
      className={`message ${isUser ? 'message--user' : 'message--assistant'}`}
    >
      <div className="message__content">{content}</div>
      <time className="message__timestamp">
        {new Date(timestamp).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </time>
    </div>
  );
}

export default memo(Message);
