import { useEffect, useState } from "react";
import iconoFiltro from "../assets/icons/iconoFiltro.svg";
import flechaHaciaAbajo from "../assets/images/flechaHaciaAbajo.svg";
import { obtenerCategorias } from "../services/api.js";
import "./BarraDeFiltros.css";

function BarraDeFiltros({ onCambiarCategoria, onCambiarDisponibilidad }) {
  const [categorias, setCategorias] = useState([]);
  const [menuCategoriasAbierto, setMenuCategoriasAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Categoría");
  const [cargandoCategorias, setCargandoCategorias] = useState(false);
  const [errorCategorias, setErrorCategorias] = useState("");

  const [disponibilidad, setDisponibilidad] = useState("Disponibilidad");
  const [menuDisponibilidadAbierto, setMenuDisponibilidadAbierto] =
    useState(false);

  useEffect(() => {
    async function cargarCategorias() {
      setCargandoCategorias(true);
      setErrorCategorias("");

      try {
        const datos = await obtenerCategorias();
        setCategorias(datos);
      } catch (error) {
        setErrorCategorias(error.message);
      } finally {
        setCargandoCategorias(false);
      }
    }

    cargarCategorias();
  }, []);

  function seleccionarCategoria(categoria) {
    setCategoriaSeleccionada(categoria.name);
    setMenuCategoriasAbierto(false);

    onCambiarCategoria?.(categoria.slug);
  }

  function mostrarTodasLasCategorias() {
    setCategoriaSeleccionada("Categoría");
    setMenuCategoriasAbierto(false);

    onCambiarCategoria?.("");
  }

  function seleccionarDisponibilidad(disponibilidad) {
    setDisponibilidad(disponibilidad);
    setMenuDisponibilidadAbierto(false);

    onCambiarDisponibilidad?.(disponibilidad);
  }

  function mostrarTodasLasDisponibilidades() {
    setDisponibilidad("Disponibilidad");
    setMenuDisponibilidadAbierto(false);
    onCambiarDisponibilidad?.("");
  }

  return (
    <div className="filtrosContenedor">
      <div className="filtrarPor">
        <img className="iconoFiltro" src={iconoFiltro} alt="Filtros" />

        <p>Filtrar por</p>
      </div>

      <div className="filtrarPor">
        <p>Rango de precio</p>

        <button type="button" className="botonFlechaFiltro">
          <img src={flechaHaciaAbajo} alt="" />
        </button>
      </div>

      <div className="filtrarPor categoriaContenedor">
        <button
          type="button"
          className="botonCategoria"
          onClick={() =>
            setMenuCategoriasAbierto((estadoAnterior) => !estadoAnterior)
          }
        >
          <span>{categoriaSeleccionada}</span>

          <img
            className={`flechaCategoria ${
              menuCategoriasAbierto ? "flechaCategoriaAbierta" : ""
            }`}
            src={flechaHaciaAbajo}
            alt=""
          />
        </button>

        {menuCategoriasAbierto && (
          <div className="menuCategorias">
            <button
              type="button"
              className="opcionCategoria"
              onClick={mostrarTodasLasCategorias}
            >
              Todas las categorías
            </button>

            {cargandoCategorias && (
              <p className="mensajeCategorias">Cargando...</p>
            )}

            {errorCategorias && (
              <p className="errorCategorias">{errorCategorias}</p>
            )}

            {!cargandoCategorias &&
              !errorCategorias &&
              categorias.map((categoria) => (
                <button
                  type="button"
                  className="opcionCategoria"
                  key={categoria.slug}
                  onClick={() => seleccionarCategoria(categoria)}
                >
                  {categoria.name}
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="filtrarPor disponibilidad">
        <button
          type="button"
          className="botonFlechaFiltro"
          onClick={() =>
            setMenuDisponibilidadAbierto((estadoAnterior) => !estadoAnterior)
          }
        >
          <span>{disponibilidad}</span>

          <img src={flechaHaciaAbajo} alt="" />
        </button>

        {menuDisponibilidadAbierto && (
          <div className="menuCategorias">
            <button
              type="button"
              className="opcionCategoria"
              onClick={mostrarTodasLasDisponibilidades}
            >
              Todas las disponibilidad
            </button>

            <button
              type="button"
              className="opcionCategoria"
              key="disponible"
              onClick={() => seleccionarDisponibilidad("disponible")}
            >
              Disponible
            </button>

            <button
              type="button"
              className="opcionCategoria"
              key="No disponible"
              onClick={() => seleccionarDisponibilidad("No disponible")}
            >
              No disponible
            </button>
          </div>
        )}
      </div>

      <button type="button" className="filtrarPor accionFiltro">
        Limpiar filtros
      </button>

      <button type="button" className="filtrarPor accionFiltro">
        Agregar producto
      </button>
    </div>
  );
}

export default BarraDeFiltros;
