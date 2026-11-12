// Fase 1: os dados ficam no navegador. Ainda não existe servidor REST.
// Na Fase 2, esta leitura será substituída por fetch para a API Node.js.
const CHAVE = "arenauni-simples-dados";

// Troque para true apenas para demonstrar o estado de erro na apresentação.
const SIMULAR_ERRO = false;

const dadosIniciais = {
  campeonatos: [
    {
      id: 1,
      nome: "Copa Universitária",
      modalidade: "Futsal",
      status: "Em andamento",
      inicio: "2026-11-01",
      fim: "2026-12-15",
    },
    {
      id: 2,
      nome: "Intercursos",
      modalidade: "Futsal",
      status: "Inscrições abertas",
      inicio: "2026-12-01",
      fim: "2026-12-20",
    },
    {
      id: 3,
      nome: "Copa dos Calouros",
      modalidade: "Futebol",
      status: "Inscrições abertas",
      inicio: "2026-12-05",
      fim: "2026-12-18",
    },
    {
      id: 4,
      nome: "Torneio de Integração",
      modalidade: "Futebol",
      status: "Inscrições abertas",
      inicio: "2027-02-01",
      fim: "2027-02-20",
    },
    {
      id: 5,
      nome: "Copa das Atléticas",
      modalidade: "Futsal",
      status: "Inscrições abertas",
      inicio: "2027-03-01",
      fim: "2027-03-20",
    },
    {
      id: 6,
      nome: "Copa do Campus",
      modalidade: "Futebol",
      status: "Encerrado",
      inicio: "2026-09-01",
      fim: "2026-09-20",
    },
  ],
  times: [
    {
      id: 1,
      nome: "Engenharia FC",
      curso: "Engenharia",
      campeonatoId: 1,
      capitaoId: 2,
    },
    {
      id: 2,
      nome: "Direito United",
      curso: "Direito",
      campeonatoId: 1,
      capitaoId: 3,
    },
    {
      id: 3,
      nome: "Medicina EC",
      curso: "Medicina",
      campeonatoId: 1,
      capitaoId: 3,
    },
    {
      id: 4,
      nome: "Computação SC",
      curso: "Sistemas de Informação",
      campeonatoId: 1,
      capitaoId: 2,
    },
    {
      id: 5,
      nome: "Engenharia FC",
      curso: "Engenharia",
      campeonatoId: 2,
      capitaoId: 2,
    },
    {
      id: 6,
      nome: "Direito United",
      curso: "Direito",
      campeonatoId: 2,
      capitaoId: 3,
    },
    {
      id: 7,
      nome: "Medicina EC",
      curso: "Medicina",
      campeonatoId: 2,
      capitaoId: 3,
    },
    {
      id: 8,
      nome: "Computação SC",
      curso: "Sistemas de Informação",
      campeonatoId: 2,
      capitaoId: 2,
    },
  ],
  partidas: [
    {
      id: 1,
      campeonatoId: 1,
      casaId: 1,
      foraId: 2,
      data: "2026-11-10T19:00",
      local: "Ginásio do campus",
      golsCasa: 2,
      golsFora: 1,
      status: "Finalizada",
    },
    {
      id: 2,
      campeonatoId: 1,
      casaId: 3,
      foraId: 4,
      data: "2026-11-10T20:00",
      local: "Ginásio do campus",
      golsCasa: 1,
      golsFora: 1,
      status: "Finalizada",
    },
    {
      id: 3,
      campeonatoId: 1,
      casaId: 1,
      foraId: 4,
      data: "2026-11-17T19:00",
      local: "Ginásio do campus",
      golsCasa: null,
      golsFora: null,
      status: "Agendada",
    },
    {
      id: 4,
      campeonatoId: 1,
      casaId: 2,
      foraId: 3,
      data: "2026-11-17T20:00",
      local: "Ginásio do campus",
      golsCasa: null,
      golsFora: null,
      status: "Agendada",
    },
  ],
};

export async function carregarDados() {
  // A pequena espera permite visualizar a mensagem "Carregando...".
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (SIMULAR_ERRO) throw new Error("Não foi possível carregar os dados.");
  const salvo = localStorage.getItem(CHAVE);
  return salvo ? JSON.parse(salvo) : dadosIniciais;
}

export function guardarDados(dados) {
  localStorage.setItem(CHAVE, JSON.stringify(dados));
}
