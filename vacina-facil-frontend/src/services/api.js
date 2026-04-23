const BASE_URL = "http://localhost:8080/api";

export async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.erro || "Erro desconhecido");
  }
  return res.json();
}

export async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.erro || "Erro desconhecido");
  }
  return res.json();
}

export async function patch(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: "PATCH" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.erro || "Erro desconhecido");
  }
  return res.json();
}
