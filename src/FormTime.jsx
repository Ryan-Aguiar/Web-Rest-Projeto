import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function FormTime({ dados, salvar }) {
  const { id } = useParams();
  const { usuario } = useContext(AuthContext);
  const time = dados.times.find((item) => item.id === Number(id));
  const [nome, setNome] = useState(time?.nome || "");
  const [curso, setCurso] = useState(time?.curso || "");
  const [campeonatoId, setCampeonatoId] = useState(time?.campeonatoId || "");
  const [erro, setErro] = useState("");
  const navegar = useNavigate();
  if (id && !time)
    return (
      <section className="caixa">
        <h1>Time não encontrado</h1>
        <Link to="/times">Voltar</Link>
      </section>
    );
  if (time && usuario.perfil !== "organizador" && time.capitaoId !== usuario.id)
    return (
      <section className="caixa">
        <h1>Acesso negado</h1>
        <p>Você só pode editar o próprio time.</p>
        <Link to="/times">Voltar</Link>
      </section>
    );
  const abertos = dados.campeonatos.filter(
    (c) => c.status === "Inscrições abertas",
  );

  function enviar(evento) {
    evento.preventDefault();
    if (nome.trim().length < 2 || curso.trim().length < 2) {
      setErro("Preencha nome e curso com pelo menos 2 caracteres.");
      return;
    }
    const campeonato = dados.campeonatos.find(
      (c) => c.id === Number(campeonatoId),
    );
    if (!campeonato || (!time && campeonato.status !== "Inscrições abertas")) {
      setErro("Escolha um campeonato com inscrições abertas.");
      return;
    }
    const repetido = dados.times.some(
      (item) =>
        item.campeonatoId === campeonato.id &&
        item.id !== time?.id &&
        item.nome.trim().toLowerCase() === nome.trim().toLowerCase(),
    );
    if (repetido) {
      setErro("Já existe um time com esse nome neste campeonato.");
      return;
    }
    const novo = {
      id: time ? time.id : Date.now(),
      nome: nome.trim(),
      curso: curso.trim(),
      campeonatoId: campeonato.id,
      capitaoId: time ? time.capitaoId : usuario.id,
    };
    const times = time
      ? dados.times.map((item) => (item.id === time.id ? novo : item))
      : [...dados.times, novo];
    if (
      salvar(
        { ...dados, times },
        time ? "Time atualizado." : "Time cadastrado.",
      )
    )
      navegar("/times");
  }

  return (
    <section className="caixa formulario">
      <h1>{time ? "Editar time" : "Novo time"}</h1>
      <form noValidate onSubmit={enviar}>
        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}
        <label htmlFor="nome">Nome do time</label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <label htmlFor="curso">Curso</label>
        <input
          id="curso"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          required
        />
        {!time && (
          <>
            <label htmlFor="campeonato">Campeonato</label>
            <select
              id="campeonato"
              value={campeonatoId}
              onChange={(e) => setCampeonatoId(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {abertos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
            <p className="pequeno">
              Só é possível inscrever times enquanto as inscrições estiverem
              abertas.
            </p>
          </>
        )}
        {time && (
          <p>
            Campeonato:{" "}
            {dados.campeonatos.find((c) => c.id === time.campeonatoId)?.nome}
          </p>
        )}
        <div className="acoes">
          <button type="submit">Salvar time</button>
          <Link to="/times">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
