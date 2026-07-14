import {
  useEffect,
  useMemo,
  useState,
} from "react";

const LIMITES_PERMITIDOS = [10, 20, 40, 50];

function obtenerPaginaDesdeUrl() {
  const parametros = new URLSearchParams(
    window.location.search,
  );

  const pagina = Number(
    parametros.get("page"),
  );

  if (
    !Number.isInteger(pagina) ||
    pagina < 1
  ) {
    return 1;
  }

  return pagina;
}

function obtenerLimiteDesdeUrl() {
  const parametros = new URLSearchParams(
    window.location.search,
  );

  const limite = Number(
    parametros.get("limit"),
  );

  if (
    !LIMITES_PERMITIDOS.includes(limite)
  ) {
    return 10;
  }

  return limite;
}

function actualizarPaginacionUrl(
  pagina,
  limite,
  reemplazar = false,
) {
  const url = new URL(
    window.location.href,
  );

  url.searchParams.set(
    "page",
    pagina.toString(),
  );

  url.searchParams.set(
    "limit",
    limite.toString(),
  );

  if (reemplazar) {
    window.history.replaceState(
      {},
      "",
      url.toString(),
    );
  } else {
    window.history.pushState(
      {},
      "",
      url.toString(),
    );
  }
}

function usePaginacion(productos) {
  const [paginaActual, setPaginaActual] =
    useState(obtenerPaginaDesdeUrl);

  const [
    productosPorPagina,
    setProductosPorPagina,
  ] = useState(obtenerLimiteDesdeUrl);

  const totalPaginas = Math.ceil(
    productos.length / productosPorPagina,
  );

  const indiceInicial =
    (paginaActual - 1) *
    productosPorPagina;

  const indiceFinal =
    indiceInicial + productosPorPagina;

  const productosPaginados = useMemo(() => {
    return productos.slice(
      indiceInicial,
      indiceFinal,
    );
  }, [
    productos,
    indiceInicial,
    indiceFinal,
  ]);

  const primerRegistro =
    productos.length === 0
      ? 0
      : indiceInicial + 1;

  const ultimoRegistro = Math.min(
    indiceFinal,
    productos.length,
  );

  useEffect(() => {
    function manejarCambioHistorial() {
      setPaginaActual(
        obtenerPaginaDesdeUrl(),
      );

      setProductosPorPagina(
        obtenerLimiteDesdeUrl(),
      );
    }

    window.addEventListener(
      "popstate",
      manejarCambioHistorial,
    );

    return () => {
      window.removeEventListener(
        "popstate",
        manejarCambioHistorial,
      );
    };
  }, []);

  useEffect(() => {
    if (totalPaginas === 0) {
      if (paginaActual !== 1) {
        setPaginaActual(1);

        actualizarPaginacionUrl(
          1,
          productosPorPagina,
          true,
        );
      }

      return;
    }

    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);

      actualizarPaginacionUrl(
        totalPaginas,
        productosPorPagina,
        true,
      );
    }
  }, [
    paginaActual,
    totalPaginas,
    productosPorPagina,
  ]);

  function reiniciarPaginacion() {
    setPaginaActual(1);

    actualizarPaginacionUrl(
      1,
      productosPorPagina,
      true,
    );
  }

  function cambiarPagina(nuevaPagina) {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas ||
      nuevaPagina === paginaActual
    ) {
      return;
    }

    setPaginaActual(nuevaPagina);

    actualizarPaginacionUrl(
      nuevaPagina,
      productosPorPagina,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cambiarProductosPorPagina(
    nuevoLimite,
  ) {
    if (
      !LIMITES_PERMITIDOS.includes(
        nuevoLimite,
      )
    ) {
      return;
    }

    setProductosPorPagina(nuevoLimite);
    setPaginaActual(1);

    actualizarPaginacionUrl(
      1,
      nuevoLimite,
    );
  }

  return {
    paginaActual,
    productosPorPagina,
    productosPaginados,
    totalPaginas,
    primerRegistro,
    ultimoRegistro,
    cambiarPagina,
    cambiarProductosPorPagina,
    reiniciarPaginacion,
  };
}

export default usePaginacion;