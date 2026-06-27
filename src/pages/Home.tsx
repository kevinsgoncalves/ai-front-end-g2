import ChatWindow from '../components/ChatWindow';
import HealthIndicator from '../components/HealthIndicator';
import { useChat } from '../hooks/useChat';

function Home() {
  const { messages, isSending, error, sendMessage } = useChat();

  return (
    <div className="home">
      <header className="home__header">
        <div>
          <h1>MindJourney IA</h1>
          <p>Seu diário inteligente</p>
        </div>
        <HealthIndicator />
      </header>

      <main className="home__main">
        <div className="home__content">
          {error && <p className="home__error">{error}</p>}

          <ChatWindow
            messages={messages}
            onSendMessage={sendMessage}
            isDisabled={isSending}
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
