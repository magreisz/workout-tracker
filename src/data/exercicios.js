// Detalhe de cada exercício do plano: animação da execução, músculos, passo a passo e o erro
// mais comum. A chave é o campo "chave" dos exercícios em treinos.js.
//
// As animações vêm da versão gratuita do ExerciseDB (https://oss.exercisedb.dev). Ficam só
// referenciadas por link, não são copiadas para o repositório.

const URL_ANIMACOES = "https://static.exercisedb.dev/media/";

export const exercicios = {
  "supino-maquina": {
    gif: "DOoWcnA",
    equipamento: "Máquina",
    principal: "Peitoral",
    auxiliares: "Tríceps, ombro anterior",
    passos: [
      "Ajuste o banco para que as pegadas fiquem na altura do meio do peito.",
      "Encoste as costas no apoio, escápulas juntas e pés firmes no chão.",
      "Empurre as pegadas à frente até quase estender os cotovelos. Expire.",
      "Volte devagar até sentir o alongamento no peito, sem bater o peso.",
    ],
    dica: "Não tire as costas do banco nem trave os cotovelos no final do movimento.",
  },
  "supino-inclinado-halteres": {
    gif: "B3Rxp6L",
    equipamento: "Halteres",
    principal: "Peitoral superior",
    auxiliares: "Ombro anterior, tríceps",
    passos: [
      "Regule o banco entre 30 e 45 graus e deite com um halter em cada mão sobre o peito.",
      "Mantenha os cotovelos levemente abaixo da linha dos ombros, punhos firmes.",
      "Empurre os halteres para cima, aproximando-os no topo. Expire.",
      "Desça controlando até os cotovelos ficarem um pouco abaixo do banco.",
    ],
    dica: "Inclinação acima de 45 graus tira o trabalho do peito e joga para o ombro.",
  },
  "elevacao-lateral": {
    gif: "DsgkuIt",
    equipamento: "Halteres",
    principal: "Ombro lateral (deltoide médio)",
    auxiliares: "Trapézio superior",
    passos: [
      "Em pé, halteres ao lado do corpo e cotovelos levemente flexionados.",
      "Eleve os braços pelas laterais até a altura dos ombros. Expire.",
      "Mantenha os punhos na linha dos cotovelos, sem girar as mãos para cima.",
      "Desça devagar, sem deixar os halteres encostarem no corpo.",
    ],
    dica: "Evite balançar o tronco para subir o peso; use uma carga que permita controle.",
  },
  "desenvolvimento-maquina": {
    gif: "dNFYIU1",
    equipamento: "Máquina",
    principal: "Ombros (deltoide anterior e médio)",
    auxiliares: "Tríceps, trapézio",
    passos: [
      "Ajuste o banco para que as pegadas fiquem na altura dos ombros.",
      "Costas apoiadas, abdômen firme e pés no chão.",
      "Empurre as pegadas para cima até quase estender os braços. Expire.",
      "Desça controlando até as mãos voltarem à altura do queixo.",
    ],
    dica: "Não arqueie a lombar para empurrar; se precisar, reduza a carga.",
  },
  "triceps-corda": {
    gif: "dU605di",
    equipamento: "Polia",
    principal: "Tríceps",
    auxiliares: "Antebraço",
    passos: [
      "De frente para a polia alta, segure a corda com as palmas voltadas uma para a outra.",
      "Cole os cotovelos ao lado do corpo, tronco levemente inclinado à frente.",
      "Estenda os cotovelos e afaste as pontas da corda no final. Expire.",
      "Volte devagar até os antebraços passarem um pouco da linha dos cotovelos.",
    ],
    dica: "Os cotovelos não saem do lugar: se eles se movem, o ombro está ajudando.",
  },
  "puxada-frontal": {
    gif: "7F1DVzn",
    equipamento: "Polia / máquina",
    principal: "Dorsais (latíssimo)",
    auxiliares: "Bíceps, romboides, ombro posterior",
    passos: [
      "Sente com as coxas presas sob o apoio e segure a barra com pegada aberta, um pouco além da largura dos ombros.",
      "Incline o tronco levemente para trás e estufe o peito, com os braços estendidos.",
      "Puxe a barra até a parte de cima do peito levando os cotovelos para baixo e para trás. Expire.",
      "Segure 1 segundo apertando as costas e volte devagar até estender os braços.",
    ],
    dica: "Evite puxar a barra atrás da nuca e não balance o tronco para ganhar impulso.",
  },
  "remada-baixa": {
    gif: "c8oybX6",
    equipamento: "Polia",
    principal: "Costas (dorsais e romboides)",
    auxiliares: "Bíceps, ombro posterior",
    passos: [
      "Sente com os pés apoiados, joelhos levemente flexionados e coluna reta.",
      "Segure a pegada com os braços estendidos e o peito aberto.",
      "Puxe em direção ao abdômen juntando as escápulas. Expire.",
      "Segure 1 segundo e estenda os braços devagar, sem curvar as costas.",
    ],
    dica: "O tronco fica parado: jogar o corpo para trás transforma a remada em balanço.",
  },
  "remada-articulada": {
    gif: "7I6LNUG",
    equipamento: "Máquina articulada",
    principal: "Costas (dorsais e romboides)",
    auxiliares: "Bíceps, trapézio médio",
    passos: [
      "Ajuste o banco para o peito ficar apoiado e as pegadas na altura dos ombros.",
      "Segure as pegadas com os braços estendidos.",
      "Puxe levando os cotovelos para trás e juntando as escápulas. Expire.",
      "Volte devagar até estender os braços e alongar as costas.",
    ],
    dica: "Mantenha o peito encostado no apoio durante toda a série.",
  },
  "rosca-direta": {
    gif: "25GPyDY",
    equipamento: "Barra",
    principal: "Bíceps",
    auxiliares: "Braquial, antebraço",
    passos: [
      "Em pé, segure a barra com as palmas para cima na largura dos ombros.",
      "Cole os cotovelos ao lado do corpo.",
      "Flexione os cotovelos levando a barra até a altura do peito. Expire.",
      "Desça devagar até estender os braços, sem soltar o peso.",
    ],
    dica: "Não jogue o quadril para frente nem mova os cotovelos para subir a barra.",
  },
  "rosca-martelo": {
    gif: "2NpxjC1",
    equipamento: "Halteres",
    principal: "Braquial e braquiorradial",
    auxiliares: "Bíceps",
    passos: [
      "Em pé, um halter em cada mão com as palmas voltadas para o corpo.",
      "Cotovelos fixos ao lado do tronco.",
      "Suba os halteres mantendo a pegada neutra, como um martelo. Expire.",
      "Desça devagar até estender os braços.",
    ],
    dica: "Mantenha os punhos retos durante todo o movimento.",
  },
  "abdominal-maquina": {
    gif: "eXFXCY0",
    equipamento: "Máquina",
    principal: "Reto abdominal",
    auxiliares: "Oblíquos",
    passos: [
      "Sente na máquina e ajuste o apoio na altura do peito ou dos ombros.",
      "Segure as pegadas e mantenha os pés presos.",
      "Enrole o tronco para frente contraindo o abdômen. Expire.",
      "Volte devagar sem deixar o peso encostar.",
    ],
    dica: "Quem faz a força é o abdômen; não puxe com os braços.",
  },
  "leg-press": {
    gif: "10Z2DXU",
    equipamento: "Máquina (45°)",
    principal: "Quadríceps",
    auxiliares: "Glúteos, posteriores da coxa",
    passos: [
      "Sente com as costas e o quadril apoiados e os pés na plataforma, na largura do quadril.",
      "Destrave a plataforma e mantenha os joelhos alinhados com os pés.",
      "Desça flexionando os joelhos até cerca de 90 graus, sem tirar o quadril do banco.",
      "Empurre a plataforma sem travar os joelhos no final. Expire.",
    ],
    dica: "Se o quadril sair do banco na descida, diminua a amplitude.",
  },
  "mesa-flexora": {
    gif: "17lJ1kr",
    equipamento: "Máquina",
    principal: "Posteriores da coxa",
    auxiliares: "Panturrilha",
    passos: [
      "Deite de bruços com o rolo logo acima dos calcanhares e os joelhos fora do banco.",
      "Segure as pegadas e mantenha o quadril encostado.",
      "Flexione os joelhos trazendo o rolo em direção aos glúteos. Expire.",
      "Volte devagar até quase estender as pernas.",
    ],
    dica: "Não levante o quadril do banco para completar o movimento.",
  },
  "cadeira-extensora": {
    gif: "my33uHU",
    equipamento: "Máquina",
    principal: "Quadríceps",
    auxiliares: "—",
    passos: [
      "Sente com as costas apoiadas e o joelho alinhado ao eixo da máquina.",
      "Encaixe o rolo logo acima dos tornozelos.",
      "Estenda as pernas até ficarem quase retas. Expire.",
      "Desça devagar, sem deixar o peso bater.",
    ],
    dica: "Segure 1 segundo no alto e evite chutar o peso com impulso.",
  },
  "panturrilha-maquina": {
    gif: "ykUOVze",
    equipamento: "Máquina",
    principal: "Panturrilha (gastrocnêmio)",
    auxiliares: "Sóleo",
    passos: [
      "Encaixe os ombros sob o apoio e a ponta dos pés na plataforma.",
      "Deixe os calcanhares descerem até alongar a panturrilha.",
      "Suba na ponta dos pés o mais alto possível. Expire.",
      "Segure 1 segundo no alto e desça devagar.",
    ],
    dica: "Faça o movimento completo e sem quicar; os joelhos ficam quase estendidos.",
  },
  prancha: {
    gif: "VBAWRPG",
    equipamento: "Peso do corpo",
    principal: "Abdômen (reto e transverso)",
    auxiliares: "Ombros, glúteos, lombar",
    passos: [
      "Apoie os antebraços no chão com os cotovelos sob os ombros.",
      "Estenda as pernas e apoie a ponta dos pés.",
      "Contraia abdômen e glúteos e mantenha o corpo reto da cabeça aos calcanhares.",
      "Respire normalmente e segure pelo tempo da série.",
    ],
    dica: "A animação mostra a versão com anilha; no plano a prancha é sem carga. Não deixe o quadril cair nem subir.",
  },
};

export function detalheDoExercicio(chave) {
  return exercicios[chave] || null;
}

export function urlAnimacao(chave) {
  const detalhe = exercicios[chave];
  return detalhe ? `${URL_ANIMACOES}${detalhe.gif}.gif` : null;
}
