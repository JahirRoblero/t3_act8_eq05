import { useState } from "react";
import TablaProductos from "./components/TablaProductos.jsx";
import EditarProductoModal from "./components/EditarProductoModal.jsx";

function ListaProductos() {
  const [productos, setProductos] = useState([
    {
      id: 1,
      title: "Essence Mascara Lash Princess",
      category: "beauty",
      price: 9.99,
      stock: 99,
      brand: "Essence",
      description: "Máscara para pestañas.",
    },
    {
      id: 2,
      title: "Eyeshadow Palette",
      category: "beauty",
      price: 19.99,
      stock: 34,
      brand: "Glamour Beauty",
      description: "Paleta de sombras.",
    },
  ]);

  const [productoEditando, setProductoEditando] = useState(null);

  function abrirModalEditar(producto) {
    setProductoEditando(producto);
  }

  function cerrarModalEditar() {
    setProductoEditando(null);
  }

  function guardarProductoEditado(datosActualizados) {
    setProductos((productosAnteriores) =>
      productosAnteriores.map((producto) =>
        producto.id === productoEditando.id
          ? {
              ...producto,
              ...datosActualizados,
            }
          : producto,
      ),
    );

    setProductoEditando(null);
  }

  function eliminarProducto(idProducto) {
    setProductos((productosAnteriores) =>
      productosAnteriores.filter(
        (producto) => producto.id !== idProducto,
      ),
    );
  }

  return (
    <>
      <div className="tablaProductos">
        {productos.map((producto) => (
          <TablaProductos
            key={producto.id}
            producto={producto}
            onEditar={abrirModalEditar}
            onEliminar={eliminarProducto}
          />
        ))}
      </div>

      {productoEditando && (
        <EditarProductoModal
          producto={productoEditando}
          clickGuardar={guardarProductoEditado}
          clickCancelar={cerrarModalEditar}
        />
      )}
    </>
  );
}

export default ListaProductos;