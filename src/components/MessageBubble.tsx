import type { MessageRole } from '../types';

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  timestamp: string;
}

function MessageBubble({
  role,
  content,
  timestamp,
}: MessageBubbleProps) {
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
    </article>
  );
}

export default MessageBubble;
