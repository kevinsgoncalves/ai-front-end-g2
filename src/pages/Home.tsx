import { useCallback } from 'react';
import ChatWindow from '../components/ChatWindow';
import HealthIndicator from '../components/HealthIndicator';
import ThemeToggle from '../components/ThemeToggle';
import { useHealth } from '../hooks/useHealth';
import { useChat } from '../hooks/useChat';
import { useTheme } from '../hooks/useTheme';
import { HistorySidebar, useHistorySidebar } from '../features/history-sidebar';
import { useUpload, UploadZone } from '../features/upload-area';

function Home() {
  const healthStatus = useHealth();
  const { theme, toggleTheme } = useTheme();

  const {
    conversations,
    selectedId,
    isLoading: sessionsLoading,
    error: sessionsError,
    deletingId,
    selectSession,
    refresh: refreshSessions,
    createSession: hookCreateSession,
    deleteSession: hookDeleteSession,
  } = useHistorySidebar();

  const {
    messages,
    isSending,
    isLoadingMessages,
    error: chatError,
    sendMessage,
  } = useChat(selectedId);

  const {
    status: uploadStatus,
    progress: uploadProgress,
    error: uploadError,
    selectedFile,
    handleFileSelect,
    handleRemove,
    dragHandlers,
  } = useUpload(selectedId);

  const isUploadDisabled = selectedId === null;

  const handleSelectSession = useCallback(
    (id: number) => {
      selectSession(id);
    },
    [selectSession],
  );

  const handleRefresh = useCallback(() => {
    refreshSessions();
  }, [refreshSessions]);

  const handleRetry = useCallback(() => {
    refreshSessions();
  }, [refreshSessions]);

  const handleCreateSession = useCallback(async () => {
    await hookCreateSession('Nova sessão');
  }, [hookCreateSession]);

  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage],
  );

  return (
    <div className="home">
      <header className="home__header">
        <div>
          <h1>MindJourney IA</h1>
          <p>Seu diário inteligente</p>
        </div>
        <div className="home__header-actions">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <HealthIndicator status={healthStatus} />
        </div>
      </header>

      <div className="home__body">
        <HistorySidebar
          conversations={conversations}
          selectedId={selectedId}
          isLoading={sessionsLoading}
          error={sessionsError}
          deletingId={deletingId}
          onSelectSession={handleSelectSession}
          onDeleteSession={hookDeleteSession}
          onRefresh={handleRefresh}
          onRetry={handleRetry}
          onCreateSession={handleCreateSession}
        />

        <main className="home__main">
          <div className="home__content">
            {chatError && <p className="home__error">{chatError}</p>}

            {!selectedId && !chatError && (
              <p className="home__info">
                Selecione ou crie uma sessão para começar.
              </p>
            )}

            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isDisabled={isSending || selectedId === null || isLoadingMessages}
            />

            <div className="upload-zone-wrapper">
              <UploadZone
                status={uploadStatus}
                error={uploadError ? uploadError.detail : null}
                selectedFile={selectedFile}
                progress={uploadProgress}
                onFileSelect={handleFileSelect}
                onRemove={handleRemove}
                isDisabled={isUploadDisabled}
                dragHandlers={dragHandlers}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
