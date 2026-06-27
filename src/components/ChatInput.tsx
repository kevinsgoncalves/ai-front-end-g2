function ChatInput() {
  return (
    <div className="chat-input">
      <input
        className="chat-input__field"
        type="text"
        placeholder="Escreva sua mensagem..."
      />
      <button className="chat-input__btn" type="button">
        Enviar
      </button>
    </div>
  );
}

export default ChatInput;
