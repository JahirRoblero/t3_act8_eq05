import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import {
  obtenerProductos,
  crearProductoApi,
  actualizarProductoApi,
  eliminarProductoApi,
} from "../services/productosApi.js";

function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] =
    useState(true);

  const [errorProductos, setErrorProductos] = useState("");

  useEffect(() => {
    async function cargarProductos() {
      setCargandoProductos(true);
      setErrorProductos("");

      try {
        const datos = await obtenerProductos();

        const listaProductos = Array.isArray(datos)
          ? datos
          : datos.products ?? [];

        setProductos(listaProductos);
      } catch (error) {
        console.error(
          "Error al obtener productos:",
          error,
        );

        setErrorProductos(
          "No se pudieron cargar los productos.",
        );
      } finally {
        setCargandoProductos(false);
      }
    }

    cargarProductos();
  }, []);

  async function agregarProducto(nuevoProducto) {
    try {
      const respuestaApi =
        await crearProductoApi(nuevoProducto);

      setProductos((productosAnteriores) => {
        const idMaximo = productosAnteriores.reduce(
          (maximo, producto) =>
            Math.max(
              maximo,
              Number(producto.id) || 0,
            ),
          0,
        );

        const idRespuesta =
          Number(respuestaApi?.id) || 0;

        const productoCreado = {
          ...nuevoProducto,
          ...respuestaApi,
          id: Math.max(
            idMaximo + 1,
            idRespuesta,
          ),
        };

        return [
          ...productosAnteriores,
          productoCreado,
        ];
      });

      await Swal.fire({
        title: "Producto agregado",
        text: "El producto se agregó correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });

      return true;
    } catch (error) {
      console.error(
        "Error al agregar producto:",
        error,
      );

      await Swal.fire({
        title: "Error",
        text: "No se pudo agregar el producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });

      return false;
    }
  }

  async function editarProducto(
    productoEditando,
    datosActualizados,
  ) {
    if (!productoEditando) {
      return false;
    }

    const confirmacion = await Swal.fire({
      title: "¿Guardar cambios?",
      text: `Se modificará el producto "${
        productoEditando.title || "seleccionado"
      }".`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "orange",
      cancelButtonColor: "#000000",
    });

    if (!confirmacion.isConfirmed) {
      return false;
    }

    try {
      const respuestaApi =
        await actualizarProductoApi(
          productoEditando.id,
          datosActualizados,
        );

      setProductos((productosAnteriores) =>
        productosAnteriores.map((producto) => {
          if (
            producto.id !== productoEditando.id
          ) {
            return producto;
          }

          return {
            ...producto,
            ...datosActualizados,
            ...respuestaApi,
            id: productoEditando.id,
          };
        }),
      );

      await Swal.fire({
        title: "Producto actualizado",
        text: "Los cambios se guardaron correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });

      return true;
    } catch (error) {
      console.error(
        "Error al editar producto:",
        error,
      );

      await Swal.fire({
        title: "Error",
        text: "No se pudo editar el producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });

      return false;
    }
  }

  async function eliminarProducto(idProducto) {
    const productoEncontrado = productos.find(
      (producto) => producto.id === idProducto,
    );

    const confirmacion = await Swal.fire({
      title: "¿Eliminar producto?",
      text: `¿Seguro que quieres eliminar "${
        productoEncontrado?.title ||
        "este producto"
      }"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "orange",
      cancelButtonColor: "#000000",
    });

    if (!confirmacion.isConfirmed) {
      return false;
    }

    try {
      await eliminarProductoApi(idProducto);

      setProductos((productosAnteriores) =>
        productosAnteriores.filter(
          (producto) =>
            producto.id !== idProducto,
        ),
      );

      await Swal.fire({
        title: "Producto eliminado",
        text: "El producto se eliminó correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });

      return true;
    } catch (error) {
      console.error(
        "Error al eliminar producto:",
        error,
      );

      await Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "orange",
      });

      return false;
    }
  }

  return {
    productos,
    cargandoProductos,
    errorProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  };
}

export default useProductos;