export const cores = {
  primaria: "#2F6FED",
  primariaEscura: "#1E4FB8",
  escuro: "#111827",
  texto: "#1F2937",
  textoSuave: "#6B7280",
  fundo: "#F3F4F6",
  branco: "#FFFFFF",
  borda: "#E1E4E8",
  perigo: "#C62828",
  sucesso: "#1F9D55",
  aviso: "#B45309",
  avisoFundo: "#FEF3C7",
};

// Grupos musculares usados para colorir e agrupar exercícios.
export const grupos = {
  peito: { nome: "Peito", cor: "#2F6FED" },
  ombros: { nome: "Ombros", cor: "#7C3AED" },
  triceps: { nome: "Tríceps", cor: "#0EA5E9" },
  costas: { nome: "Costas", cor: "#059669" },
  biceps: { nome: "Bíceps", cor: "#D97706" },
  abdomen: { nome: "Abdômen", cor: "#DB2777" },
  pernas: { nome: "Pernas", cor: "#DC2626" },
  panturrilha: { nome: "Panturrilha", cor: "#B45309" },
};

// Como o descanso costuma variar conforme o tipo de exercício (ver README).
export const tiposExercicio = {
  composto: { nome: "Composto", descanso: 90 },
  isolado: { nome: "Isolado", descanso: 60 },
  isometrico: { nome: "Isometria", descanso: 60 },
};

export function corDoGrupo(grupo) {
  return grupos[grupo]?.cor || cores.textoSuave;
}

export function nomeDoGrupo(grupo) {
  return grupos[grupo]?.nome || grupo;
}

export function formatarData(iso) {
  const data = new Date(iso);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatarDataHora(iso) {
  const data = new Date(iso);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarDuracao(segundos) {
  if (!segundos || segundos < 0) {
    return "—";
  }
  const minutos = Math.round(segundos / 60);
  if (minutos < 1) {
    return "menos de 1 min";
  }
  return `${minutos} min`;
}
