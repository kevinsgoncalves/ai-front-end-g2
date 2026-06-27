function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sessões">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Sessões</h2>
        <button
          className="sidebar__new-btn"
          disabled
          aria-label="Criar nova sessão"
        >
          + Nova sessão
        </button>
      </div>
      <div className="sidebar__list">
        <p className="sidebar__empty">Nenhuma sessão ainda</p>
      </div>
    </aside>
  );
}

export default Sidebar;
