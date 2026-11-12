import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Partidas({ dados, salvar }) {
  const { usuario } = useContext(AuthContext);
  const [campeonatoId, setCampeonatoId] = useState("");
  const organizador = usuario?.perfil === "organizador";
  const partidas = dados.partidas.filter(
    (p) => campeonatoId === "" || p.campeonatoId === Number(campeonatoId),
  );
  function nomeTime(id) {
    return dados.times.find((time) => time.id === id)?.nome || "Time removido";
  }

  function excluir(partida) {
    if (!organizador || partida.status !== "Agendada") return;
    if (!window.confirm("Excluir esta partida agendada?")) return;
    salvar(
      {
        ...dados,
        partidas: dados.partidas.filter((item) => item.id !== partida.id),
      },
      "Partida excluída.",
    );
  }

  function cancelar(partida) {
    if (
      !organizador ||
      !window.confirm(
        "Cancelar a partida? Ela deixará de contar na classificação.",
      )
    )
      return;
    const novas = dados.partidas.map((item) =>
      item.id === partida.id ? { ...item, status: "Cancelada" } : item,
    );
    salvar({ ...dados, partidas: novas }, "Partida cancelada.");
  }

  return (
    <>
      <div className="titulo">
        <div>
          <h1>Partidas</h1>
          <p>Consulte os confrontos e os placares.</p>
        </div>
        {organizador && (
          <Link className="botao" to="/partidas/nova">
            Agendar partida
          </Link>
        )}
      </div>
      <section className="caixa">
        <label className="filtro-curto">
          Campeonato
          <select
            value={campeonatoId}
            onChange={(e) => setCampeonatoId(e.target.value)}
          >
            <option value="">Todos</option>
            {dados.campeonatos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
        {partidas.length === 0 ? (
          <p className="vazio">Nenhuma partida encontrada.</p>
        ) : (
          <div className="tabela">
            <table>
              <thead>
                <tr>
                  <th>Data e hora</th>
                  <th>Confronto</th>
                  <th>Placar</th>
                  <th>Status</th>
                  {organizador && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {partidas.map((partida) => (
                  <tr key={partida.id}>
                    <td>
                      {partida.data.slice(0, 10).split("-").reverse().join("/")}
                      <small>
                        {partida.data.slice(11)} · {partida.local}
                      </small>
                    </td>
                    <td>
                      {nomeTime(partida.casaId)} × {nomeTime(partida.foraId)}
                    </td>
                    <td>
                      {partida.status === "Finalizada"
                        ? `${partida.golsCasa} × ${partida.golsFora}`
                        : "—"}
                    </td>
                    <td>{partida.status}</td>
                    {organizador && (
                      <td>
                        <div className="acoes">
                          {partida.status === "Agendada" && (
                            <>
                              <Link to={`/partidas/${partida.id}/resultado`}>
                                Lançar resultado
                              </Link>
                              <button
                                className="perigo"
                                onClick={() => excluir(partida)}
                              >
                                Excluir
                              </button>
                            </>
                          )}
                          {partida.status === "Finalizada" && (
                            <button
                              className="perigo"
                              onClick={() => cancelar(partida)}
                            >
                              Cancelar partida
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
