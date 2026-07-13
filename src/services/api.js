const LOGIN_URL = "https://dummyjson.com/auth/login";
const SEARCH_URL = "https://dummyjson.com/users/search";
const PRODUCTS_URL = "https://dummyjson.com/products";

export async function loginUser(email, password) {
  const searchResponse = await fetch(
    `${SEARCH_URL}?q=${encodeURIComponent(email)}`,
  );

  if (!searchResponse.ok) {
    throw new Error("No se pudo buscar al usuario");
  }

  const searchData = await searchResponse.json();

  const usuarioEncontrado = searchData.users.find(
    (usuario) =>
      usuario.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!usuarioEncontrado) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usuarioEncontrado.username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  return data;
}

export async function obtenerCategorias() {
  const respuesta = await fetch(`${PRODUCTS_URL}/categories`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las categorías");
  }

  return await respuesta.json();
}

export async function obtenerProductos() {
  const respuesta = await fetch(`${PRODUCTS_URL}?limit=0`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar los productos");
  }

  const datos = await respuesta.json();

  return datos.products;
}

export async function agregarProducto(producto) {
  const respuesta = await fetch("https://dummyjson.com/products/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo agregar el producto");
  }

  return respuesta.json();
}

export async function editarProducto(id, producto) {
  const respuesta = await fetch(
    `https://dummyjson.com/products/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    }
  );

  if (!respuesta.ok) {
    throw new Error("No se pudo editar el producto");
  }

  return respuesta.json();
}

export async function eliminarProducto(id) {
  const respuesta = await fetch(
    `https://dummyjson.com/products/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar el producto");
  }

  return respuesta.json();
}