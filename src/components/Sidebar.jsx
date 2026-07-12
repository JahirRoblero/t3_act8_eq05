import "./Sidebar.css";

function Sidebar({ abierto, onCerrar }) {
  return (
    <aside className={`sidebar ${abierto ? "sidebarAbierto" : ""}`}>
      <div className="encabezadoSidebar">
        <h2 className="tituloSidebar">
          Gestión de <span>Productos</span>
        </h2>

        <button
          className="botonCerrarSidebar"
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar menú"
        >
          ×
        </button>
      </div>

      <nav className="menuSidebar">
        <button type="button" onClick={onCerrar}>
          Inicio
        </button>

        <button type="button" onClick={onCerrar}>
          Productos
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
