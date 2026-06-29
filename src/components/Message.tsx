import { memo } from 'react';
import type { MessageRole, Source } from '../types';
import SourcePanel from './SourcePanel';

interface MessageProps {
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: Source[];
}

function Message({ role, content, timestamp, sources }: MessageProps) {
  const isUser = role === 'USER';

  return (
    <article
      className={`message ${
        isUser ? 'message--user' : 'message--assistant'
      }`}
    >
      <p className="message__content">{content}</p>
      <time className="message__timestamp" dateTime={timestamp}>
        {new Date(timestamp).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </time>
      {!isUser && sources && sources.length > 0 && (
        <SourcePanel sources={sources} />
      )}
    </article>
  );
}

export default memo(Message);
