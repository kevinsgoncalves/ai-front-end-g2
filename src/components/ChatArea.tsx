function ChatArea() {
  return (
    <section className="chat-area" aria-label="Mensagens">
      <div className="chat-area__messages" role="log" aria-live="polite">
        <div className="chat-area__empty">
          <p className="chat-area__empty-text">Nenhuma mensagem ainda.</p>
          <p className="chat-area__empty-hint">Escreva algo!</p>
        </div>
      </div>
    </section>
  );
}

export default ChatArea;
