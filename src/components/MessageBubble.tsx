interface MessageBubbleProps {
  sender: 'USER' | 'ASSISTANT';
  content: string;
  timestamp: string;
}

function MessageBubble({ sender, content, timestamp }: MessageBubbleProps) {
  const isUser = sender === 'USER';

  return (
    <article
      className={`message ${isUser ? 'message--user' : 'message--assistant'}`}
      aria-label={isUser ? 'Mensagem do usuário' : 'Mensagem do assistente'}
    >
      <div className="message__content">{content}</div>
      <time className="message__time">{timestamp}</time>
    </article>
  );
}

export default MessageBubble;
