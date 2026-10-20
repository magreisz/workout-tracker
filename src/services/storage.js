import AsyncStorage from "@react-native-async-storage/async-storage";

// App pessoal, usuário único: os dados ficam no próprio aparelho (AsyncStorage).
const CHAVE_SESSOES = "@treino:sessoes";

async function lerJson(chave, padrao) {
  try {
    const valor = await AsyncStorage.getItem(chave);
    if (!valor) {
      return padrao;
    }
    return JSON.parse(valor);
  } catch {
    return padrao;
  }
}

// Uma "sessão" é um treino concluído e registrado.
// Formato:
// {
//   id: string,
//   treinoId: "A" | "B" | "C",
//   data: ISO string,
//   duracaoSegundos: number,
//   itens: [{ exercicioId, nome, carga, seriesFeitas, seriesAlvo, reps, obs }]
// }
export async function listarSessoes() {
  const sessoes = await lerJson(CHAVE_SESSOES, []);
  // Mais recentes primeiro.
  return sessoes.sort((a, b) => new Date(b.data) - new Date(a.data));
}

export async function salvarSessao(sessao) {
  const sessoes = await lerJson(CHAVE_SESSOES, []);
  sessoes.push(sessao);
  await AsyncStorage.setItem(CHAVE_SESSOES, JSON.stringify(sessoes));
}

export async function removerSessao(id) {
  const sessoes = await lerJson(CHAVE_SESSOES, []);
  const filtradas = sessoes.filter((sessao) => sessao.id !== id);
  await AsyncStorage.setItem(CHAVE_SESSOES, JSON.stringify(filtradas));
}

export async function limparHistorico() {
  await AsyncStorage.removeItem(CHAVE_SESSOES);
}

// Última sessão registrada de um treino específico (A/B/C).
export async function ultimaSessaoDoTreino(treinoId) {
  const sessoes = await listarSessoes();
  return sessoes.find((sessao) => sessao.treinoId === treinoId) || null;
}

// Último registro de um exercício (serve de referência de carga na próxima vez).
export async function ultimoRegistroDoExercicio(exercicioId) {
  const sessoes = await listarSessoes();
  for (const sessao of sessoes) {
    const item = sessao.itens.find((i) => i.exercicioId === exercicioId);
    if (item && (item.carga || item.reps)) {
      return { ...item, data: sessao.data };
    }
  }
  return null;
}

// Mapa { exercicioId: ultimoRegistro } para montar a tela de treino de uma vez.
export async function mapaUltimosRegistros() {
  const sessoes = await listarSessoes();
  const mapa = {};
  for (const sessao of sessoes) {
    for (const item of sessao.itens) {
      if (!mapa[item.exercicioId] && (item.carga || item.reps)) {
        mapa[item.exercicioId] = { ...item, data: sessao.data };
      }
    }
  }
  return mapa;
}
