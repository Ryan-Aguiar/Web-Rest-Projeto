import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function FormCampeonato({ dados, salvar }) {
  const { id } = useParams();
  const campeonato = dados.campeonatos.find((item) => item.id === Number(id));
  const [nome, setNome] = useState(campeonato?.nome || "");
  const [modalidade, setModalidade] = useState(
    campeonato?.modalidade || "Futsal",
  );
  const [inicio, setInicio] = useState(campeonato?.inicio || "");
  const [fim, setFim] = useState(campeonato?.fim || "");
  const [status, setStatus] = useState(
    campeonato?.status || "Inscrições abertas",
  );
  const [erro, setErro] = useState("");
  const navegar = useNavigate();
  if (id && !campeonato)
    return (
      <section className="caixa">
        <h1>Campeonato não encontrado</h1>
        <Link to="/">Voltar</Link>
      </section>
    );

  function enviar(evento) {
    evento.preventDefault();
    if (nome.trim().length < 3) {
      setErro("O nome deve ter pelo menos 3 caracteres.");
      return;
    }
    if (!inicio || !fim || fim <= inicio) {
      setErro("Informe as datas. A data final deve ser posterior à inicial.");
      return;
    }
    const totalTimes = dados.times.filter(
      (time) => time.campeonatoId === campeonato?.id,
    ).length;
    if (status === "Em andamento" && totalTimes < 4) {
      setErro("Cadastre pelo menos 4 times antes de iniciar o campeonato.");
      return;
    }
    if (campeonato?.status === "Encerrado" && status !== "Encerrado") {
      setErro("Um campeonato encerrado não pode ser reaberto.");
      return;
    }
    if (
      campeonato?.status === "Em andamento" &&
      status === "Inscrições abertas"
    ) {
      setErro("Um campeonato iniciado não pode voltar para inscrições.");
      return;
    }
    const novo = {
      id: campeonato ? campeonato.id : Date.now(),
      nome: nome.trim(),
      modalidade,
      inicio,
      fim,
      status,
    };
    // map atualiza um item; o operador ... cria uma lista com um novo item.
    const campeonatos = campeonato
      ? dados.campeonatos.map((item) =>
          item.id === campeonato.id ? novo : item,
        )
      : [...dados.campeonatos, novo];
    if (
      salvar(
        { ...dados, campeonatos },
        campeonato ? "Campeonato atualizado." : "Campeonato cadastrado.",
      )
    )
      navegar(`/campeonatos/${novo.id}`);
  }

  return (
    <section className="caixa formulario">
      <h1>{campeonato ? "Editar campeonato" : "Novo campeonato"}</h1>
      <form noValidate onSubmit={enviar}>
        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <label htmlFor="modalidade">Modalidade</label>
        <select
          id="modalidade"
          value={modalidade}
          onChange={(e) => setModalidade(e.target.value)}
        >
          <option>Futsal</option>
          <option>Futebol</option>
        </select>
        <div className="duas-colunas">
          <div>
            <label htmlFor="inicio">Data de início</label>
            <input
              id="inicio"
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="fim">Data final</label>
            <input
              id="fim"
              type="date"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              required
            />
          </div>
        </div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Inscrições abertas</option>
          <option>Em andamento</option>
          <option>Encerrado</option>
        </select>
        <p className="pequeno">
          O campeonato começa com inscrições abertas. São necessários 4 times
          para iniciá-lo.
        </p>
        <div className="acoes">
          <button type="submit">Salvar campeonato</button>
          <Link to={campeonato ? `/campeonatos/${campeonato.id}` : "/"}>
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
