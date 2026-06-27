import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Message, ProblemDetail } from '../types';
import { sendMessage } from '../services/chatService';

interface UseChatReturn {
  messages: Message[];
  isSending: boolean;
  error: string | null;
  sendMessage: (content: string) => void;
}

const INITIAL_SESSION_ID = 1;

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState<number>(INITIAL_SESSION_ID);
  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      setIsSending(true);
      setError(null);

      const userMessage: Message = {
        id: Date.now(),
        sessionId,
        role: 'USER',
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        userMessage,
      ]);

      sendMessage(sessionId, content)
        .then((response) => {
          if (abortRef.current) {
            return;
          }

          setMessages((previousMessages) => [
            ...previousMessages,
            response.assistantMessage,
          ]);
        })
        .catch((caughtError) => {
          if (abortRef.current) {
            return;
          }

          const problem = caughtError as ProblemDetail;

          setError(
            problem.detail ||
              problem.title ||
              'Erro ao enviar mensagem.',
          );
        })
        .finally(() => {
          if (!abortRef.current) {
            setIsSending(false);
          }
        });
    },
    [sessionId],
  );

  return {
    messages,
    isSending,
    error,
    sendMessage: handleSendMessage,
  };
}
