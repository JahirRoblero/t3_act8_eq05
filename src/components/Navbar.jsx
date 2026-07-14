import { useState } from "react";

import imagenJahir from "../assets/images/imagenJahir.png";
import flechaHaciaAbajo from "../assets/images/flechaHaciaAbajo.svg";

import "./Navbar.css";

function Navbar({
  nombreUsuario,
  imagenPerfil,
  onAbrirSidebar,
  onCerrarSesion,
}) {
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  function cambiarEstadoMenu() {
    setMenuUsuarioAbierto((estadoAnterior) => !estadoAnterior);
  }

  function cerrarSesion() {
    setMenuUsuarioAbierto(false);
    onCerrarSesion();
  }

  return (
    <nav className="navegacion">
      <div className="zonaIzquierda">
        <button
          className="botonMenu"
          type="button"
          onClick={onAbrirSidebar}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      <div className="contenedorUsuario">
        <img
          className="imagenJahir"
          src={imagenPerfil || imagenJahir}
          alt={`Foto de ${nombreUsuario}`}
        />

        <p id="nombreUsuario">{nombreUsuario}</p>

        <div className="contenedorMenuUsuario">
          <button
            className="botonUsuario"
            type="button"
            onClick={cambiarEstadoMenu}
            aria-label="Abrir menú de usuario"
            aria-expanded={menuUsuarioAbierto}
          >
            <img
              className={`imagenUsuario ${
                menuUsuarioAbierto ? "flechaAbierta" : ""
              }`}
              src={flechaHaciaAbajo}
              alt=""
            />
          </button>

          {menuUsuarioAbierto && (
            <div className="menuDesplegableUsuario">
              <button
                className="botonCerrarSesion"
                type="button"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;