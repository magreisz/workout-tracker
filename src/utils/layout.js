// Distância do topo da tela até o primeiro conteúdo.
// No iPhone (app instalado pela Tela de Início) o iOS desfoca uma faixa logo abaixo da barra de
// status; somar uma folga à área segura evita que títulos e rótulos fiquem borrados ali.
// Sem área segura (navegador do computador) basta uma margem pequena.
const FOLGA_IOS = 20;

export function espacoTopo(insets, minimo = 12) {
  return insets.top > 0 ? insets.top + FOLGA_IOS : minimo;
}
