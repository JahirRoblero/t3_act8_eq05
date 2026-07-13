import "./TablaProductos.css";

function TablaProductos({
  producto,
  onEditar,
  onEliminar,
}) {
  return (
    <div className="contenidoTabla">
      <p className="datosProducto">{producto.id}</p>

      <p className="datosProducto">
        {producto.title}
      </p>

      <p className="datosProducto">
        {producto.category}
      </p>

      <p className="datosProducto">
        ${producto.price}
      </p>

      <p className="datosProducto">
        {producto.stock}
      </p>

      <div className="botones">
        <button
          type="button"
          className="botonEditar"
          onClick={() => onEditar(producto)}
        >
          Editar
        </button>

        <button
          type="button"
          className="botonEliminar"
          onClick={() => onEliminar(producto.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default TablaProductos;