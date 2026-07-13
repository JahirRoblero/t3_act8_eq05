import { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import BarraDeFiltros from "./components/BarraDeFiltros.jsx";
import TablaProductos from "./components/TablaProductos.jsx";
import EditarProductoModal from "./components/EditarProductoModal.jsx";

import { obtenerProductos } from "./services/api.js";

function App() {
  // Usuario que inició sesión
  const [persona, setPersona] = useState(null);

  // Sidebar para teléfonos
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // Productos obtenidos de la API
  const [productos, setProductos] = useState([]);

  // Producto que se está editando
  const [productoEditando, setProductoEditando] = useState(null);

  // Estados de carga y error
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState("");

  // Filtros
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] =
    useState("");

  const [rangoPrecio, setRangoPrecio] = useState({
    minimo: null,
    maximo: null,
  });

  // Cargar productos cuando se monta App
  useEffect(() => {
    async function cargarProductos() {
      setCargandoProductos(true);
      setErrorProductos("");

      try {
        const datos = await obtenerProductos();

        // Funciona tanto si la API devuelve:
        // { products: [...] }
        // como si devuelve directamente [...]
        setProductos(datos.products ?? datos);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setErrorProductos("No se pudieron cargar los productos.");
      } finally {
        setCargandoProductos(false);
      }
    }

    cargarProductos();
  }, []);

  // -------------------------
  // SIDEBAR
  // -------------------------

  function abrirSidebar() {
    setSidebarAbierto(true);
  }

  function cerrarSidebar() {
    setSidebarAbierto(false);
  }

  // -------------------------
  // LOGIN
  // -------------------------

  function alIniciarSesion(datosUsuario) {
    console.log("Usuario recibido:", datosUsuario);
    setPersona(datosUsuario);
  }

  function cerrarSesion() {
    setPersona(null);
    setSidebarAbierto(false);
    setProductoEditando(null);
  }

  // -------------------------
  // EDITAR PRODUCTO
  // -------------------------

  function abrirModalEditar(producto) {
    const confirmarEdicion = window.confirm(
      `¿Quieres editar el producto "${producto.title}"?`,
    );

    if (!confirmarEdicion) {
      return;
    }

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

    // Cerrar modal después de guardar
    setProductoEditando(null);
  }

  // -------------------------
  // ELIMINAR PRODUCTO
  // -------------------------

  function eliminarProducto(idProducto) {
    const productoEncontrado = productos.find(
      (producto) => producto.id === idProducto,
    );

    const confirmarEliminacion = window.confirm(
      `¿Seguro que quieres eliminar "${
        productoEncontrado?.title || "este producto"
      }"?`,
    );

    if (!confirmarEliminacion) {
      return;
    }

    setProductos((productosAnteriores) =>
      productosAnteriores.filter(
        (producto) => producto.id !== idProducto,
      ),
    );
  }

  // -------------------------
  // FILTRAR PRODUCTOS
  // -------------------------

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
      rangoPrecio.minimo === null ||
      producto.price >= rangoPrecio.minimo;

    const cumplePrecioMaximo =
      rangoPrecio.maximo === null ||
      producto.price <= rangoPrecio.maximo;

    return (
      cumpleCategoria &&
      cumpleDisponibilidad &&
      cumplePrecioMinimo &&
      cumplePrecioMaximo
    );
  });

  // Si no hay usuario, mostrar login
  if (!persona) {
    return <Login onLoginExitoso={alIniciarSesion} />;
  }

  const nombreCompleto =
    `${persona.firstName || ""} ${persona.lastName || ""}`.trim() ||
    persona.username ||
    "Usuario";

  return (
    <div className="layoutSistema">
      <Sidebar
        abierto={sidebarAbierto}
        onCerrar={cerrarSidebar}
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
          <h1>Lista de productos</h1>

          <BarraDeFiltros
            onCambiarCategoria={setCategoriaSeleccionada}
            onCambiarDisponibilidad={setDisponibilidadSeleccionada}
            onCambiarRangoPrecio={setRangoPrecio}
          />

          {cargandoProductos && (
            <p className="mensajeProductos">Cargando productos...</p>
          )}

          {errorProductos && (
            <p className="errorProductos">{errorProductos}</p>
          )}

          {!cargandoProductos && !errorProductos && (
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
                productosFiltrados.map((producto) => (
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
          )}

          {productoEditando && (
            <EditarProductoModal
              producto={productoEditando}
              clickGuardar={guardarProductoEditado}
              clickCancelar={cerrarModalEditar}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;