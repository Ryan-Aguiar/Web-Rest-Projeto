import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Resultado({ dados, salvar }) {
  const { id } = useParams();
  const partida = dados.partidas.find((item) => item.id === Number(id));
  const [golsCasa, setGolsCasa] = useState(0);
  const [golsFora, setGolsFora] = useState(0);
  const [erro, setErro] = useState("");
  const navegar = useNavigate();
  if (!partida)
    return (
      <section className="caixa">
        <h1>Partida não encontrada</h1>
        <Link to="/partidas">Voltar</Link>
      </section>
    );
  if (partida.status !== "Agendada")
    return (
      <section className="caixa">
        <h1>Resultado indisponível</h1>
        <p>Esta partida já foi finalizada ou cancelada.</p>
        <Link to="/partidas">Voltar</Link>
      </section>
    );
  const casa = dados.times.find((time) => time.id === partida.casaId);
  const fora = dados.times.find((time) => time.id === partida.foraId);

  function enviar(evento) {
    evento.preventDefault();
    const a = Number(golsCasa),
      b = Number(golsFora);
    if (
      golsCasa === "" ||
      golsFora === "" ||
      !Number.isInteger(a) ||
      !Number.isInteger(b) ||
      a < 0 ||
      b < 0
    ) {
      setErro("Informe placares inteiros maiores ou iguais a zero.");
      return;
    }
    if (!window.confirm(`Finalizar com o placar ${a} × ${b}?`)) return;
    const partidas = dados.partidas.map((item) =>
      item.id === partida.id
        ? { ...item, golsCasa: a, golsFora: b, status: "Finalizada" }
        : item,
    );
    if (
      salvar(
        { ...dados, partidas },
        "Resultado salvo. A classificação foi atualizada.",
      )
    )
      navegar(`/campeonatos/${partida.campeonatoId}`);
  }

  return (
    <section className="caixa formulario">
      <h1>Lançar resultado</h1>
      <p>
        {casa?.nome} × {fora?.nome}
      </p>
      <form noValidate onSubmit={enviar}>
        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}
        <div className="duas-colunas">
          <div>
            <label htmlFor="golsCasa">Gols {casa?.nome}</label>
            <input
              id="golsCasa"
              type="number"
              min="0"
              step="1"
              value={golsCasa}
              onChange={(e) => setGolsCasa(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="golsFora">Gols {fora?.nome}</label>
            <input
              id="golsFora"
              type="number"
              min="0"
              step="1"
              value={golsFora}
              onChange={(e) => setGolsFora(e.target.value)}
              required
            />
          </div>
        </div>
        <p className="pequeno">
          Ao finalizar, a classificação é calculada novamente a partir dos
          resultados.
        </p>
        <div className="acoes">
          <button type="submit">Salvar resultado</button>
          <Link to="/partidas">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
