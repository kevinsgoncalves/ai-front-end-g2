function ChatInput() {
  return (
    <div className="chat-input">
      <input
        className="chat-input__field"
        type="text"
        placeholder="Selecione uma sessão para começar"
        disabled
        aria-label="Digite sua mensagem"
      />
      <button
        className="chat-input__btn"
        type="button"
        disabled
        aria-label="Enviar mensagem"
      >
        Enviar
      </button>
    </div>
  );
}

export default ChatInput;
