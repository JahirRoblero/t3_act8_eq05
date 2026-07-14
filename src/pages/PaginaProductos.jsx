import { useState } from "react";

import BarraDeFiltros from "../components/BarraDeFiltros.jsx";
import BuscadorProductos from "../components/BuscadorProductos.jsx";
import TablaProductos from "../components/TablaProductos.jsx";
import Paginacion from "../components/Paginacion.jsx";
import EditarProductoModal from "../components/EditarProductoModal.jsx";
import AgregarProductoModal from "../components/AgregarProductoModal.jsx";

import useProductos from "../hooks/useProductos.js";
import useFiltros from "../hooks/useFiltros.js";
import usePaginacion from "../hooks/usePaginacion.js";

function PaginaProductos() {
  const {
    productos,
    cargandoProductos,
    errorProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  } = useProductos();

  const {
    textoBusqueda,
    cambiarTextoBusqueda,
    cambiarCategoria,
    cambiarDisponibilidad,
    cambiarRangoPrecio,
    productosFiltrados,
  } = useFiltros(productos);

  const {
    paginaActual,
    productosPorPagina,
    productosPaginados,
    totalPaginas,
    primerRegistro,
    ultimoRegistro,
    cambiarPagina,
    cambiarProductosPorPagina,
    reiniciarPaginacion,
  } = usePaginacion(productosFiltrados);

  const [productoEditando, setProductoEditando] = useState(null);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);

  function manejarCambioBusqueda(nuevoTexto) {
    cambiarTextoBusqueda(nuevoTexto);
    reiniciarPaginacion();
  }

  function manejarCambioCategoria(nuevaCategoria) {
    cambiarCategoria(nuevaCategoria);
    reiniciarPaginacion();
  }

  function manejarCambioDisponibilidad(nuevaDisponibilidad) {
    cambiarDisponibilidad(nuevaDisponibilidad);
    reiniciarPaginacion();
  }

  function manejarCambioRangoPrecio(nuevoRango) {
    cambiarRangoPrecio(nuevoRango);
    reiniciarPaginacion();
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

  async function guardarProductoNuevo(datosProducto) {
    const productoGuardado = await agregarProducto(datosProducto);

    if (productoGuardado) {
      cerrarModalAgregar();
    }
  }

  async function guardarProductoEditado(datosActualizados) {
    const productoGuardado = await editarProducto(
      productoEditando,
      datosActualizados,
    );

    if (productoGuardado) {
      cerrarModalEditar();
    }
  }

  return (
    <section className="paginaProductos">
      <h1>Lista de productos</h1>

      <BuscadorProductos
        textoBusqueda={textoBusqueda}
        productosPorPagina={productosPorPagina}
        onCambiarBusqueda={manejarCambioBusqueda}
        onCambiarProductosPorPagina={cambiarProductosPorPagina}
      />

      <BarraDeFiltros
        onCambiarCategoria={manejarCambioCategoria}
        onCambiarDisponibilidad={manejarCambioDisponibilidad}
        onCambiarRangoPrecio={manejarCambioRangoPrecio}
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

          <TablaProductos
            productos={productosPaginados}
            onEditar={abrirModalEditar}
            onEliminar={eliminarProducto}
          />

          {totalPaginas > 1 && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onCambiarPagina={cambiarPagina}
            />
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
          clickGuardar={guardarProductoNuevo}
          clickCancelar={cerrarModalAgregar}
        />
      )}
    </section>
  );
}

export default PaginaProductos;