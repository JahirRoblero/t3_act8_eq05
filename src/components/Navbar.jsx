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

      <div className="contenedor">
        <img
          className="imagenJahir"
          src={imagenPerfil || imagenJahir}
          alt={`Foto de ${nombreUsuario}`}
        />

        <p id="nombreUsuario">{nombreUsuario}</p>

        <button
          className="botonUsuario"
          type="button"
          onClick={onCerrarSesion}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <img className="imagenUsuario" src={flechaHaciaAbajo} alt="" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
