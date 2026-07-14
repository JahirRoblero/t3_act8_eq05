function Paginacion({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}) {
  function generarPaginas() {
    if (totalPaginas <= 5) {
      return Array.from(
        { length: totalPaginas },
        (_, indice) => indice + 1,
      );
    }

    if (paginaActual <= 3) {
      return [1, 2, 3, "...", totalPaginas];
    }

    if (paginaActual >= totalPaginas - 2) {
      return [
        1,
        "...",
        totalPaginas - 2,
        totalPaginas - 1,
        totalPaginas,
      ];
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

  return (
    <div className="indices">
      <button
        type="button"
        className="botonIndice"
        disabled={paginaActual === 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        aria-label="Página anterior"
      >
        &lt;
      </button>

      {generarPaginas().map((pagina, indice) => {
        if (pagina === "...") {
          return (
            <span
              className="puntosIndices"
              key={`puntos-${indice}`}
            >
              ...
            </span>
          );
        }

        return (
          <button
            type="button"
            key={pagina}
            className={`botonIndice ${
              paginaActual === pagina ? "indiceActivo" : ""
            }`}
            onClick={() => onCambiarPagina(pagina)}
          >
            {pagina}
          </button>
        );
      })}

      <button
        type="button"
        className="botonIndice"
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        aria-label="Página siguiente"
      >
        &gt;
      </button>
    </div>
  );
}

export default Paginacion;