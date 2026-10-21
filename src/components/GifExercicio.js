import React, { useState } from "react";
import { Image } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { urlAnimacao } from "../data/exercicios";

// As animações têm fundo branco; o quadro também é branco para elas se encaixarem no tema escuro.
const Quadro = styled.View`
  background-color: #ffffff;
  border-radius: ${(p) => p.$raio}px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

export default function GifExercicio({ chave, tamanho, altura, raio = 12, style }) {
  const [falhou, setFalhou] = useState(false);
  const uri = urlAnimacao(chave);
  const largura = tamanho ?? "100%";
  const alturaFinal = altura ?? tamanho;

  return (
    <Quadro $raio={raio} style={[{ width: largura, height: alturaFinal }, style]}>
      {uri && !falhou ? (
        <Image
          source={{ uri }}
          onError={() => setFalhou(true)}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <MaterialCommunityIcons
          name="dumbbell"
          size={Math.min(alturaFinal || 40, 120) * 0.4}
          color="#9AA0A6"
        />
      )}
    </Quadro>
  );
}
