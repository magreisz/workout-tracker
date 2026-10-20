import React, { useEffect, useRef, useState } from "react";
import { Platform, Vibration } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

import { cores } from "../theme";

const Barra = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${cores.escuro};
  border-radius: 14px;
  padding: 10px 12px;
`;

const Info = styled.View``;

const Tempo = styled.Text`
  color: ${cores.branco};
  font-size: 30px;
  font-weight: bold;
  min-width: 92px;
`;

const Legenda = styled.Text`
  color: #cbd5e1;
  font-size: 12px;
  margin-top: 2px;
`;

const Controles = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: auto;
`;

const BotaoRedondo = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => (p.$destaque ? cores.primaria : "rgba(255,255,255,0.12)")};
  margin-left: 8px;
`;

function formatar(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Cronometro({ segundosIniciais = 60, onFechar }) {
  const [restante, setRestante] = useState(segundosIniciais);
  const [rodando, setRodando] = useState(true);
  const avisou = useRef(false);

  useEffect(() => {
    if (!rodando || restante <= 0) {
      return undefined;
    }
    const intervalo = setInterval(() => {
      setRestante((atual) => Math.max(0, atual - 1));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [rodando, restante]);

  useEffect(() => {
    if (restante === 0 && !avisou.current) {
      avisou.current = true;
      setRodando(false);
      if (Platform.OS !== "web") {
        Vibration.vibrate(600);
      }
    }
  }, [restante]);

  const ajustar = (delta) => {
    avisou.current = false;
    setRestante((atual) => Math.max(0, atual + delta));
    if (delta > 0) {
      setRodando(true);
    }
  };

  const concluido = restante === 0;

  return (
    <Barra>
      <Info>
        <Tempo>{formatar(restante)}</Tempo>
        <Legenda>{concluido ? "Descanso concluído" : "Descanso em andamento"}</Legenda>
      </Info>
      <Controles>
        <BotaoRedondo onPress={() => ajustar(-15)} accessibilityLabel="Tirar 15 segundos">
          <MaterialIcons name="remove" size={22} color={cores.branco} />
        </BotaoRedondo>
        <BotaoRedondo
          $destaque
          onPress={() => {
            avisou.current = false;
            setRodando((v) => !v);
          }}
          accessibilityLabel={rodando ? "Pausar" : "Retomar"}
        >
          <MaterialIcons name={rodando ? "pause" : "play-arrow"} size={24} color={cores.branco} />
        </BotaoRedondo>
        <BotaoRedondo onPress={() => ajustar(15)} accessibilityLabel="Adicionar 15 segundos">
          <MaterialIcons name="add" size={22} color={cores.branco} />
        </BotaoRedondo>
        <BotaoRedondo onPress={onFechar} accessibilityLabel="Fechar cronômetro">
          <MaterialIcons name="close" size={22} color={cores.branco} />
        </BotaoRedondo>
      </Controles>
    </Barra>
  );
}
