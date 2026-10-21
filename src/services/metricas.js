// Cálculos feitos a partir das sessões salvas (sem servidor): volume, recordes, frequência.
import { paraNumero } from "../theme";

const DIA_MS = 24 * 60 * 60 * 1000;

// Séries concluídas de um item da sessão, sempre no formato [{ kg, reps }].
// Sessões antigas guardavam só "carga" e um texto de repetições ("10, 10, 9"); elas são
// convertidas aqui para que o histórico de antes da mudança continue contando.
export function seriesDoItem(item) {
  if (!item) {
    return [];
  }
  if (Array.isArray(item.series)) {
    return item.series
      .filter((s) => s.feita)
      .map((s) => ({ kg: paraNumero(s.kg), reps: paraNumero(s.reps) }));
  }
  const kg = paraNumero(item.carga);
  const reps = String(item.reps || "")
    .split(/[,;/ ]+/)
    .map(paraNumero)
    .filter((r) => r > 0);
  const feitas = item.seriesFeitas || reps.length;
  return Array.from({ length: feitas }, (_, i) => ({
    kg,
    reps: reps[i] ?? reps[reps.length - 1] ?? 0,
  }));
}

export function volumeDoItem(item) {
  return seriesDoItem(item).reduce((soma, s) => soma + s.kg * s.reps, 0);
}

export function volumeDaSessao(sessao) {
  return sessao.itens.reduce((soma, item) => soma + volumeDoItem(item), 0);
}

export function seriesDaSessao(sessao) {
  return sessao.itens.reduce((soma, item) => soma + seriesDoItem(item).length, 0);
}

export function maiorCargaDoItem(item) {
  return seriesDoItem(item).reduce((maior, s) => Math.max(maior, s.kg), 0);
}

// 1RM estimado pela fórmula de Epley: carga × (1 + reps / 30).
export function umRmEstimado(kg, reps) {
  if (!kg || !reps) {
    return 0;
  }
  return reps === 1 ? kg : kg * (1 + reps / 30);
}

// Segunda-feira 00:00 da semana da data.
export function inicioDaSemana(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  const deslocamento = (d.getDay() + 6) % 7;
  return new Date(d.getTime() - deslocamento * DIA_MS);
}

function mesmoDia(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Os 7 dias (seg a dom) da semana atual, marcando o treino feito em cada um.
export function diasDaSemana(sessoes, hoje = new Date()) {
  const inicio = inicioDaSemana(hoje);
  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(inicio.getTime() + i * DIA_MS);
    const sessao = sessoes.find((s) => mesmoDia(new Date(s.data), dia));
    return { data: dia, hoje: mesmoDia(dia, hoje), treinoId: sessao?.treinoId || null };
  });
}

export function treinosNoMes(sessoes, hoje = new Date()) {
  return sessoes.filter((s) => {
    const d = new Date(s.data);
    return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
  }).length;
}

// Volume por semana nas últimas n semanas (a última é a atual).
export function volumePorSemana(sessoes, n = 8, hoje = new Date()) {
  const atual = inicioDaSemana(hoje).getTime();
  const semanas = Array.from({ length: n }, (_, i) => ({
    inicio: new Date(atual - (n - 1 - i) * 7 * DIA_MS),
    volume: 0,
  }));
  for (const sessao of sessoes) {
    const inicio = inicioDaSemana(sessao.data).getTime();
    const semana = semanas.find((s) => s.inicio.getTime() === inicio);
    if (semana) {
      semana.volume += volumeDaSessao(sessao);
    }
  }
  return semanas;
}

// Semanas seguidas com pelo menos um treino, contando a atual (ou a anterior, se a atual
// ainda não tem treino).
export function semanasSeguidas(sessoes, hoje = new Date()) {
  const comTreino = new Set(sessoes.map((s) => inicioDaSemana(s.data).getTime()));
  let semana = inicioDaSemana(hoje).getTime();
  if (!comTreino.has(semana)) {
    semana -= 7 * DIA_MS;
  }
  let total = 0;
  while (comTreino.has(semana)) {
    total += 1;
    semana -= 7 * DIA_MS;
  }
  return total;
}

// Grade do mês (seg a dom) para o mapa de frequência. Dias de fora do mês vêm como null.
export function calendarioDoMes(sessoes, hoje = new Date()) {
  const primeiro = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  const vazios = (primeiro.getDay() + 6) % 7;
  const celulas = Array.from({ length: vazios }, () => null);
  for (let dia = 1; dia <= diasNoMes; dia += 1) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
    const sessao = sessoes.find((s) => mesmoDia(new Date(s.data), data));
    celulas.push({ dia, treinoId: sessao?.treinoId || null, futuro: data > hoje });
  }
  while (celulas.length % 7 !== 0) {
    celulas.push(null);
  }
  return celulas;
}

// Recordes e histórico de um exercício. "sessoes" vem da mais recente para a mais antiga.
export function estatisticasDoExercicio(sessoes, exercicioId) {
  const historico = [];
  let maiorCarga = 0;
  let melhor1Rm = 0;
  let melhorVolume = 0;
  for (const sessao of sessoes) {
    const item = sessao.itens.find((i) => i.exercicioId === exercicioId);
    const series = seriesDoItem(item);
    if (!series.length) {
      continue;
    }
    const volume = series.reduce((soma, s) => soma + s.kg * s.reps, 0);
    historico.push({ data: sessao.data, series, volume });
    melhorVolume = Math.max(melhorVolume, volume);
    for (const s of series) {
      maiorCarga = Math.max(maiorCarga, s.kg);
      melhor1Rm = Math.max(melhor1Rm, umRmEstimado(s.kg, s.reps));
    }
  }
  return { historico, maiorCarga, melhor1Rm, melhorVolume };
}

// Ids dos exercícios em que a sessão bateu o recorde de carga em relação às anteriores.
export function recordesDaSessao(sessao, sessoes) {
  const anteriores = sessoes.filter((s) => new Date(s.data) < new Date(sessao.data));
  const recordes = new Set();
  for (const item of sessao.itens) {
    const carga = maiorCargaDoItem(item);
    if (!carga) {
      continue;
    }
    const antes = anteriores.reduce((maior, s) => {
      const anterior = s.itens.find((i) => i.exercicioId === item.exercicioId);
      return Math.max(maior, maiorCargaDoItem(anterior));
    }, 0);
    if (antes > 0 && carga > antes) {
      recordes.add(item.exercicioId);
    }
  }
  return recordes;
}
