import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Inicio({ dados }) {
  const { usuario } = useContext(AuthContext);
  const [busca, setBusca] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [pagina, setPagina] = useState(1);

  const encontrados = dados.campeonatos.filter(
    (campeonato) =>
      campeonato.nome.toLowerCase().includes(busca.trim().toLowerCase()) &&
      (modalidade === "" || campeonato.modalidade === modalidade),
  );
  const porPagina = 4;
  const totalPaginas = Math.max(1, Math.ceil(encontrados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const exibidos = encontrados.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina,
  );

  return (
    <>
      <section className="apresentacao">
        <p>ESPORTE UNIVERSITÁRIO</p>
        <h1>Campeonatos do campus</h1>
        <p>Consulte os times, acompanhe os jogos e veja a classificação.</p>
      </section>
      <div className="titulo">
        <h2>Lista de campeonatos</h2>
        {usuario?.perfil === "organizador" && (
          <Link className="botao" to="/campeonatos/novo">
            Novo campeonato
          </Link>
        )}
      </div>
      <section className="caixa">
        <div className="filtros">
          <label>
            Buscar por nome
            <input
              value={busca}
              placeholder="Nome do campeonato"
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
            />
          </label>
          <label>
            Modalidade
            <select
              value={modalidade}
              onChange={(e) => {
                setModalidade(e.target.value);
                setPagina(1);
              }}
            >
              <option value="">Todas</option>
              <option>Futsal</option>
              <option>Futebol</option>
            </select>
          </label>
        </div>
        {exibidos.length === 0 ? (
          <p className="vazio">
            Nenhum campeonato encontrado. Altere ou limpe os filtros.
          </p>
        ) : (
          <div className="tabela">
            <table>
              <thead>
                <tr>
                  <th>Campeonato</th>
                  <th>Modalidade</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {exibidos.map((campeonato) => (
                  <tr key={campeonato.id}>
                    <td>
                      <strong>{campeonato.nome}</strong>
                    </td>
                    <td>{campeonato.modalidade}</td>
                    <td>
                      <span className="status">{campeonato.status}</span>
                    </td>
                    <td>
                      <Link to={`/campeonatos/${campeonato.id}`}>
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="paginacao">
          <span>
            {encontrados.length} resultados · Página {paginaAtual} de{" "}
            {totalPaginas}
          </span>
          <div>
            <button
              className="secundario"
              disabled={paginaAtual === 1}
              onClick={() => setPagina(paginaAtual - 1)}
            >
              Anterior
            </button>
            <button
              className="secundario"
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPagina(paginaAtual + 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
