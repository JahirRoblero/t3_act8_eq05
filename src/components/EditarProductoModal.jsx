import { useEffect, useState } from "react";
import "./EditarProductoModal.css";
import iconField from "../assets/icons/field.svg";
import iconTr from "../assets/icons/triangle.svg"
import iconPrice from "../assets/icons/prce.svg"
import iconStock from "../assets/icons/stock.svg"

function EditarProductoModal({
  producto,
  clickGuardar,
  clickCancelar,
}) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [marca, setMarca] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (producto) {
      setNombre(producto.title || producto.nombre || "");
      setCategoria(producto.category || producto.categoria || "");
      setPrecio(producto.price ?? producto.precio ?? "");
      setStock(producto.stock ?? "");
      setMarca(producto.brand || producto.marca || "");
      setDescripcion(producto.description || producto.descripcion || "");
    }
  }, [producto]);

  function manejarGuardar(e) {
    e.preventDefault();

    clickGuardar({
      title: nombre,
      category: categoria,
      price: Number(precio),
      stock: Number(stock),
      brand: marca,
      description: descripcion,
    });
  }

  return (
    <div className="modalFondo">
      <div className="modalCard">
        <div className="modalHeader">
          <div>
            <h2>Editar producto</h2>
            <p>Modifica la información del producto</p>
          </div>

          <button
            type="button"
            className="modalCerrar"
            onClick={clickCancelar}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="modalDivider" />

        <form onSubmit={manejarGuardar}>
          <div className="modalCampo">
            <label htmlFor="nombreProducto">Nombre del producto</label>
            <div className="loginInputConIcono">
            <img src={iconField} alt="" className="loginIcono" />      
            <input
              type="text"
              id="nombreProducto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Essence Mascara Lash Princess"
              required
            />
            </div>
          </div>

          <div className="modalCampo">
            <label htmlFor="categoria">Categoría</label>
            <div className="loginInputConIcono">
            <img src={iconTr} alt="" className="loginIcono" />      
            <input
              type="text"
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Belleza"
              required
            />
            </div>
          </div>

          <div className="modalFila">
            <div className="modalCampo modalCampoMitad">
              <label htmlFor="precio">Precio</label>
              <div className="loginInputConIcono">
              <img src={iconPrice} alt="" className="loginIcono" />      
              <input
                type="number"
                id="precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="9.99"
                min="0"
                step="0.01"
                required
              />
              </div>
            </div>

            <div className="modalCampo modalCampoMitad">
              <label htmlFor="stock">Stock</label>
              <div className="loginInputConIcono">
              <img src={iconTr} alt="" className="loginIcono" />      
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="99"
                min="0"
                required
              />
              </div>
            </div>
          </div>

          <div className="modalCampo">
            <label htmlFor="marca">Marca</label>
            <div className="loginInputConIcono">
            <img src={iconField} alt="" className="loginIcono" />      
            <input
              type="text"
              id="marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="Essence"
            />
            </div>
          </div>

          <div className="modalCampo">
            <label htmlFor="descripcion">Descripción</label>

            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Máscara para pestañas con efecto de volumen."
              rows={3}
            />
          </div>

          <div className="modalBotones">
            <button
              type="button"
              className="modalBotonCancelar"
              onClick={clickCancelar}
            >
              Cancelar
            </button>

            <button type="submit" className="modalBotonGuardar">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarProductoModal;