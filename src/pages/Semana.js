import React, { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { cores, formatarData } from "../theme";
import { treinos, proximoTreino } from "../data/treinos";
import { listarSessoes } from "../services/storage";

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${cores.fundo};
`;

const Conteudo = styled.View`
  padding: 16px;
  max-width: 520px;
  width: 100%;
  align-self: center;
`;

const Sugestao = styled.TouchableOpacity`
  background-color: ${cores.primaria};
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 18px;
  flex-direction: row;
  align-items: center;
`;

const SugestaoTextos = styled.View`
  flex: 1;
  margin-left: 14px;
`;

const SugestaoRotulo = styled.Text`
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SugestaoTitulo = styled.Text`
  color: ${cores.branco};
  font-size: 20px;
  font-weight: bold;
  margin-top: 2px;
`;

const SugestaoFoco = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin-top: 2px;
`;

const Secao = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${cores.textoSuave};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 4px 2px 10px;
`;

const Cartao = styled.TouchableOpacity`
  background-color: ${cores.branco};
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  border-left-width: 5px;
  border-left-color: ${(p) => p.$cor};
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  shadow-offset: 0px 2px;
`;

const IconeTreino = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => p.$cor}22;
`;

const CartaoTextos = styled.View`
  flex: 1;
  margin-left: 14px;
`;

const CartaoTitulo = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${cores.texto};
`;

const CartaoFoco = styled.Text`
  font-size: 13px;
  color: ${cores.textoSuave};
  margin-top: 2px;
`;

const CartaoMeta = styled.Text`
  font-size: 12px;
  color: ${cores.textoSuave};
  margin-top: 4px;
`;

const AvisoSeguranca = styled.View`
  flex-direction: row;
  background-color: ${cores.avisoFundo};
  border-radius: 12px;
  padding: 14px;
  margin-top: 8px;
`;

const AvisoTexto = styled.Text`
  flex: 1;
  margin-left: 10px;
  color: ${cores.aviso};
  font-size: 12.5px;
  line-height: 18px;
`;

export default function Semana() {
  const navigation = useNavigation();
  const [sessoes, setSessoes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      listarSessoes().then((lista) => {
        if (ativo) {
          setSessoes(lista);
        }
      });
      return () => {
        ativo = false;
      };
    }, []),
  );

  const ultimaSessao = sessoes[0] || null;
  const sugerido = proximoTreino(ultimaSessao?.treinoId);

  const ultimaPorTreino = {};
  for (const sessao of sessoes) {
    if (!ultimaPorTreino[sessao.treinoId]) {
      ultimaPorTreino[sessao.treinoId] = sessao;
    }
  }

  return (
    <Container>
      <Conteudo>
        <Sugestao
          activeOpacity={0.85}
          onPress={() => navigation.navigate("treino", { treinoId: sugerido.id })}
        >
          <MaterialCommunityIcons name={sugerido.icone} size={40} color={cores.branco} />
          <SugestaoTextos>
            <SugestaoRotulo>Sugestão de hoje</SugestaoRotulo>
            <SugestaoTitulo>
              {sugerido.titulo} — {sugerido.id}
            </SugestaoTitulo>
            <SugestaoFoco>{sugerido.foco}</SugestaoFoco>
          </SugestaoTextos>
          <MaterialIcons name="play-circle-fill" size={34} color={cores.branco} />
        </Sugestao>

        <Secao>Seus treinos</Secao>
        {treinos.map((treino) => {
          const ultima = ultimaPorTreino[treino.id];
          return (
            <Cartao
              key={treino.id}
              $cor={treino.cor}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("treino", { treinoId: treino.id })}
            >
              <IconeTreino $cor={treino.cor}>
                <MaterialCommunityIcons name={treino.icone} size={26} color={treino.cor} />
              </IconeTreino>
              <CartaoTextos>
                <CartaoTitulo>
                  {treino.titulo} ({treino.id})
                </CartaoTitulo>
                <CartaoFoco>{treino.foco}</CartaoFoco>
                <CartaoMeta>
                  {treino.exercicios.length} exercícios ·{" "}
                  {ultima ? `último em ${formatarData(ultima.data)}` : "ainda não registrado"}
                </CartaoMeta>
              </CartaoTextos>
              <MaterialIcons name="chevron-right" size={24} color={cores.textoSuave} />
            </Cartao>
          );
        })}

        <AvisoSeguranca>
          <MaterialIcons name="health-and-safety" size={20} color={cores.aviso} />
          <AvisoTexto>
            Este plano é um ponto de partida, não prescrição médica. Considerando seu histórico,
            confirme com médico/fisioterapeuta quais movimentos são seguros. Pare se sentir dor,
            tontura ou perda de equilíbrio.
          </AvisoTexto>
        </AvisoSeguranca>
      </Conteudo>
    </Container>
  );
}
