import { useState } from "react";
import imagenJahir from "../assets/images/imagenJahir.png";
import flechaHaciaAbajo from "../assets/images/flechaHaciaAbajo.svg";
import buscarIcono from "../assets/images/buscarIcono.svg";
import "./Navbar.css";

function Navbar({
  nombreUsuario,
  imagenPerfil,
  onAbrirSidebar,
  onCerrarSesion,
}) {
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  function cambiarEstadoMenu() {
    if (menuUsuarioAbierto === false) {
      setMenuUsuarioAbierto(true);
    } else {
      setMenuUsuarioAbierto(false);
    }
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

        <div className="contenedorBuscador">
          <img className="iconoBuscar" src={buscarIcono} alt="" />

          <input
            className="buscador"
            type="text"
            placeholder="Buscar producto"
          />
        </div>
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
                onClick={onCerrarSesion}
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
