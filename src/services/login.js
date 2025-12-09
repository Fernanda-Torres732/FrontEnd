export async function login(usuario, password, tipo) {
  const response = await fetch("https://reservas-4472428832.us-central1.run.app/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario,
      password,
      tipo
    }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Error en login");
  }

  return await response.json();
}
