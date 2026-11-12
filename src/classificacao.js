// Recebe os times de um campeonato e suas partidas.
// É uma função JavaScript comum: não usa React.
export function calcularClassificacao(times, partidas) {
  const tabela = times.map((time) => ({
    id: time.id,
    nome: time.nome,
    pontos: 0,
    jogos: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    golsPro: 0,
    golsContra: 0,
    saldo: 0,
  }));

  for (const partida of partidas) {
    if (partida.status !== "Finalizada") continue;
    const casa = tabela.find((time) => time.id === partida.casaId);
    const fora = tabela.find((time) => time.id === partida.foraId);
    if (!casa || !fora) continue;

    casa.jogos++;
    fora.jogos++;
    casa.golsPro += partida.golsCasa;
    casa.golsContra += partida.golsFora;
    fora.golsPro += partida.golsFora;
    fora.golsContra += partida.golsCasa;

    if (partida.golsCasa > partida.golsFora) {
      casa.pontos += 3;
      casa.vitorias++;
      fora.derrotas++;
    } else if (partida.golsCasa < partida.golsFora) {
      fora.pontos += 3;
      fora.vitorias++;
      casa.derrotas++;
    } else {
      casa.pontos++;
      fora.pontos++;
      casa.empates++;
      fora.empates++;
    }
  }

  for (const time of tabela) time.saldo = time.golsPro - time.golsContra;

  // O primeiro critério é pontos; depois vitórias, saldo e gols marcados.
  tabela.sort(
    (a, b) =>
      b.pontos - a.pontos ||
      b.vitorias - a.vitorias ||
      b.saldo - a.saldo ||
      b.golsPro - a.golsPro ||
      a.nome.localeCompare(b.nome),
  );
  return tabela;
}
