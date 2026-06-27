import HealthIndicator from './components/HealthIndicator';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import UploadZone from './components/UploadZone';
import ProgressBar from './components/ProgressBar';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header__info">
          <h1 className="header__title">MindJournal AI</h1>
          <p className="header__desc">Seu diário pessoal inteligente</p>
        </div>
        <HealthIndicator />
      </header>
      <div className="layout">
        <Sidebar />
        <main className="main">
          <ChatArea />
          <ChatInput />
          <UploadZone />
          <ProgressBar />
        </main>
      </div>
    </div>
  );
}

export default App;
