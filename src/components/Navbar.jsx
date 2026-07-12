import imagenJahir from "../assets/images/imagenJahir.png";
import flechaHaciaAbajo from "../assets/images/flechaHaciaAbajo.svg";
import buscarIcono from "../assets/images/buscarIcono.svg";
import "./Navbar.css";

function Navbar({ nombreUsuario }) {
  return (
    <nav className="navegacion">
      <div className="contenedorBuscador">
        <img className="iconoBuscar" src={buscarIcono} alt="Buscar" />

        <input className="buscador" type="text" placeholder="Buscar producto" />
      </div>

      <div className="contenedor">
        <img className="imagenJahir" src={imagenJahir} alt="Foto de usuario" />

        <p id="nombreUsuario">{nombreUsuario || "Jahir Roblero"}</p>

        <button className="botonUsuario" type="button">
          <img
            className="imagenUsuario"
            src={flechaHaciaAbajo}
            alt="Abrir menú de usuario"
          />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
