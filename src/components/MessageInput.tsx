import { useState, type KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isDisabled: boolean;
}

function MessageInput({ onSendMessage, isDisabled }: MessageInputProps) {
  const [text, setText] = useState('');

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || isDisabled) return;
    onSendMessage(trimmed);
    setText('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="message-input">
      <textarea
        aria-label="Digite sua mensagem"
        placeholder={
          isDisabled
            ? 'Selecione uma sessão para começar'
            : 'Digite sua mensagem...'
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={isDisabled}
      />
      <button
        aria-label="Enviar mensagem"
        onClick={handleSend}
        disabled={isDisabled || !text.trim()}
      >
        Enviar
      </button>
    </div>
  );
}

export default MessageInput;
