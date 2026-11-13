import { useContext, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { carregarDados, guardarDados } from "./dados";
import RotaProtegida from "./components/RotaProtegida";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Campeonato from "./pages/Campeonato";
import FormCampeonato from "./pages/FormCampeonato";
import Times from "./pages/Times";
import FormTime from "./pages/FormTime";
import Partidas from "./pages/Partidas";
import FormPartida from "./pages/FormPartida";
import Resultado from "./pages/Resultado";

export default function App() {
  const { usuario, sair } = useContext(AuthContext);
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await carregarDados();
      setDados(resposta);
    } catch {
      setErro("Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // As páginas enviam uma nova lista; o App atualiza a tela e o navegador.
  function salvar(novosDados, texto) {
    try {
      guardarDados(novosDados);
      setDados(novosDados);
      setMensagem(texto);
      return true;
    } catch {
      window.alert(
        "Não foi possível salvar. Verifique o armazenamento do navegador.",
      );
      return false;
    }
  }

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header>
        <div className="cabecalho">
          <Link className="marca" to="/">
            Arena<span>Uni</span>
          </Link>
          <nav aria-label="Menu principal">
            <NavLink to="/" end>
              Campeonatos
            </NavLink>
            <NavLink to="/times">Times</NavLink>
            <NavLink to="/partidas">Partidas</NavLink>
          </nav>
          {usuario ? (
            <div className="conta">
              <span>
                {usuario.nome} ·{" "}
                {usuario.perfil === "organizador" ? "Organizador" : "Capitão"}
              </span>
              <button className="secundario" onClick={sair}>
                Sair
              </button>
            </div>
          ) : (
            <Link className="botao" to="/login">
              Entrar
            </Link>
          )}
        </div>
      </header>
      <main id="conteudo">
        {mensagem && (
          <div className="sucesso" role="status">
            {mensagem}
            <button
              onClick={() => setMensagem("")}
              aria-label="Fechar mensagem"
            >
              ×
            </button>
          </div>
        )}
        {carregando ? (
          <p className="caixa" role="status">
            Carregando dados...
          </p>
        ) : erro ? (
          <div className="caixa">
            <p className="erro" role="alert">
              {erro}
            </p>
            <button onClick={carregar}>Tentar novamente</button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Inicio dados={dados} />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/campeonatos/:id"
              element={<Campeonato dados={dados} salvar={salvar} />}
            />
            <Route
              path="/campeonatos/novo"
              element={
                <RotaProtegida soOrganizador>
                  <FormCampeonato key="novo" dados={dados} salvar={salvar} />
                </RotaProtegida>
              }
            />
            <Route
              path="/campeonatos/:id/editar"
              element={
                <RotaProtegida soOrganizador>
                  <FormCampeonato key="editar" dados={dados} salvar={salvar} />
                </RotaProtegida>
              }
            />
            <Route
              path="/times"
              element={
                <RotaProtegida>
                  <Times dados={dados} salvar={salvar} />
                </RotaProtegida>
              }
            />
            <Route
              path="/times/novo"
              element={
                <RotaProtegida>
                  <FormTime key="novo" dados={dados} salvar={salvar} />
                </RotaProtegida>
              }
            />
            <Route
              path="/times/:id/editar"
              element={
                <RotaProtegida>
                  <FormTime key="editar" dados={dados} salvar={salvar} />
                </RotaProtegida>
              }
            />
            <Route
              path="/partidas"
              element={<Partidas dados={dados} salvar={salvar} />}
            />
            <Route
              path="/partidas/nova"
              element={
                <RotaProtegida soOrganizador>
                  <FormPartida dados={dados} salvar={salvar} />
                </RotaProtegida>
              }
            />
            <Route
              path="/partidas/:id/resultado"
              element={
                <RotaProtegida soOrganizador>
                  <Resultado dados={dados} salvar={salvar} />
                </RotaProtegida>
              }
            />
            <Route
              path="*"
              element={
                <section className="caixa">
                  <h1>Página não encontrada</h1>
                  <p>Esse endereço não existe.</p>
                  <Link to="/">Voltar ao início</Link>
                </section>
              }
            />
          </Routes>
        )}
      </main>
      <footer>ArenaUni · Campeonatos universitários</footer>
    </>
  );
}
