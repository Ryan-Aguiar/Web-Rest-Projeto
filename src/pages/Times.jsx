import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Times({ dados, salvar }) {
  const { usuario } = useContext(AuthContext);
  const [busca, setBusca] = useState("");
  const [campeonatoId, setCampeonatoId] = useState("");
  const [pagina, setPagina] = useState(1);
  const [erro, setErro] = useState("");
  const encontrados = dados.times.filter(
    (time) =>
      (time.nome + " " + time.curso)
        .toLowerCase()
        .includes(busca.trim().toLowerCase()) &&
      (campeonatoId === "" || time.campeonatoId === Number(campeonatoId)),
  );
  const totalPaginas = Math.max(1, Math.ceil(encontrados.length / 5));
  const atual = Math.min(pagina, totalPaginas);
  const exibidos = encontrados.slice((atual - 1) * 5, atual * 5);
  function podeEditar(time) {
    return usuario.perfil === "organizador" || time.capitaoId === usuario.id;
  }

  function excluir(time) {
    if (!podeEditar(time)) return;
    const finalizada = dados.partidas.some(
      (p) =>
        (p.casaId === time.id || p.foraId === time.id) &&
        p.status === "Finalizada",
    );
    if (finalizada) {
      setErro("Não é possível excluir um time com partidas finalizadas.");
      return;
    }
    if (!window.confirm(`Excluir ${time.nome} e suas partidas agendadas?`))
      return;
    if (
      salvar(
        {
          ...dados,
          times: dados.times.filter((item) => item.id !== time.id),
          partidas: dados.partidas.filter(
            (p) => p.casaId !== time.id && p.foraId !== time.id,
          ),
        },
        "Time excluído.",
      )
    )
      setErro("");
  }

  return (
    <>
      <div className="titulo">
        <div>
          <h1>Times</h1>
          <p>O capitão pode editar e excluir apenas seus próprios times.</p>
        </div>
        <Link className="botao" to="/times/novo">
          Novo time
        </Link>
      </div>
      {erro && (
        <p className="erro" role="alert">
          {erro}
        </p>
      )}
      <section className="caixa">
        <div className="filtros">
          <label>
            Buscar por nome ou curso
            <input
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
            />
          </label>
          <label>
            Campeonato
            <select
              value={campeonatoId}
              onChange={(e) => {
                setCampeonatoId(e.target.value);
                setPagina(1);
              }}
            >
              <option value="">Todos</option>
              {dados.campeonatos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
        {exibidos.length === 0 ? (
          <p className="vazio">Nenhum time encontrado.</p>
        ) : (
          <div className="tabela">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Curso</th>
                  <th>Campeonato</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {exibidos.map((time) => (
                  <tr key={time.id}>
                    <td>
                      <strong>{time.nome}</strong>
                    </td>
                    <td>{time.curso}</td>
                    <td>
                      {
                        dados.campeonatos.find(
                          (c) => c.id === time.campeonatoId,
                        )?.nome
                      }
                    </td>
                    <td>
                      {podeEditar(time) ? (
                        <div className="acoes">
                          <Link to={`/times/${time.id}/editar`}>Editar</Link>
                          <button
                            className="perigo"
                            onClick={() => excluir(time)}
                            aria-label={`Excluir ${time.nome}`}
                          >
                            Excluir
                          </button>
                        </div>
                      ) : (
                        "Consulta"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="paginacao">
          <span>
            Página {atual} de {totalPaginas}
          </span>
          <div>
            <button
              className="secundario"
              disabled={atual === 1}
              onClick={() => setPagina(atual - 1)}
            >
              Anterior
            </button>
            <button
              className="secundario"
              disabled={atual === totalPaginas}
              onClick={() => setPagina(atual + 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
