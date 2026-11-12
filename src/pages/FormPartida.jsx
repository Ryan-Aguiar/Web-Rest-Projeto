import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FormPartida({ dados, salvar }) {
  const [campeonatoId, setCampeonatoId] = useState("");
  const [casaId, setCasaId] = useState("");
  const [foraId, setForaId] = useState("");
  const [data, setData] = useState("");
  const [local, setLocal] = useState("");
  const [erro, setErro] = useState("");
  const navegar = useNavigate();
  const ativos = dados.campeonatos.filter((c) => c.status === "Em andamento");
  const times = dados.times.filter(
    (time) => time.campeonatoId === Number(campeonatoId),
  );

  function enviar(evento) {
    evento.preventDefault();
    const campeonato = ativos.find((c) => c.id === Number(campeonatoId));
    if (!campeonato || !casaId || !foraId || !data || local.trim().length < 3) {
      setErro("Preencha campeonato, times, data, hora e local.");
      return;
    }
    if (casaId === foraId) {
      setErro("Escolha dois times diferentes.");
      return;
    }
    if (
      !times.some((t) => t.id === Number(casaId)) ||
      !times.some((t) => t.id === Number(foraId))
    ) {
      setErro("Os dois times devem pertencer ao campeonato escolhido.");
      return;
    }
    if (!Number.isFinite(new Date(data).getTime())) {
      setErro("Informe uma data e hora válidas.");
      return;
    }
    const dia = data.slice(0, 10);
    if (dia < campeonato.inicio || dia > campeonato.fim) {
      setErro("A partida precisa ocorrer dentro do período do campeonato.");
      return;
    }
    const conflito = dados.partidas.some(
      (p) =>
        p.status !== "Cancelada" &&
        p.data === data &&
        [p.casaId, p.foraId].some(
          (timeId) => timeId === Number(casaId) || timeId === Number(foraId),
        ),
    );
    if (conflito) {
      setErro("Um dos times já tem partida nesse horário.");
      return;
    }
    const nova = {
      id: Date.now(),
      campeonatoId: campeonato.id,
      casaId: Number(casaId),
      foraId: Number(foraId),
      data,
      local: local.trim(),
      golsCasa: null,
      golsFora: null,
      status: "Agendada",
    };
    if (
      salvar(
        { ...dados, partidas: [...dados.partidas, nova] },
        "Partida agendada.",
      )
    )
      navegar("/partidas");
  }

  return (
    <section className="caixa formulario">
      <h1>Agendar partida</h1>
      <form noValidate onSubmit={enviar}>
        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}
        <label htmlFor="campeonato">Campeonato</label>
        <select
          id="campeonato"
          value={campeonatoId}
          onChange={(e) => {
            setCampeonatoId(e.target.value);
            setCasaId("");
            setForaId("");
          }}
          required
        >
          <option value="">Selecione</option>
          {ativos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <p className="pequeno">
          Somente campeonatos em andamento podem receber partidas.
        </p>
        <label htmlFor="casa">Time da casa</label>
        <select
          id="casa"
          value={casaId}
          onChange={(e) => setCasaId(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          {times.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </select>
        <label htmlFor="fora">Time visitante</label>
        <select
          id="fora"
          value={foraId}
          onChange={(e) => setForaId(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          {times.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </select>
        <label htmlFor="data">Data e hora</label>
        <input
          id="data"
          type="datetime-local"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
        <label htmlFor="local">Local</label>
        <input
          id="local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Ex.: Ginásio do campus"
          required
        />
        <div className="acoes">
          <button type="submit">Salvar partida</button>
          <Link to="/partidas">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
