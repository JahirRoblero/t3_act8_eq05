import "./Sidebar.css";

function Sidebar({
  abierto,
  onCerrar,
  vistaActual,
  onCambiarVista,
}) {
  return (
    <aside className={`sidebar ${abierto ? "sidebarAbierto" : ""}`}>
      <div className="encabezadoSidebar">
        <h2 className="tituloSidebar">
          Gestión de <span>Productos</span>
        </h2>

        <button
          type="button"
          className="botonCerrarSidebar"
          onClick={onCerrar}
          aria-label="Cerrar menú"
        >
          ×
        </button>
      </div>

      <nav className="menuSidebar">
        <button
          type="button"
          className={vistaActual === "inicio" ? "opcionActiva" : ""}
          onClick={() => onCambiarVista("inicio")}
        >
          Inicio
        </button>

        <button
          type="button"
          className={vistaActual === "productos" ? "opcionActiva" : ""}
          onClick={() => onCambiarVista("productos")}
        >
          Productos
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;