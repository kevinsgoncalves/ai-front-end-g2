import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onAttachClick?: () => void;
  isDisabled: boolean;
}

function MessageInput({
  onSendMessage,
  onAttachClick,
  isDisabled,
}: MessageInputProps) {
  const [text, setText] = useState('');

  function handleSend() {
    const trimmed = text.trim();

    if (!trimmed || isDisabled) {
      return;
    }

    onSendMessage(trimmed);
    setText('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="message-input">
      <button
        type="button"
        className="message-input__attach"
        aria-label="Anexar arquivos"
        onClick={onAttachClick}
        disabled={isDisabled}
      >
        📎
      </button>

      <textarea
        aria-label="Mensagem"
        placeholder="Escreva sua mensagem..."
        value={text}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          setText(event.target.value)
        }
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={isDisabled}
      />

      <button
        type="button"
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
