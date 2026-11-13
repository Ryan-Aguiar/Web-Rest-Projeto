import { useContext, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { usuario, entrar } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const local = useLocation();
  const navegar = useNavigate();
  const destino = local.state?.destino || "/";

  if (usuario) return <Navigate to={destino} replace />;

  function enviar(evento) {
    evento.preventDefault();
    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErro("Informe um e-mail válido.");
      return;
    }
    try {
      if (entrar(email, senha)) navegar(destino, { replace: true });
      else setErro("E-mail ou senha incorretos.");
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <section className="caixa formulario">
      <h1>Entrar no ArenaUni</h1>
      <p>
        O organizador administra campeonatos e jogos. O capitão cuida do próprio
        time.
      </p>
      <form onSubmit={enviar} noValidate>
        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <div className="acoes">
          <button type="submit">Entrar</button>
          <Link to="/">Voltar</Link>
        </div>
      </form>
      <div className="ajuda">
        <h2>Contas para testar</h2>
        <p>
          Senha das duas contas: <strong>Arena@123</strong>
        </p>
        <div className="acoes">
          <button
            type="button"
            className="secundario"
            onClick={() => {
              setEmail("organizador@arenauni.demo");
              setSenha("Arena@123");
              setErro("");
            }}
          >
            Preencher organizador
          </button>
          <button
            type="button"
            className="secundario"
            onClick={() => {
              setEmail("capitao@arenauni.demo");
              setSenha("Arena@123");
              setErro("");
            }}
          >
            Preencher capitão
          </button>
        </div>
        <p className="pequeno">
          Login fictício para a demonstração da Fase 1. Use apenas as contas de
          teste.
        </p>
      </div>
    </section>
  );
}
