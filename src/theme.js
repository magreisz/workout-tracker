// Tema escuro inspirado nos apps de treino mais bem avaliados:
// fundo quase preto, superfícies em camadas, azul de destaque e verde para o que foi concluído.
export const cores = {
  fundo: "#0B0C0F",
  superficie: "#15171C",
  elevada: "#1E2128",
  linha: "#2A2E37",
  texto: "#F3F4F6",
  textoMedio: "#A3A9B6",
  textoSuave: "#6B7280",
  destaque: "#3D8BFF",
  destaqueSuave: "rgba(61,139,255,0.14)",
  sucesso: "#2FD27A",
  sucessoSuave: "rgba(47,210,122,0.12)",
  sucessoTexto: "#06210F",
  aviso: "#FF7A45",
  avisoSuave: "rgba(255,122,69,0.10)",
  avisoTexto: "#FFC2A8",
  perigo: "#FF5A5F",
  recorde: "#FFC53D",
  branco: "#FFFFFF",
};

export const raio = 16;

// Grupos musculares usados para colorir e agrupar exercícios.
export const grupos = {
  peito: { nome: "Peito", cor: "#3D8BFF" },
  ombros: { nome: "Ombros", cor: "#A78BFA" },
  triceps: { nome: "Tríceps", cor: "#38BDF8" },
  costas: { nome: "Costas", cor: "#2FD27A" },
  biceps: { nome: "Bíceps", cor: "#FBBF24" },
  abdomen: { nome: "Abdômen", cor: "#F472B6" },
  trapezio: { nome: "Trapézio", cor: "#C084FC" },
};

// Como o descanso costuma variar conforme o tipo de exercício (ver README).
export const tiposExercicio = {
  composto: { nome: "Composto", descanso: 90 },
  isolado: { nome: "Isolado", descanso: 60 },
  isometrico: { nome: "Isometria", descanso: 60 },
};

export function corDoGrupo(grupo) {
  return grupos[grupo]?.cor || cores.textoMedio;
}

export function nomeDoGrupo(grupo) {
  return grupos[grupo]?.nome || grupo;
}

// "#RRGGBB" -> "rgba(r,g,b,alfa)" para fundos translúcidos de chips.
export function comAlfa(hex, alfa) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alfa})`;
}

const DIAS_CURTOS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function formatarData(iso) {
  const data = new Date(iso);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// "seg, 19/10"
export function formatarDiaCurto(iso) {
  const data = new Date(iso);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${DIAS_CURTOS[data.getDay()]}, ${dia}/${mes}`;
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

// 16:24 ou 1:02:10
export function formatarCronometro(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = String(segundos % 60).padStart(2, "0");
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${s}`;
  }
  return `${m}:${s}`;
}

// 2340 -> "2.340", 52.5 -> "52,5"
export function formatarNumero(valor, casas = 0) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: casas,
  });
}

// Volume em kg; a partir de 10 t mostra em toneladas.
export function formatarVolume(kg) {
  if (kg >= 10000) {
    return `${formatarNumero(kg / 1000, 1)} t`;
  }
  return `${formatarNumero(kg)} kg`;
}

// Aceita "52,5" ou "52.5"; devolve número ou 0.
export function paraNumero(texto) {
  const n = parseFloat(String(texto ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
