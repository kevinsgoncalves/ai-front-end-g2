import { useCallback, useEffect, useRef } from 'react';
import type { ChatResponse } from '../types';
import ChatWindow from '../components/ChatWindow';
import HealthIndicator from '../components/HealthIndicator';
import ThemeToggle from '../components/ThemeToggle';
import { useHealth } from '../hooks/useHealth';
import { useChat } from '../hooks/useChat';
import { useTheme } from '../hooks/useTheme';
import { HistorySidebar, useHistorySidebar } from '../features/history-sidebar';
import { useUploadModal, UploadFileModal } from '../features/upload-area';

function Home() {
  const healthStatus = useHealth();
  const { theme, toggleTheme } = useTheme();
  const refreshedTitles = useRef(new Set<number>());

  const {
    conversations,
    selectedId,
    isLoading: sessionsLoading,
    error: sessionsError,
    deletingId,
    updatingTitleId,
    selectSession,
    refresh: refreshSessions,
    createSession: hookCreateSession,
    deleteSession: hookDeleteSession,
    updateConversationTitle,
    updateTitle,
  } = useHistorySidebar();

  const handleMessageSent = useCallback(
    (response: ChatResponse) => {
      if (response.sessionTitle && selectedId !== null) {
        updateConversationTitle(selectedId, response.sessionTitle);
      } else if (
        selectedId !== null &&
        !refreshedTitles.current.has(selectedId)
      ) {
        refreshedTitles.current.add(selectedId);
        refreshSessions();
      }
    },
    [selectedId, updateConversationTitle, refreshSessions],
  );

  const {
    messages,
    isSending,
    isLoadingMessages,
    error: chatError,
    sendMessage,
  } = useChat(selectedId, handleMessageSent);

  const {
    isOpen: uploadModalOpen,
    files: uploadFiles,
    isUploading: isUploadingFiles,
    globalError: uploadGlobalError,
    uploadSuccess,
    open: openUploadModal,
    close: closeUploadModal,
    addFiles: addUploadFiles,
    removeFile: removeUploadFile,
    startUpload: startFileUpload,
  } = useUploadModal(selectedId);

  useEffect(() => {
    if (selectedId !== null) {
      refreshedTitles.current.delete(selectedId);
    }
  }, [selectedId]);

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
          updatingTitleId={updatingTitleId}
          onSelectSession={handleSelectSession}
          onDeleteSession={hookDeleteSession}
          onUpdateTitle={updateTitle}
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
              onAttachClick={openUploadModal}
              isDisabled={isSending || selectedId === null || isLoadingMessages}
            />
          </div>
        </main>
      </div>

      <UploadFileModal
        isOpen={uploadModalOpen}
        files={uploadFiles}
        isUploading={isUploadingFiles}
        globalError={uploadGlobalError}
        uploadSuccess={uploadSuccess}
        onClose={closeUploadModal}
        onAddFiles={addUploadFiles}
        onRemoveFile={removeUploadFile}
        onUpload={startFileUpload}
      />
    </div>
  );
}

export default Home;
