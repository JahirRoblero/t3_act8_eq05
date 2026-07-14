const LIMITES_PERMITIDOS = [10, 20, 40, 50];

function BuscadorProductos({
  textoBusqueda,
  productosPorPagina,
  onCambiarBusqueda,
  onCambiarProductosPorPagina,
}) {
  return (
    <div className="controlesBusquedaPaginacion">
      <label className="grupoControlTabla">
        <span>Buscar producto</span>

        <input
          type="search"
          value={textoBusqueda}
          placeholder="Buscar por nombre..."
          onChange={(evento) => onCambiarBusqueda(evento.target.value)}
        />
      </label>

      <label className="grupoControlTabla">
        <span>Registros por página</span>

        <select
          value={productosPorPagina}
          onChange={(evento) =>
            onCambiarProductosPorPagina(Number(evento.target.value))
          }
        >
          {LIMITES_PERMITIDOS.map((limite) => (
            <option key={limite} value={limite}>
              {limite}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default BuscadorProductos;