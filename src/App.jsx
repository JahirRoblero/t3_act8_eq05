import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";

import PaginaInicio from "./pages/PaginaInicio.jsx";
import PaginaProductos from "./pages/PaginaProductos.jsx";

function App() {
  const [persona, setPersona] = useState(null);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [vistaActual, setVistaActual] = useState("inicio");

  function iniciarSesion(datosUsuario) {
    setPersona(datosUsuario);
  }

  function cerrarSesion() {
    setPersona(null);
    setSidebarAbierto(false);
    setVistaActual("inicio");
  }

  function abrirSidebar() {
    setSidebarAbierto(true);
  }

  function cerrarSidebar() {
    setSidebarAbierto(false);
  }

  function cambiarVista(nuevaVista) {
    setVistaActual(nuevaVista);
    cerrarSidebar();
  }

  if (!persona) {
    return <Login onLoginExitoso={iniciarSesion} />;
  }

  const nombreCompleto =
    `${persona.firstName || ""} ${persona.lastName || ""}`.trim() ||
    persona.username ||
    "Usuario";

  return (
    <div className="layoutSistema">
      <Sidebar
        abierto={sidebarAbierto}
        vistaActual={vistaActual}
        onCerrar={cerrarSidebar}
        onCambiarVista={cambiarVista}
      />

      {sidebarAbierto && (
        <button
          type="button"
          className="fondoOscuro"
          onClick={cerrarSidebar}
          aria-label="Cerrar menú"
        />
      )}

      <div className="areaPrincipal">
        <Navbar
          nombreUsuario={nombreCompleto}
          imagenPerfil={persona.image}
          onAbrirSidebar={abrirSidebar}
          onCerrarSesion={cerrarSesion}
        />

        <main className="contenidoPagina">
          {vistaActual === "inicio" && <PaginaInicio />}

          {vistaActual === "productos" && <PaginaProductos />}
        </main>
      </div>
    </div>
  );
}

export default App;