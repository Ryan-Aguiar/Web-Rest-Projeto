import { createContext, useState } from "react";

export const AuthContext = createContext(null);

// Contas fixas e fictícias: esta é uma simulação de login da Fase 1.
const contas = [
  {
    id: 1,
    nome: "Organizador",
    email: "organizador@arenauni.demo",
    senha: "Arena@123",
    perfil: "organizador",
  },
  {
    id: 2,
    nome: "Lucas",
    email: "capitao@arenauni.demo",
    senha: "Arena@123",
    perfil: "capitao",
  },
];

function lerUsuario() {
  try {
    return JSON.parse(localStorage.getItem("arenauni-simples-usuario"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuario);

  function entrar(email, senha) {
    const conta = contas.find(
      (item) =>
        item.email === email.trim().toLowerCase() && item.senha === senha,
    );
    if (!conta) return false;
    // Guardamos apenas os dados do usuário, sem persistir a senha.
    const pessoa = { id: conta.id, nome: conta.nome, perfil: conta.perfil };
    try {
      localStorage.setItem("arenauni-simples-usuario", JSON.stringify(pessoa));
    } catch {
      throw new Error("O navegador não permitiu salvar o login.");
    }
    setUsuario(pessoa);
    return true;
  }

  function sair() {
    localStorage.removeItem("arenauni-simples-usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}
