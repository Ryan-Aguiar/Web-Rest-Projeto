import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { calcularClassificacao } from "../classificacao";

export default function Campeonato({ dados, salvar }) {
  const { id } = useParams();
  const { usuario } = useContext(AuthContext);
  const [erro, setErro] = useState("");
  const navegar = useNavigate();
  const campeonato = dados.campeonatos.find((item) => item.id === Number(id));
  if (!campeonato)
    return (
      <section className="caixa">
        <h1>Campeonato não encontrado</h1>
        <Link to="/">Voltar</Link>
      </section>
    );

  const times = dados.times.filter(
    (time) => time.campeonatoId === campeonato.id,
  );
  const partidas = dados.partidas.filter(
    (partida) => partida.campeonatoId === campeonato.id,
  );
  const tabela = calcularClassificacao(times, partidas);
  const organizador = usuario?.perfil === "organizador";
  function nomeTime(timeId) {
    return times.find((time) => time.id === timeId)?.nome || "Time removido";
  }

  function excluir() {
    if (partidas.some((partida) => partida.status === "Finalizada")) {
      setErro("Não é possível excluir um campeonato com partidas finalizadas.");
      return;
    }
    if (!window.confirm("Excluir este campeonato, seus times e suas partidas?"))
      return;
    const novosDados = {
      campeonatos: dados.campeonatos.filter(
        (item) => item.id !== campeonato.id,
      ),
      times: dados.times.filter((item) => item.campeonatoId !== campeonato.id),
      partidas: dados.partidas.filter(
        (item) => item.campeonatoId !== campeonato.id,
      ),
    };
    if (salvar(novosDados, "Campeonato excluído.")) navegar("/");
  }

  return (
    <>
      <Link className="voltar" to="/">
        ← Campeonatos
      </Link>
      <div className="titulo">
        <div>
          <h1>{campeonato.nome}</h1>
          <p>
            {campeonato.modalidade} · {campeonato.status}
          </p>
        </div>
        {organizador && (
          <div className="acoes">
            <Link
              className="botao secundario"
              to={`/campeonatos/${campeonato.id}/editar`}
            >
              Editar campeonato
            </Link>
            <button className="perigo" onClick={excluir}>
              Excluir campeonato
            </button>
          </div>
        )}
      </div>
      {erro && (
        <p className="erro" role="alert">
          {erro}
        </p>
      )}
      <section className="caixa">
        <h2>Classificação</h2>
        <p className="pequeno">
          Vitória: 3 pontos · Empate: 1 ponto · Derrota: 0 ponto.
        </p>
        {times.length === 0 ? (
          <p className="vazio">Ainda não há times neste campeonato.</p>
        ) : (
          <div
            className="tabela"
            tabIndex={0}
            aria-label="Classificação; role para ver todas as colunas"
          >
            <table>
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Time</th>
                  <th>Pontos</th>
                  <th>J</th>
                  <th>V</th>
                  <th>E</th>
                  <th>D</th>
                  <th>SG</th>
                  <th>GP</th>
                </tr>
              </thead>
              <tbody>
                {tabela.map((time, indice) => (
                  <tr key={time.id}>
                    <td>{indice + 1}</td>
                    <td>
                      <strong>{time.nome}</strong>
                    </td>
                    <td>
                      <strong>{time.pontos}</strong>
                    </td>
                    <td>{time.jogos}</td>
                    <td>{time.vitorias}</td>
                    <td>{time.empates}</td>
                    <td>{time.derrotas}</td>
                    <td>{time.saldo}</td>
                    <td>{time.golsPro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="pequeno">
          J: jogos · V/E/D: vitórias, empates e derrotas · SG: saldo de gols ·
          GP: gols marcados.
        </p>
      </section>
      <section className="caixa">
        <div className="titulo">
          <h2>Partidas do campeonato</h2>
          {organizador && (
            <Link className="botao" to="/partidas/nova">
              Agendar partida
            </Link>
          )}
        </div>
        {partidas.length === 0 ? (
          <p className="vazio">Nenhuma partida agendada.</p>
        ) : (
          <div className="tabela">
            <table>
              <thead>
                <tr>
                  <th>Casa</th>
                  <th>Placar</th>
                  <th>Visitante</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {partidas.map((partida) => (
                  <tr key={partida.id}>
                    <td>{nomeTime(partida.casaId)}</td>
                    <td>
                      {partida.status === "Finalizada"
                        ? `${partida.golsCasa} × ${partida.golsFora}`
                        : "—"}
                    </td>
                    <td>{nomeTime(partida.foraId)}</td>
                    <td>{partida.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <Link className="botao secundario" to="/times">
        Consultar times
      </Link>
    </>
  );
}
