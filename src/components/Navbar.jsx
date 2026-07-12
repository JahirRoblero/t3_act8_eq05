import imagenJahir from "../assets/images/imagenJahir.png";
import flechaHaciaAbajo from "../assets/images/flechaHaciaAbajo.svg";
import buscarIcono from "../assets/images/buscarIcono.svg";
import "./Navbar.css";

function Navbar({ nombreUsuario, onAbrirSidebar }) {
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
        <img className="imagenJahir" src={imagenJahir} alt="Foto de usuario" />

        <p id="nombreUsuario">{nombreUsuario || "Jahir Roblero"}</p>

        <button
          className="botonUsuario"
          type="button"
          aria-label="Abrir menú de usuario"
        >
          <img className="imagenUsuario" src={flechaHaciaAbajo} alt="" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
