import { useMemo, useState } from "react";

function useFiltros(productos) {
  const [textoBusqueda, setTextoBusqueda] =
    useState("");

  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada,
  ] = useState("");

  const [
    disponibilidadSeleccionada,
    setDisponibilidadSeleccionada,
  ] = useState("");

  const [rangoPrecio, setRangoPrecio] = useState({
    minimo: null,
    maximo: null,
  });

  function cambiarTextoBusqueda(nuevoTexto) {
    setTextoBusqueda(nuevoTexto);
  }

  function cambiarCategoria(nuevaCategoria) {
    setCategoriaSeleccionada(nuevaCategoria);
  }

  function cambiarDisponibilidad(
    nuevaDisponibilidad,
  ) {
    setDisponibilidadSeleccionada(
      nuevaDisponibilidad,
    );
  }

  function cambiarRangoPrecio(nuevoRango) {
    setRangoPrecio(nuevoRango);
  }

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const tituloProducto = String(
        producto.title ??
          producto.nombre ??
          "",
      ).toLowerCase();

      const textoNormalizado = textoBusqueda
        .trim()
        .toLowerCase();

      const cumpleBusqueda =
        textoNormalizado === "" ||
        tituloProducto.includes(textoNormalizado);

      const categoriaProducto = String(
        producto.category ?? "",
      )
        .trim()
        .toLowerCase();

      const categoriaNormalizada =
        categoriaSeleccionada
          .trim()
          .toLowerCase();

      const cumpleCategoria =
        categoriaNormalizada === "" ||
        categoriaProducto ===
          categoriaNormalizada;

      const estaDisponible =
        Number(producto.stock) > 0;

      const disponibilidadNormalizada =
        disponibilidadSeleccionada
          .trim()
          .toLowerCase();

      const cumpleDisponibilidad =
        disponibilidadNormalizada === "" ||
        (disponibilidadNormalizada ===
          "disponible" &&
          estaDisponible) ||
        (disponibilidadNormalizada ===
          "no disponible" &&
          !estaDisponible);

      const precioProducto =
        Number(producto.price) || 0;

      const cumplePrecioMinimo =
        rangoPrecio.minimo === null ||
        precioProducto >=
          Number(rangoPrecio.minimo);

      const cumplePrecioMaximo =
        rangoPrecio.maximo === null ||
        precioProducto <=
          Number(rangoPrecio.maximo);

      return (
        cumpleBusqueda &&
        cumpleCategoria &&
        cumpleDisponibilidad &&
        cumplePrecioMinimo &&
        cumplePrecioMaximo
      );
    });
  }, [
    productos,
    textoBusqueda,
    categoriaSeleccionada,
    disponibilidadSeleccionada,
    rangoPrecio,
  ]);

  return {
    textoBusqueda,
    categoriaSeleccionada,
    disponibilidadSeleccionada,
    rangoPrecio,
    productosFiltrados,
    cambiarTextoBusqueda,
    cambiarCategoria,
    cambiarDisponibilidad,
    cambiarRangoPrecio,
  };
}

export default useFiltros;