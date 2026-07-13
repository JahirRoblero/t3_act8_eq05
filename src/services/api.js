const API_URL = "https://dummyjson.com/auth/login";

export async function loginUser(username, password) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Usuario o contraseña incorrectos");
  }

  return data;
}