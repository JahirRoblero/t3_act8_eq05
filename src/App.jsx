import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import BarraDeFiltros from "./components/BarraDeFiltros.jsx";

function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [persona, setPersona] = useState(null);

  function abrirSidebar() {
    setSidebarAbierto(true);
  }

  function cerrarSidebar() {
    setSidebarAbierto(false);
  }

  function alIniciarSesion(datosUsuario) {
    console.log("Usuario recibido:", datosUsuario);
    setPersona(datosUsuario);
  }

  function cerrarSesion() {
    setPersona(null);
    setSidebarAbierto(false);
  }

  if (!persona) {
    return <Login onLoginExitoso={alIniciarSesion} />;
  }

  const nombreCompleto =
    `${persona.firstName || ""} ${persona.lastName || ""}`.trim() ||
    persona.username ||
    "Usuario";

  return (
    <div className="layoutSistema">
      <Sidebar abierto={sidebarAbierto} onCerrar={cerrarSidebar} />

      {sidebarAbierto && (
        <button
          className="fondoOscuro"
          type="button"
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
          <h1>Lista de productos</h1>
          <BarraDeFiltros></BarraDeFiltros>
        </main>
      </div>
    </div>
  );
}

export default App;
