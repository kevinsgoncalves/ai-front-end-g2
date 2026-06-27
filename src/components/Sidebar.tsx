function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Sessões</h2>
        <button className="sidebar__new-btn" type="button">
          + Nova sessão
        </button>
      </div>
      <p className="sidebar__empty">Nenhuma sessão ainda</p>
    </aside>
  );
}

export default Sidebar;
