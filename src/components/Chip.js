import React from "react";
import styled from "styled-components/native";

import { cores, comAlfa } from "../theme";

const Caixa = styled.View`
  align-self: flex-start;
  border-radius: 6px;
  padding: 3px 8px;
  margin-right: 6px;
  margin-top: 4px;
  background-color: ${(p) => (p.$cor ? comAlfa(p.$cor, 0.15) : cores.elevada)};
`;

const Texto = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => p.$cor || cores.textoMedio};
`;

export default function Chip({ texto, cor }) {
  return (
    <Caixa $cor={cor}>
      <Texto $cor={cor}>{texto}</Texto>
    </Caixa>
  );
}
