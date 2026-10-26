import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

import Vidro from "./Vidro";
import { cores, formatarCronometro } from "../theme";

// Barra de descanso fixa no rodapé da tela de treino: vidro com um tom azul (descansando)
// ou verde (concluído) por cima.
const Tom = styled.View`
  padding: 12px 12px 12px 16px;
  background-color: ${(p) => (p.$concluido ? "rgba(47,210,122,0.16)" : "rgba(61,139,255,0.16)")};
`;

const Linha = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Info = styled.View`
  flex: 1;
`;

const Legenda = styled.Text`
  color: ${cores.textoMedio};
  font-size: 12px;
`;

const Tempo = styled.Text`
  color: ${cores.texto};
  font-size: 34px;
  font-weight: 800;
  font-variant: tabular-nums;
`;

const BotaoAjuste = styled.TouchableOpacity`
  height: 40px;
  min-width: 46px;
  padding: 0 10px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => (p.$destaque ? cores.destaque : "rgba(255,255,255,0.12)")};
  margin-left: 6px;
`;

const TextoAjuste = styled.Text`
  color: ${cores.texto};
  font-size: 13px;
  font-weight: 700;
`;

const Trilha = styled.View`
  height: 4px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-top: 10px;
  overflow: hidden;
`;

const Progresso = styled.View`
  height: 4px;
  background-color: ${(p) => (p.$concluido ? cores.sucesso : cores.destaque)};
`;

export default function Cronometro({ segundosIniciais = 60, legenda, onFechar }) {
  // O tempo é calculado pelo horário de término, e não por "tiques": com a tela bloqueada o
  // iPhone pausa o app, e ao voltar o cronômetro já mostra o tempo certo.
  const [total, setTotal] = useState(segundosIniciais);
  const [fim, setFim] = useState(() => Date.now() + segundosIniciais * 1000);
  const [agora, setAgora] = useState(Date.now());

  const restante = Math.max(0, Math.ceil((fim - agora) / 1000));

  useEffect(() => {
    if (restante <= 0) {
      return undefined;
    }
    const intervalo = setInterval(() => setAgora(Date.now()), 250);
    return () => clearInterval(intervalo);
  }, [restante]);

  const ajustar = (delta) => {
    const base = Date.now();
    setFim((atual) => Math.max(base, Math.max(atual, base) + delta * 1000));
    setTotal((atual) => Math.max(1, atual + delta));
    setAgora(base);
  };

  const concluido = restante === 0;
  const fracao = total > 0 ? 1 - restante / total : 1;

  return (
    <Vidro
      intensidade="leve"
      style={{
        borderRadius: 20,
        borderColor: concluido ? "rgba(47,210,122,0.45)" : "rgba(61,139,255,0.4)",
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
      }}
    >
      <Tom $concluido={concluido}>
        <Linha>
          <Info>
            <Legenda>
              {concluido ? "Descanso concluído · próxima série" : legenda || "Descansando"}
            </Legenda>
            <Tempo>{formatarCronometro(restante)}</Tempo>
          </Info>
          <BotaoAjuste onPress={() => ajustar(-15)} accessibilityLabel="Tirar 15 segundos">
            <TextoAjuste>−15</TextoAjuste>
          </BotaoAjuste>
          <BotaoAjuste onPress={() => ajustar(15)} accessibilityLabel="Adicionar 15 segundos">
            <TextoAjuste>+15</TextoAjuste>
          </BotaoAjuste>
          <BotaoAjuste
            $destaque={!concluido}
            onPress={onFechar}
            accessibilityLabel={concluido ? "Fechar descanso" : "Pular descanso"}
          >
            {concluido ? (
              <MaterialIcons name="close" size={20} color={cores.texto} />
            ) : (
              <TextoAjuste>Pular</TextoAjuste>
            )}
          </BotaoAjuste>
        </Linha>
        <Trilha>
          <Progresso $concluido={concluido} style={{ width: `${Math.min(100, fracao * 100)}%` }} />
        </Trilha>
      </Tom>
    </Vidro>
  );
}
