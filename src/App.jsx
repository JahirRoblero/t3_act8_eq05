import { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import BarraDeFiltros from "./components/BarraDeFiltros.jsx";
import TablaProductos from "./components/TablaProductos.jsx";
import EditarProductoModal from "./components/EditarProductoModal.jsx";
import AgregarProductoModal from "./components/AgregarProductoModal.jsx";

import { obtenerProductos } from "./services/api.js";

function App() {
  const [persona, setPersona] = useState(null);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState("");

  const [productoEditando, setProductoEditando] = useState(null);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] =
    useState("");

  const [rangoPrecio, setRangoPrecio] = useState({
    minimo: null,
    maximo: null,
  });

  const [paginaActual, setPaginaActual] = useState(1);

  const productosPorPagina = 10;

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
    setPaginaActual(1);
  }, [
    categoriaSeleccionada,
    disponibilidadSeleccionada,
    rangoPrecio.minimo,
    rangoPrecio.maximo,
  ]);

  const productosFiltrados = productos.filter((producto) => {
    const cumpleCategoria =
      categoriaSeleccionada === "" ||
      producto.category === categoriaSeleccionada;

    const estaDisponible = producto.stock > 0;

    const cumpleDisponibilidad =
      disponibilidadSeleccionada === "" ||
      (disponibilidadSeleccionada === "disponible" && estaDisponible) ||
      (disponibilidadSeleccionada === "No disponible" && !estaDisponible);

    const cumplePrecioMinimo =
      rangoPrecio.minimo === null || producto.price >= rangoPrecio.minimo;

    const cumplePrecioMaximo =
      rangoPrecio.maximo === null || producto.price <= rangoPrecio.maximo;

    return (
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
    setPaginaActual((paginaAnterior) => {
      if (totalPaginas === 0) {
        return 1;
      }

      return Math.min(paginaAnterior, totalPaginas);
    });
  }, [totalPaginas]);

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

  function agregarProducto(nuevoProducto) {
    setProductos((productosAnteriores) => {
      const idMaximo = productosAnteriores.reduce(
        (maximo, producto) => Math.max(maximo, producto.id),
        0,
      );

      const productoConId = {
        ...nuevoProducto,
        id: idMaximo + 1,
      };

      return [...productosAnteriores, productoConId];
    });

    setModalAgregarAbierto(false);
  }

  function alIniciarSesion(datosUsuario) {
    console.log("Usuario recibido:", datosUsuario);
    setPersona(datosUsuario);
  }

  function cerrarSesion() {
    setPersona(null);
    setSidebarAbierto(false);
    setProductoEditando(null);
    setModalAgregarAbierto(false);
  }

  function abrirModalEditar(producto) {
    setProductoEditando(producto);
  }

  function cerrarModalEditar() {
    setProductoEditando(null);
  }

  function guardarProductoEditado(datosActualizados) {
    if (!productoEditando) {
      return;
    }

    setProductos((productosAnteriores) =>
      productosAnteriores.map((producto) => {
        if (producto.id === productoEditando.id) {
          return {
            ...producto,
            ...datosActualizados,
          };
        }

        return producto;
      }),
    );

    setProductoEditando(null);
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
      confirmButtonColor: "rgb(255, 174, 0)",
      cancelButtonColor: "#000000",
    });

    if (!resultado.isConfirmed) {
      return;
    }

    setProductos((productosAnteriores) =>
      productosAnteriores.filter((producto) => producto.id !== idProducto),
    );

    await Swal.fire({
      title: "Producto eliminado",
      text: "El producto se eliminó correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "orange"
    });
  }

  function cambiarPagina(nuevaPagina) {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
      return;
    }

    setPaginaActual(nuevaPagina);
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

    return [1, "...", paginaActual, "...", totalPaginas];
  }

  if (!persona) {
    return <Login onLoginExitoso={alIniciarSesion} />;
  }

  const nombreCompleto =
    `${persona.firstName || ""} ${persona.lastName || ""}`.trim() ||
    persona.username ||
    "Usuario";

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
        <Navbar
          nombreUsuario={nombreCompleto}
          imagenPerfil={persona.image}
          onAbrirSidebar={abrirSidebar}
          onCerrarSesion={cerrarSesion}
        />

        <main className="contenidoPagina">
          <h1>Lista de productos</h1>

          <BarraDeFiltros
            onCambiarCategoria={setCategoriaSeleccionada}
            onCambiarDisponibilidad={setDisponibilidadSeleccionada}
            onCambiarRangoPrecio={setRangoPrecio}
            onAgregarProducto={abrirModalAgregar}
          />

          {cargandoProductos && (
            <p className="mensajeProductos">Cargando productos...</p>
          )}

          {errorProductos && <p className="errorProductos">{errorProductos}</p>}

          {!cargandoProductos && !errorProductos && (
            <>
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
                      <span className="puntosIndices" key={`puntos-${indice}`}>
                        ...
                      </span>
                    ) : (
                      <button
                        type="button"
                        key={pagina}
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
        </main>
      </div>
    </div>
  );
}

export default App;
