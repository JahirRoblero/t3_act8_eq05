import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx"

function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [persona, setPersona ] = useState(null)


  function abrirSidebar() {
    setSidebarAbierto(true);
  }

  function cerrarSidebar() {
    setSidebarAbierto(false);
  }



  function alIniciarSesion(datosUsuario) {
    setPersona(datosUsuario);
  }


  function cerrarSesion() {
    setPersona(null);
  }


  if (!persona) {
    return <Login onLoginExitoso={alIniciarSesion} />;
  }



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
        <Navbar onAbrirSidebar={abrirSidebar} />

        <main className="contenidoPagina">
          <h1>Lista de productos</h1>
        </main>
      </div>
    </div>
  );
}

export default App;
