// Peças visuais comuns às telas (tipografia, cartões e blocos de número).
import styled from "styled-components/native";

import { cores, raio } from "../theme";

export const Pagina = styled.View`
  padding: 0 18px 32px;
  max-width: 560px;
  width: 100%;
  align-self: center;
`;

export const Sobretitulo = styled.Text`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${cores.textoMedio};
`;

export const Titulo = styled.Text`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${cores.texto};
  margin-top: 2px;
`;

export const Subtitulo = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: ${cores.texto};
`;

export const TextoMedio = styled.Text`
  font-size: 14px;
  color: ${cores.textoMedio};
  line-height: 20px;
`;

export const TextoSuave = styled.Text`
  font-size: 12px;
  color: ${cores.textoSuave};
`;

export const Secao = styled.View`
  margin-top: 26px;
`;

export const CabecalhoSecao = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
`;

export const Link = styled.Text`
  color: ${cores.destaque};
  font-size: 14px;
  font-weight: 600;
`;

export const Cartao = styled.View`
  background-color: ${cores.superficie};
  border-radius: ${raio}px;
  padding: 14px;
`;

export const LinhaNumeros = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const Numero = styled.View`
  flex: 1;
  background-color: ${cores.superficie};
  border-radius: 14px;
  padding: 13px 12px;
`;

export const NumeroValor = styled.Text`
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: ${cores.texto};
`;

export const NumeroLegenda = styled.Text`
  font-size: 11.5px;
  color: ${cores.textoMedio};
  margin-top: 2px;
`;

export const NumeroVariacao = styled.Text`
  font-size: 11.5px;
  font-weight: 600;
  margin-top: 2px;
  color: ${(p) => (p.$negativa ? cores.perigo : cores.sucesso)};
`;

export const Letra = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => p.$cor};
`;

export const LetraTexto = styled.Text`
  font-size: 12px;
  font-weight: 800;
  color: ${cores.fundo};
`;
