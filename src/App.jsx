import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import BarraDeFiltros from "./components/BarraDeFiltros.jsx";
import TablaProductos from "./components/TablaProductos.jsx";
import EditarProductoModal from "./components/EditarProductoModal.jsx";
import AgregarProductoModal from "./components/AgregarProductoModal.jsx";

import {
  obtenerProductos,
  crearProductoApi,
  actualizarProductoApi,
  eliminarProductoApi,
} from "./services/productosApi.js";

const LIMITES_PERMITIDOS = [10, 20, 40, 50];

function obtenerPaginaDesdeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const pagina = Number(parametros.get("page"));

  if (!Number.isInteger(pagina) || pagina < 1) {
    return 1;
  }

  return pagina;
}

function obtenerLimiteDesdeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const limite = Number(parametros.get("limit"));

  if (!LIMITES_PERMITIDOS.includes(limite)) {
    return 10;
  }

  return limite;
}

function actualizarPaginacionUrl(pagina, limite, reemplazar = false) {
  const url = new URL(window.location.href);

  url.searchParams.set("page", pagina.toString());
  url.searchParams.set("limit", limite.toString());

  if (reemplazar) {
    window.history.replaceState({}, "", url.toString());
  } else {
    window.history.pushState({}, "", url.toString());
  }
}

function App() {
  const [persona, setPersona] = useState(null);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState("");

  const [productoEditando, setProductoEditando] = useState(null);

  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] =
    useState("");

  const [rangoPrecio, setRangoPrecio] = useState({
    minimo: null,
    maximo: null,
  });
  const [vistaActual, setVistaActual] = useState("inicio");
  const [paginaActual, setPaginaActual] = useState(obtenerPaginaDesdeUrl);
  const [productosPorPagina, setProductosPorPagina] = useState(
    obtenerLimiteDesdeUrl,
  );

  useEffect(() => {
    async function cargarProductos() {
      setCargandoProductos(true);
      setErrorProductos("");

      try {
        const datos = await obtenerProductos();

        const listaProductos = Array.isArray(datos)
          ? datos
          : (datos.products ?? []);

        setProductos(listaProductos);
      } catch (error) {
        console.error("Error al obtener productos:", error);

        setErrorProductos("No se pudieron cargar los productos.");
      } finally {
        setCargandoProductos(false);
      }
    }

    cargarProductos();
  }, []);

  useEffect(() => {
    function manejarCambioHistorial() {
      const nuevaPagina = obtenerPaginaDesdeUrl();
      const nuevoLimite = obtenerLimiteDesdeUrl();

      setPaginaActual(nuevaPagina);
      setProductosPorPagina(nuevoLimite);
    }
    window.addEventListener("popstate", manejarCambioHistorial);
    return () => {
      window.removeEventListener("popstate", manejarCambioHistorial);
    };
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const tituloProducto = String(
      producto.title ?? producto.nombre ?? "",
    ).toLowerCase();

    const textoNormalizado = textoBusqueda.trim().toLowerCase();

    const cumpleBusqueda =
      textoNormalizado === "" || tituloProducto.includes(textoNormalizado);

    const categoriaProducto = String(producto.category ?? "").toLowerCase();

    const categoriaNormalizada = categoriaSeleccionada.trim().toLowerCase();

    const cumpleCategoria =
      categoriaNormalizada === "" || categoriaProducto === categoriaNormalizada;

    const estaDisponible = Number(producto.stock) > 0;

    const disponibilidadNormalizada = disponibilidadSeleccionada
      .trim()
      .toLowerCase();

    const esFiltroDisponible = disponibilidadNormalizada === "disponible";

    const esFiltroNoDisponible =
      disponibilidadNormalizada === "no disponible" ||
      disponibilidadNormalizada === "no-disponible" ||
      disponibilidadNormalizada === "nodisponible";

    const cumpleDisponibilidad =
      disponibilidadNormalizada === "" ||
      (esFiltroDisponible && estaDisponible) ||
      (esFiltroNoDisponible && !estaDisponible);

    const precioProducto = Number(producto.price);

    const cumplePrecioMinimo =
      rangoPrecio.minimo === null ||
      rangoPrecio.minimo === "" ||
      precioProducto >= Number(rangoPrecio.minimo);

    const cumplePrecioMaximo =
      rangoPrecio.maximo === null ||
      rangoPrecio.maximo === "" ||
      precioProducto <= Number(rangoPrecio.maximo);

    return (
      cumpleBusqueda &&
      cumpleCategoria &&
      cumpleDisponibilidad &&
      cumplePrecioMinimo &&
      cumplePrecioMaximo
    );
  });

  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina,
  );

  const indiceInicial = (paginaActual - 1) * productosPorPagina;

  const indiceFinal = indiceInicial + productosPorPagina;

  const productosPaginados = productosFiltrados.slice(
    indiceInicial,
    indiceFinal,
  );

  useEffect(() => {
    if (totalPaginas === 0) {
      if (paginaActual !== 1) {
        setPaginaActual(1);

        actualizarPaginacionUrl(1, productosPorPagina, true);
      }

      return;
    }

    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);

      actualizarPaginacionUrl(totalPaginas, productosPorPagina, true);
    }
  }, [paginaActual, totalPaginas, productosPorPagina]);

  
  function reiniciarPaginacion() {
    setPaginaActual(1);

    actualizarPaginacionUrl(1, productosPorPagina, true);
  }

  function cambiarTextoBusqueda(evento) {
    setTextoBusqueda(evento.target.value);
    reiniciarPaginacion();
  }

  function cambiarCategoria(nuevaCategoria) {
    setCategoriaSeleccionada(nuevaCategoria);
    reiniciarPaginacion();
  }

  function cambiarDisponibilidad(nuevaDisponibilidad) {
    setDisponibilidadSeleccionada(nuevaDisponibilidad);

    reiniciarPaginacion();
  }

  function cambiarRangoPrecio(nuevoRango) {
    setRangoPrecio(nuevoRango);
    reiniciarPaginacion();
  }

  function abrirSidebar() {
    setSidebarAbierto(true);
  }

  function cerrarSidebar() {
    setSidebarAbierto(false);
  }

  function abrirModalAgregar() {
    setModalAgregarAbierto(true);
  }

  function cerrarModalAgregar() {
    setModalAgregarAbierto(false);
  }

  function abrirModalEditar(producto) {
    setProductoEditando(producto);
  }

  function cerrarModalEditar() {
    setProductoEditando(null);
  }

  function alIniciarSesion(datosUsuario) {
    setPersona(datosUsuario);
  }

  function cerrarSesion() {
    setPersona(null);
    setSidebarAbierto(false);
    setProductoEditando(null);
    setModalAgregarAbierto(false);
    setVistaActual("inicio");
  }

  function cambiarVista(nuevaVista) {
    setVistaActual(nuevaVista);

    setSidebarAbierto(false);
    setProductoEditando(null);
    setModalAgregarAbierto(false);
  }

  async function agregarProducto(nuevoProducto) {
    try {
      const respuestaApi = await crearProductoApi(nuevoProducto);

      setProductos((productosAnteriores) => {
        const idMaximo = productosAnteriores.reduce(
          (maximo, producto) => Math.max(maximo, Number(producto.id) || 0),
          0,
        );

        const idRespuesta = Number(respuestaApi.id) || 0;

        const productoCreado = {
          ...nuevoProducto,
          ...respuestaApi,
          id: Math.max(idMaximo + 1, idRespuesta),
        };

        return [...productosAnteriores, productoCreado];
      });

      setModalAgregarAbierto(false);

      await Swal.fire({
        title: "Producto agregado",
        text: "El producto se agregó correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });
    } catch (error) {
      console.error("Error al agregar producto:", error);

      await Swal.fire({
        title: "Error",
        text: "No se pudo agregar el producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });
    }
  }

  async function guardarProductoEditado(datosActualizados) {
    if (!productoEditando) {
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Guardar cambios?",
      text: `Se modificará el producto "${
        productoEditando.title || "seleccionado"
      }".`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "orange",
      cancelButtonColor: "#000000",
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const respuestaApi = await actualizarProductoApi(
        productoEditando.id,
        datosActualizados,
      );

      setProductos((productosAnteriores) =>
        productosAnteriores.map((producto) => {
          if (producto.id === productoEditando.id) {
            return {
              ...producto,
              ...datosActualizados,
              ...respuestaApi,
              id: productoEditando.id,
            };
          }

          return producto;
        }),
      );

      setProductoEditando(null);

      await Swal.fire({
        title: "Producto actualizado",
        text: "Los cambios se guardaron correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });
    } catch (error) {
      console.error("Error al editar producto:", error);

      await Swal.fire({
        title: "Error",
        text: "No se pudo editar el producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });
    }
  }

  async function eliminarProducto(idProducto) {
    const productoEncontrado = productos.find(
      (producto) => producto.id === idProducto,
    );

    const resultado = await Swal.fire({
      title: "¿Eliminar producto?",
      text: `¿Seguro que quieres eliminar "${
        productoEncontrado?.title || "este producto"
      }"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "orange",
      cancelButtonColor: "#000000",
    });

    if (!resultado.isConfirmed) {
      return;
    }

    try {
      await eliminarProductoApi(idProducto);

      setProductos((productosAnteriores) =>
        productosAnteriores.filter((producto) => producto.id !== idProducto),
      );

      await Swal.fire({
        title: "Producto eliminado",
        text: "El producto se eliminó correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);

      await Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });
    }
  }

  function cambiarPagina(nuevaPagina) {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas ||
      nuevaPagina === paginaActual
    ) {
      return;
    }

    setPaginaActual(nuevaPagina);

    actualizarPaginacionUrl(nuevaPagina, productosPorPagina, false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cambiarProductosPorPagina(evento) {
    const nuevoLimite = Number(evento.target.value);

    if (!LIMITES_PERMITIDOS.includes(nuevoLimite)) {
      return;
    }

    setProductosPorPagina(nuevoLimite);
    setPaginaActual(1);

    actualizarPaginacionUrl(1, nuevoLimite, false);
  }

  function generarIndicesPaginacion() {
    if (totalPaginas <= 5) {
      return Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
    }

    if (paginaActual <= 3) {
      return [1, 2, 3, "...", totalPaginas];
    }

    if (paginaActual >= totalPaginas - 2) {
      return [1, "...", totalPaginas - 2, totalPaginas - 1, totalPaginas];
    }

    return [
      1,
      "...",
      paginaActual - 1,
      paginaActual,
      paginaActual + 1,
      "...",
      totalPaginas,
    ];
  }

  if (!persona) {
    return <Login onLoginExitoso={alIniciarSesion} />;
  }

  const nombreCompleto =
    `${persona.firstName || ""} ${persona.lastName || ""}`.trim() ||
    persona.username ||
    "Usuario";

  const primerRegistro =
    productosFiltrados.length === 0 ? 0 : indiceInicial + 1;

  const ultimoRegistro = Math.min(indiceFinal, productosFiltrados.length);

  return (
    <div className="layoutSistema">
      <Sidebar
        abierto={sidebarAbierto}
        onCerrar={cerrarSidebar}
        vistaActual={vistaActual}
        onCambiarVista={cambiarVista}
      />

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
          {vistaActual === "inicio" && (
            <section className="paginaInicio">
              <h1>Bienvenido al sistema</h1>

              <div className="bienvenidaCentral">
                <h2>
                  Bienvenido a Gestión de
                  <br />
                  Productos
                </h2>
              </div>
            </section>
          )}

          {vistaActual === "productos" && (
            <section className="paginaProductos">
              <h1>Lista de productos</h1>

              <div className="controlesBusquedaPaginacion">
                <label className="grupoControlTabla">
                  <span>Buscar producto</span>

                  <input
                    type="search"
                    value={textoBusqueda}
                    placeholder="Buscar por nombre..."
                    onChange={cambiarTextoBusqueda}
                  />
                </label>

                <label className="grupoControlTabla">
                  <span>Registros por página</span>

                  <select
                    value={productosPorPagina}
                    onChange={cambiarProductosPorPagina}
                  >
                    <option value={10}>10</option>

                    <option value={20}>20</option>

                    <option value={40}>40</option>

                    <option value={50}>50</option>
                  </select>
                </label>
              </div>

              <BarraDeFiltros
                onCambiarCategoria={cambiarCategoria}
                onCambiarDisponibilidad={cambiarDisponibilidad}
                onCambiarRangoPrecio={cambiarRangoPrecio}
                onAgregarProducto={abrirModalAgregar}
              />

              {cargandoProductos && (
                <p className="mensajeProductos">Cargando productos...</p>
              )}

              {errorProductos && (
                <p className="errorProductos">{errorProductos}</p>
              )}

              {!cargandoProductos && !errorProductos && (
                <>
                  <div className="resumenPaginacion">
                    <p>
                      Mostrando {primerRegistro} - {ultimoRegistro} de{" "}
                      {productosFiltrados.length} productos
                    </p>

                    <p>
                      Página {paginaActual} de {totalPaginas || 1}
                    </p>
                  </div>

                  <section className="listaProductos">
                    <div className="cabezaTabla">
                      <p className="textoEncabezadoTabla">ID</p>

                      <p className="textoEncabezadoTabla">Producto</p>

                      <p className="textoEncabezadoTabla">Categoría</p>

                      <p className="textoEncabezadoTabla">Precio</p>

                      <p className="textoEncabezadoTabla">Stock</p>

                      <p className="textoEncabezadoTabla">Acciones</p>
                    </div>

                    {productosFiltrados.length > 0 ? (
                      productosPaginados.map((producto) => (
                        <TablaProductos
                          key={producto.id}
                          producto={producto}
                          onEditar={abrirModalEditar}
                          onEliminar={eliminarProducto}
                        />
                      ))
                    ) : (
                      <p className="mensajeSinProductos">
                        No se encontraron productos con esos filtros.
                      </p>
                    )}
                  </section>

                  {totalPaginas > 1 && (
                    <div className="indices">
                      <button
                        type="button"
                        className="botonIndice"
                        disabled={paginaActual === 1}
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        aria-label="Página anterior"
                      >
                        &lt;
                      </button>

                      {generarIndicesPaginacion().map((pagina, indice) =>
                        pagina === "..." ? (
                          <span
                            className="puntosIndices"
                            key={`puntos-${indice}`}
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            type="button"
                            key={`pagina-${pagina}`}
                            className={`botonIndice ${
                              paginaActual === pagina ? "indiceActivo" : ""
                            }`}
                            onClick={() => cambiarPagina(pagina)}
                          >
                            {pagina}
                          </button>
                        ),
                      )}

                      <button
                        type="button"
                        className="botonIndice"
                        disabled={paginaActual === totalPaginas}
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        aria-label="Página siguiente"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              )}

              {productoEditando && (
                <EditarProductoModal
                  producto={productoEditando}
                  clickGuardar={guardarProductoEditado}
                  clickCancelar={cerrarModalEditar}
                />
              )}

              {modalAgregarAbierto && (
                <AgregarProductoModal
                  clickGuardar={agregarProducto}
                  clickCancelar={cerrarModalAgregar}
                />
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
