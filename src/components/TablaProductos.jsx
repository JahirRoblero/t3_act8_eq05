import FilaProducto from "./FilaProducto.jsx";
import "./TablaProductos.css";

function TablaProductos({ productos, onEditar, onEliminar }) {
  return (
    <section className="listaProductos">
      <div className="cabezaTabla">
        <p className="textoEncabezadoTabla">ID</p>
        <p className="textoEncabezadoTabla">Producto</p>
        <p className="textoEncabezadoTabla">Categoría</p>
        <p className="textoEncabezadoTabla">Precio</p>
        <p className="textoEncabezadoTabla">Stock</p>
        <p className="textoEncabezadoTabla">Acciones</p>
      </div>

      {productos.length > 0 ? (
        productos.map((producto) => (
          <FilaProducto
            key={producto.id}
            producto={producto}
            onEditar={onEditar}
            onEliminar={onEliminar}
          />
        ))
      ) : (
        <p className="mensajeSinProductos">
          No se encontraron productos con esos filtros.
        </p>
      )}
    </section>
  );
}

export default TablaProductos;