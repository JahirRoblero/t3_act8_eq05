import "./TablaProductos.css";

function TablaProductos({ id, nombreProducto, categoria, precio, stock }) {
  return (
    <div className="contenidoTabla">
      <p className="datosProducto">{id}</p>
      <p className="datosProducto">{nombreProducto}</p>
      <p className="datosProducto">{categoria}</p>
      <p className="datosProducto">{precio}</p>
      <p className="datosProducto">{stock}</p>
      <div className="botones">
        <button className="botonEditar">Editar</button>
        <button className="botonEliminar">Eliminar</button>
      </div>
    </div>
  );
}

export default TablaProductos;
