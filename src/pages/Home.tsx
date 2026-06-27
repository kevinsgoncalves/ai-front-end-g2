import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import ChatWindow from '../components/ChatWindow';
import { HistorySidebar, useHistorySidebar } from '../features/history-sidebar';
import { UploadZone, useUpload } from '../features/upload-area';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const idRef = useRef(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    conversations,
    selectedId,
    isLoading,
    error,
    selectSession,
    refresh,
  } = useHistorySidebar();

  const {
    status: uploadStatus,
    progress: uploadProgress,
    error: uploadError,
    selectedFile,
    handleFileSelect,
    handleRemove,
  } = useUpload(selectedId);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
        <div className="home__header-left">
          <h1>MindJournal AI</h1>
        </div>
        <div className="home__header-right">
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={
              theme === 'dark'
                ? 'Alternar para modo claro'
                : 'Alternar para modo escuro'
            }
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </header>
      <main className="home__main">
        <HistorySidebar
          conversations={conversations}
          selectedId={selectedId}
          isLoading={isLoading}
          error={error}
          onSelectSession={selectSession}
          onRefresh={refresh}
          onRetry={refresh}
        />
        <div className="chat-area-wrapper">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isDisabled={false}
          />
          <UploadZone
            status={uploadStatus}
            error={uploadError?.detail ?? null}
            selectedFile={selectedFile}
            progress={uploadProgress}
            onFileSelect={handleFileSelect}
            onRemove={handleRemove}
            isDisabled={selectedId === null}
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
