// Plano de treino 3x por semana (intermediário) baseado no README pessoal.
// Os dados aqui são o "plano fixo": o que registrar fica no histórico (storage).
//
// Cada exercício tem:
//  - id: identificador estável usado para ligar o histórico ao exercício
//  - nome: nome exibido
//  - grupo: grupo muscular (ver theme.js -> grupos)
//  - tipo: composto | isolado | isometrico (influencia o descanso sugerido)
//  - series / repeticoes: faixa alvo
//  - tempo: true quando as repetições são medidas em segundos (ex.: prancha)

export const treinos = [
  {
    id: "A",
    titulo: "Treino A",
    foco: "Peito, ombros e tríceps",
    diaSugerido: "Segunda-feira",
    icone: "arm-flex",
    cor: "#2F6FED",
    exercicios: [
      { id: "a1", nome: "Supino na máquina", grupo: "peito", tipo: "composto", series: 3, repeticoes: "8–12" },
      { id: "a2", nome: "Supino inclinado com halteres", grupo: "peito", tipo: "composto", series: 3, repeticoes: "8–12" },
      { id: "a3", nome: "Elevação lateral", grupo: "ombros", tipo: "isolado", series: 3, repeticoes: "12–15" },
      { id: "a4", nome: "Desenvolvimento na máquina", grupo: "ombros", tipo: "composto", series: 2, repeticoes: "10–12" },
      { id: "a5", nome: "Tríceps na polia com corda", grupo: "triceps", tipo: "isolado", series: 3, repeticoes: "10–15" },
    ],
  },
  {
    id: "B",
    titulo: "Treino B",
    foco: "Costas, bíceps e abdômen",
    diaSugerido: "Quarta-feira",
    icone: "weight-lifter",
    cor: "#059669",
    exercicios: [
      { id: "b1", nome: "Puxada frontal na polia", grupo: "costas", tipo: "composto", series: 3, repeticoes: "8–12" },
      { id: "b2", nome: "Remada baixa", grupo: "costas", tipo: "composto", series: 3, repeticoes: "8–12" },
      { id: "b3", nome: "Remada articulada", grupo: "costas", tipo: "composto", series: 2, repeticoes: "10–12" },
      { id: "b4", nome: "Rosca direta", grupo: "biceps", tipo: "isolado", series: 3, repeticoes: "10–12" },
      { id: "b5", nome: "Rosca martelo", grupo: "biceps", tipo: "isolado", series: 2, repeticoes: "10–12" },
      { id: "b6", nome: "Abdominal na máquina", grupo: "abdomen", tipo: "isolado", series: 2, repeticoes: "15–20" },
    ],
  },
  {
    id: "C",
    titulo: "Treino C",
    foco: "Pernas, ombros e abdômen",
    diaSugerido: "Sexta-feira",
    icone: "run-fast",
    cor: "#DC2626",
    exercicios: [
      { id: "c1", nome: "Leg press", grupo: "pernas", tipo: "composto", series: 3, repeticoes: "10–12" },
      { id: "c2", nome: "Mesa flexora", grupo: "pernas", tipo: "isolado", series: 3, repeticoes: "10–12" },
      { id: "c3", nome: "Cadeira extensora", grupo: "pernas", tipo: "isolado", series: 2, repeticoes: "12–15" },
      { id: "c4", nome: "Elevação lateral", grupo: "ombros", tipo: "isolado", series: 3, repeticoes: "12–15" },
      { id: "c5", nome: "Panturrilha na máquina", grupo: "panturrilha", tipo: "isolado", series: 2, repeticoes: "12–20" },
      { id: "c6", nome: "Prancha", grupo: "abdomen", tipo: "isometrico", series: 2, repeticoes: "30–45", tempo: true },
    ],
  },
];

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
