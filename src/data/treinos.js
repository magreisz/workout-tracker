// Plano de treino 3x por semana (intermediário), um grupo principal por dia e sem pernas:
// A peito e tríceps, B costas e bíceps, C ombros e abdômen.
// Os dados aqui são o "plano fixo": o que registrar fica no histórico (storage).
//
// Cada exercício tem:
//  - id: identificador estável usado para ligar o histórico ao exercício (não muda quando o
//    exercício troca de treino, por isso há "a4" no Treino C)
//  - chave: liga ao detalhe em exercicios.js (animação, músculos e passo a passo)
//  - nome: nome exibido
//  - grupo: grupo muscular (ver theme.js -> grupos)
//  - tipo: composto | isolado | isometrico (influencia o descanso sugerido)
//  - series / repeticoes: faixa alvo
//  - tempo: true quando as repetições são medidas em segundos (ex.: prancha)

export const treinos = [
  {
    id: "A",
    titulo: "Treino A",
    foco: "Peito e tríceps",
    diaSugerido: "Segunda",
    cor: "#3D8BFF",
    exercicios: [
      {
        id: "a1",
        chave: "supino-maquina",
        nome: "Supino na máquina",
        grupo: "peito",
        tipo: "composto",
        series: 3,
        repeticoes: "8–12",
      },
      {
        id: "a2",
        chave: "supino-inclinado-halteres",
        nome: "Supino inclinado com halteres",
        grupo: "peito",
        tipo: "composto",
        series: 3,
        repeticoes: "8–12",
      },
      {
        id: "a6",
        chave: "voador",
        nome: "Voador (peck deck)",
        grupo: "peito",
        tipo: "isolado",
        series: 3,
        repeticoes: "10–15",
      },
      {
        id: "a5",
        chave: "triceps-corda",
        nome: "Tríceps na polia com corda",
        grupo: "triceps",
        tipo: "isolado",
        series: 3,
        repeticoes: "10–15",
      },
      {
        id: "a7",
        chave: "triceps-frances-polia",
        nome: "Tríceps francês na polia",
        grupo: "triceps",
        tipo: "isolado",
        series: 3,
        repeticoes: "10–12",
      },
    ],
  },
  {
    id: "B",
    titulo: "Treino B",
    foco: "Costas e bíceps",
    diaSugerido: "Quarta",
    cor: "#2FD27A",
    exercicios: [
      {
        id: "b1",
        chave: "puxada-frontal",
        nome: "Puxada frontal na polia",
        grupo: "costas",
        tipo: "composto",
        series: 3,
        repeticoes: "8–12",
      },
      {
        id: "b2",
        chave: "remada-baixa",
        nome: "Remada baixa",
        grupo: "costas",
        tipo: "composto",
        series: 3,
        repeticoes: "8–12",
      },
      {
        id: "b3",
        chave: "remada-articulada",
        nome: "Remada articulada",
        grupo: "costas",
        tipo: "composto",
        series: 3,
        repeticoes: "10–12",
      },
      {
        id: "b4",
        chave: "rosca-direta",
        nome: "Rosca direta",
        grupo: "biceps",
        tipo: "isolado",
        series: 3,
        repeticoes: "10–12",
      },
      {
        id: "b5",
        chave: "rosca-martelo",
        nome: "Rosca martelo",
        grupo: "biceps",
        tipo: "isolado",
        series: 3,
        repeticoes: "10–12",
      },
    ],
  },
  {
    id: "C",
    titulo: "Treino C",
    foco: "Ombros e abdômen",
    diaSugerido: "Sexta",
    cor: "#FF7A45",
    exercicios: [
      {
        id: "a4",
        chave: "desenvolvimento-maquina",
        nome: "Desenvolvimento na máquina",
        grupo: "ombros",
        tipo: "composto",
        series: 3,
        repeticoes: "8–12",
      },
      {
        id: "c4",
        chave: "elevacao-lateral",
        nome: "Elevação lateral",
        grupo: "ombros",
        tipo: "isolado",
        series: 3,
        repeticoes: "12–15",
      },
      {
        id: "c7",
        chave: "crucifixo-invertido-polia",
        nome: "Crucifixo invertido na polia",
        grupo: "ombros",
        tipo: "isolado",
        series: 3,
        repeticoes: "12–15",
      },
      {
        id: "c8",
        chave: "encolhimento-barra",
        nome: "Encolhimento com barra",
        grupo: "trapezio",
        tipo: "isolado",
        series: 3,
        repeticoes: "12–15",
      },
      {
        id: "b6",
        chave: "abdominal-maquina",
        nome: "Abdominal na máquina",
        grupo: "abdomen",
        tipo: "isolado",
        series: 3,
        repeticoes: "15–20",
      },
      {
        id: "c6",
        chave: "prancha",
        nome: "Prancha",
        grupo: "abdomen",
        tipo: "isometrico",
        series: 3,
        repeticoes: "30–45",
        tempo: true,
      },
    ],
  },
];

// Ids que já existiram no plano para o mesmo movimento (ex.: a elevação lateral também era "a3"
// no Treino A antigo). Servem para juntar o histórico nos recordes do exercício.
const idsAnteriores = {
  "elevacao-lateral": ["a3"],
};

export function idsDoMovimento(chave) {
  const atuais = todosExercicios()
    .filter((e) => e.chave === chave)
    .map((e) => e.id);
  return [...new Set([...atuais, ...(idsAnteriores[chave] || [])])];
}

export function buscarTreino(id) {
  return treinos.find((treino) => treino.id === id) || null;
}

export function todosExercicios() {
  return treinos.flatMap((treino) =>
    treino.exercicios.map((exercicio) => ({ ...exercicio, treinoId: treino.id })),
  );
}

// Sugestão de rodízio A -> B -> C -> A.
export function proximoTreino(ultimoId) {
  if (!ultimoId) {
    return treinos[0];
  }
  const indice = treinos.findIndex((treino) => treino.id === ultimoId);
  if (indice === -1) {
    return treinos[0];
  }
  return treinos[(indice + 1) % treinos.length];
}
