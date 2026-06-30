import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Message, ProblemDetail } from '../types';
import { sendMessage } from '../services/chatService';
import { getBySessionId as getMessagesBySessionId } from '../services/messageService';

interface UseChatReturn {
  messages: Message[];
  isSending: boolean;
  isLoadingMessages: boolean;
  error: string | null;
  sendMessage: (content: string) => void;
}

export function useChat(sessionId: number | null): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<number | null>(sessionId);
  const loadingRef = useRef(false);

  useEffect(() => {
    sessionRef.current = sessionId;
    loadingRef.current = false;

    if (sessionId === null) {
      setMessages([]);
      return;
    }

    setIsLoadingMessages(true);
    setError(null);

    getMessagesBySessionId(sessionId)
      .then((data) => {
        if (sessionRef.current !== sessionId) return;
        setMessages(data);
      })
      .catch((caughtError: unknown) => {
        if (sessionRef.current !== sessionId) return;
        const problem = caughtError as ProblemDetail;
        setError(
          problem.detail ||
            problem.title ||
            'Erro ao carregar mensagens.',
        );
      })
      .finally(() => {
        if (sessionRef.current !== sessionId) return;
        setIsLoadingMessages(false);
      });
  }, [sessionId]);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (sessionId === null) return;
      if (loadingRef.current) return;
      loadingRef.current = true;

      setIsSending(true);
      setError(null);

      const userMessage: Message = {
        id: Date.now(),
        role: 'USER',
        content,
        timestamp: new Date().toISOString(),
      };

      const currentSession = sessionId;

      setMessages((previousMessages) => [
        ...previousMessages,
        userMessage,
      ]);

      sendMessage(currentSession, content)
        .then((response) => {
          if (sessionRef.current !== currentSession) return;
          setMessages((previousMessages) => [
            ...previousMessages,
            {
              ...response.assistantMessage,
              sources: Array.isArray(response.sources)
                ? response.sources
                : [],
            },
          ]);
        })
        .catch((caughtError) => {
          if (sessionRef.current !== currentSession) return;
          const problem = caughtError as ProblemDetail;
          const isTimeout =
            problem.status === 0 &&
            (problem.detail?.toLowerCase().includes('timeout') ?? false);

          if (isTimeout) {
            getMessagesBySessionId(currentSession)
              .then((serverMessages) => {
                if (sessionRef.current !== currentSession) return;
                if (serverMessages.length > messages.length + 1) {
                  setMessages(serverMessages);
                } else {
                  setError(
                    'O processamento excedeu o tempo limite. Tente novamente.',
                  );
                }
              })
              .catch(() => {
                setError(
                  'O processamento excedeu o tempo limite. Tente novamente.',
                );
              });
          } else {
            setError(
              problem.detail ||
                problem.title ||
                'Erro ao enviar mensagem.',
            );
          }
        })
        .finally(() => {
          if (sessionRef.current !== currentSession) return;
          setIsSending(false);
          loadingRef.current = false;
        });
    },
    [sessionId],
  );

  return {
    messages,
    isSending,
    isLoadingMessages,
    error,
    sendMessage: handleSendMessage,
  };
}
