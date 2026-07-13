const URL_PRODUCTOS = "https://dummyjson.com/products";

async function validarRespuesta(respuesta, mensajeError) {
  if (!respuesta.ok) {
    let mensajeApi = "";

    try {
      const datosError = await respuesta.json();
      mensajeApi = datosError.message || datosError.error || "";
    } catch {
      mensajeApi = "";
    }

    throw new Error(mensajeApi || mensajeError);
  }

  return respuesta.json();
}

export async function obtenerProductos() {
  const respuesta = await fetch(`${URL_PRODUCTOS}?limit=0`);

  return validarRespuesta(
    respuesta,
    "No se pudieron obtener los productos.",
  );
}

export async function crearProductoApi(producto) {
  const respuesta = await fetch(`${URL_PRODUCTOS}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });

  return validarRespuesta(
    respuesta,
    "No se pudo agregar el producto.",
  );
}

export async function actualizarProductoApi(
  idProducto,
  datosActualizados,
) {
  const respuesta = await fetch(`${URL_PRODUCTOS}/${idProducto}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosActualizados),
  });

  return validarRespuesta(
    respuesta,
    "No se pudo actualizar el producto.",
  );
}

export async function eliminarProductoApi(idProducto) {
  const respuesta = await fetch(`${URL_PRODUCTOS}/${idProducto}`, {
    method: "DELETE",
  });

  return validarRespuesta(
    respuesta,
    "No se pudo eliminar el producto.",
  );
}