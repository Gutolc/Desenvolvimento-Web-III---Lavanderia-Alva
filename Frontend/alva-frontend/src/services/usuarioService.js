import api from "./api";

export async function cadastrarUsuario(nome, email, senha, perfil) {
  try {
    const response = await api.post("/usuarios/cadastrar", {
      nome,
      email,
      senha,
      perfil,
    });

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message;
    throw new Error(message || "Falha ao cadastrar o funcionário", {
      cause: error,
    });
  }
}
