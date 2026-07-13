const LOGIN_URL = "https://dummyjson.com/auth/login";
const SEARCH_URL = "https://dummyjson.com/users/search";

export async function loginUser(email, password) {
  const searchResponse = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(email)}`);
  const searchData = await searchResponse.json();

  const usuarioEncontrado = searchData.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
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