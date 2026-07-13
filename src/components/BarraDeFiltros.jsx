import { useEffect, useState } from "react";
import iconoFiltro from "../assets/icons/iconoFiltro.svg";
import flechaHaciaAbajo from "../assets/images/flechaHaciaAbajo.svg";
import { obtenerCategorias } from "../services/api.js";
import "./BarraDeFiltros.css";

function BarraDeFiltros({
  onCambiarCategoria,
  onCambiarDisponibilidad,
  onCambiarRangoPrecio,
  onAgregarProducto
}) {
  const [categorias, setCategorias] = useState([]);
  const [menuCategoriasAbierto, setMenuCategoriasAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Categoría");
  const [cargandoCategorias, setCargandoCategorias] = useState(false);
  const [errorCategorias, setErrorCategorias] = useState("");

  const [disponibilidad, setDisponibilidad] = useState("Disponibilidad");
  const [menuDisponibilidadAbierto, setMenuDisponibilidadAbierto] =
    useState(false);

  const [menuPrecioAbierto, setMenuPrecioAbierto] = useState(false);
  const [precioMinimo, setPrecioMinimo] = useState("");
  const [precioMaximo, setPrecioMaximo] = useState("");
  const [textoRangoPrecio, setTextoRangoPrecio] = useState("Rango de precio");
  const [errorPrecio, setErrorPrecio] = useState("");

 

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

  function aplicarRangoPrecio() {
    setErrorPrecio("");

    const minimo = precioMinimo === "" ? null : Number(precioMinimo);

    const maximo = precioMaximo === "" ? null : Number(precioMaximo);

    if (minimo === null && maximo === null) {
      setErrorPrecio("Ingresa al menos un precio");
      return;
    }

    if (minimo !== null && minimo < 0) {
      setErrorPrecio("El precio mínimo no puede ser negativo");
      return;
    }

    if (maximo !== null && maximo < 0) {
      setErrorPrecio("El precio máximo no puede ser negativo");
      return;
    }

    if (minimo !== null && maximo !== null && minimo > maximo) {
      setErrorPrecio("El precio mínimo no puede ser mayor al máximo");
      return;
    }

    if (minimo !== null && maximo !== null) {
      setTextoRangoPrecio(`$${minimo} - $${maximo}`);
    } else if (minimo !== null) {
      setTextoRangoPrecio(`Desde $${minimo}`);
    } else {
      setTextoRangoPrecio(`Hasta $${maximo}`);
    }

    onCambiarRangoPrecio?.({
      minimo,
      maximo,
    });

    setMenuPrecioAbierto(false);
  }

  function mostrarTodosLosPrecios() {
    setPrecioMinimo("");
    setPrecioMaximo("");
    setTextoRangoPrecio("Rango de precio");
    setErrorPrecio("");
    setMenuPrecioAbierto(false);

    onCambiarRangoPrecio?.({
      minimo: null,
      maximo: null,
    });
  }

  function limpiarFiltros() {
  setDisponibilidad("Disponibilidad");
  setCategoriaSeleccionada("Categoría");

  setPrecioMinimo("");
  setPrecioMaximo("");
  setTextoRangoPrecio("Rango de precio");
  setErrorPrecio("");

  setMenuPrecioAbierto(false);
  setMenuCategoriasAbierto(false);
  setMenuDisponibilidadAbierto(false);

  onCambiarCategoria?.("");
  onCambiarDisponibilidad?.("");

  onCambiarRangoPrecio?.({
    minimo: null,
    maximo: null,
  });
}

  return (
    <div className="filtrosContenedor">
      <div className="filtrarPor">
        <img className="iconoFiltro" src={iconoFiltro} alt="Filtros" />

        <p>Filtrar por</p>
      </div>

      <div className="filtrarPor precioContenedor">
        <button
          type="button"
          className="botonRangoPrecio"
          onClick={() =>
            setMenuPrecioAbierto((estadoAnterior) => !estadoAnterior)
          }
        >
          <span>{textoRangoPrecio}</span>

          <img
            className={`flechaCategoria ${
              menuPrecioAbierto ? "flechaCategoriaAbierta" : ""
            }`}
            src={flechaHaciaAbajo}
            alt=""
          />
        </button>

        {menuPrecioAbierto && (
          <div className="menuPrecio">
            <label className="campoPrecio">
              <span>Precio mínimo</span>

              <input
                type="number"
                min="0"
                placeholder="Ejemplo: 100"
                value={precioMinimo}
                onChange={(evento) => setPrecioMinimo(evento.target.value)}
              />
            </label>

            <label className="campoPrecio">
              <span>Precio máximo</span>

              <input
                type="number"
                min="0"
                placeholder="Ejemplo: 1000"
                value={precioMaximo}
                onChange={(evento) => setPrecioMaximo(evento.target.value)}
              />
            </label>

            {errorPrecio && <p className="errorPrecio">{errorPrecio}</p>}

            <div className="accionesPrecio">
              <button
                type="button"
                className="botonQuitarPrecio"
                onClick={mostrarTodosLosPrecios}
              >
                Todos
              </button>

              <button
                type="button"
                className="botonAplicarPrecio"
                onClick={aplicarRangoPrecio}
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
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

      <button
        type="button"
        className="filtrarPor accionFiltro"
        onClick={() => limpiarFiltros()}
      >
        Limpiar filtros
      </button>

      <button type="button" className="filtrarPor accionFiltro" onClick={onAgregarProducto}>
        Agregar producto
      </button>
    </div>
  );
}

export default BarraDeFiltros;
