import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx"
import EditarProductoModal from "./components/EditarProductoModal.jsx";

function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [persona, setPersona ] = useState(null)
  /*const [mostrarModal, setMostrarModal] = useState(false); */


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


  /* Es solo probar el from
  function guardarProducto(datos) { 
    console.log("Producto guardado:", datos);
    setMostrarModal(false);
  }
  */

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

          {/* BOTÓN TEMPORAL SOLO PARA PROBAR EL MODAL 
          <button onClick={() => setMostrarModal(true)}>
            Probar modal editar producto
          </button>
          /*Solo es prueba para verlo en pantalla */}


        </main>
      </div>


      {/*Solo es prueba para verlo en pantalla */
       /* el modal aparece encima de todo cuando mostrarModal es true 
      {mostrarModal && (
        <EditarProductoModal
          producto={null}
          onGuardar={guardarProducto}
          onCancelar={() => setMostrarModal(false)}
        />
      )}
     BORRAR
     */}

    </div>
  );
}

export default App;
