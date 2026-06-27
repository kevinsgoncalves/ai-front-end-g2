import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import ChatWindow from '../components/ChatWindow';

function createMessage(
  content: string,
  sender: 'USER' | 'ASSISTANT',
  id: number,
): Message {
  return {
    id,
    sessionId: 1,
    sender,
    content,
    timestamp: new Date().toISOString(),
  };
}

const MOCK_REPLIES = [
  'Que interessante! Conte-me mais sobre isso.',
  'Entendo como você se sente. Isso é muito relevante para o seu diário.',
  'Ótimo ponto! Vou refletir sobre isso.',
  'Muito bom! Como isso te faz sentir?',
  'Continue escrevendo, estou aqui para ouvir.',
  'Isso me lembra de algo importante. Vamos explorar mais esse tema?',
  'Obrigado por compartilhar. Isso é muito valioso.',
  'Perfeito! Anotei aqui no seu diário.',
];

function getRandomReply(): string {
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
}

function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const idRef = useRef(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const initialId = idRef.current++;
    setMessages([
      createMessage('Olá! Como posso ajudar você hoje?', 'ASSISTANT', initialId),
    ]);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = useCallback((content: string) => {
    const userMessage = createMessage(content, 'USER', idRef.current++);
    setMessages((prev) => [...prev, userMessage]);

    timeoutRef.current = setTimeout(() => {
      const reply = createMessage(getRandomReply(), 'ASSISTANT', idRef.current++);
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  }, []);

  return (
    <div className="home">
      <header className="home__header">
        <h1>MindJournal AI</h1>
      </header>
      <main className="home__main">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isDisabled={false}
        />
      </main>
    </div>
  );
}

export default Home;
