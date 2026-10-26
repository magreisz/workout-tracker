import React, { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import Chip from "../components/Chip";
import GifExercicio from "../components/GifExercicio";
import {
  Cartao,
  LinhaNumeros,
  Numero,
  NumeroLegenda,
  NumeroValor,
  Pagina,
  Secao,
  Subtitulo,
  TextoMedio,
  TextoSuave,
} from "../components/ui";
import {
  cores,
  comAlfa,
  corDoGrupo,
  formatarDiaCurto,
  formatarNumero,
  nomeDoGrupo,
  tiposExercicio,
} from "../theme";
import { idsDoMovimento, todosExercicios } from "../data/treinos";
import { detalheDoExercicio } from "../data/exercicios";
import { listarSessoes } from "../services/storage";
import { estatisticasDoExercicio } from "../services/metricas";
import { espacoTopo } from "../utils/layout";

const Container = styled.View`
  flex: 1;
  background-color: ${cores.fundo};
`;

const Midia = styled.View`
  background-color: #ffffff;
  align-items: center;
  padding-bottom: 8px;
`;

const BotaoVoltar = styled.TouchableOpacity`
  position: absolute;
  left: 14px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: rgba(11, 12, 15, 0.72);
`;

const Nome = styled.Text`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: ${cores.texto};
  margin-top: 16px;
`;

const Chips = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const Abas = styled.View`
  flex-direction: row;
  gap: 22px;
  border-bottom-width: 1px;
  border-bottom-color: ${cores.linha};
  margin-top: 16px;
`;

const Aba = styled.TouchableOpacity`
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-color: ${(p) => (p.$ativa ? cores.destaque : "transparent")};
  margin-bottom: -1px;
`;

const AbaTexto = styled.Text`
  font-size: 14.5px;
  font-weight: 600;
  color: ${(p) => (p.$ativa ? cores.texto : cores.textoSuave)};
`;

const Musculos = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  background-color: ${cores.superficie};
  border-radius: 16px;
  padding: 14px;
`;

const IconeMusculo = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
`;

const InfoMusculos = styled.View`
  flex: 1;
`;

const Rotulo = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${cores.textoSuave};
`;

const Valor = styled.Text`
  font-size: 14.5px;
  font-weight: 600;
  color: ${cores.texto};
  margin: 2px 0 8px;
`;

const Passo = styled.View`
  flex-direction: row;
  margin-top: 12px;
`;

const PassoNumero = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background-color: ${cores.elevada};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const PassoNumeroTexto = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${cores.texto};
`;

const Dica = styled.View`
  flex-direction: row;
  background-color: ${cores.avisoSuave};
  border-width: 1px;
  border-color: rgba(255, 122, 69, 0.25);
  border-radius: 12px;
  padding: 12px;
  margin-top: 16px;
`;

const DicaTexto = styled.Text`
  flex: 1;
  margin-left: 10px;
  font-size: 13px;
  line-height: 19px;
  color: ${cores.avisoTexto};
`;

const LinhaHistorico = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 4px 0;
`;

export default function Exercicio() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const exercicio = todosExercicios().find((e) => e.id === route.params?.exercicioId);
  const detalhe = exercicio ? detalheDoExercicio(exercicio.chave) : null;
  const [aba, setAba] = useState("execucao");
  const [estatisticas, setEstatisticas] = useState(null);

  // O mesmo movimento pode estar em mais de um treino (ex.: elevação lateral em A e C):
  // os recordes juntam todos os registros com a mesma chave.
  useFocusEffect(
    useCallback(() => {
      if (!exercicio) {
        return;
      }
      listarSessoes().then((sessoes) => {
        const ids = idsDoMovimento(exercicio.chave);
        const porId = ids.map((id) => estatisticasDoExercicio(sessoes, id));
        setEstatisticas({
          maiorCarga: Math.max(...porId.map((e) => e.maiorCarga)),
          melhor1Rm: Math.max(...porId.map((e) => e.melhor1Rm)),
          melhorVolume: Math.max(...porId.map((e) => e.melhorVolume)),
          historico: porId
            .flatMap((e) => e.historico)
            .sort((a, b) => new Date(b.data) - new Date(a.data)),
        });
      });
    }, [exercicio?.id]),
  );

  if (!exercicio || !detalhe) {
    return (
      <Container style={{ paddingTop: insets.top + 20, paddingHorizontal: 18 }}>
        <TextoMedio>Exercício não encontrado.</TextoMedio>
      </Container>
    );
  }

  const cor = corDoGrupo(exercicio.grupo);
  const tipo = tiposExercicio[exercicio.tipo];

  return (
    <Container>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <Midia style={{ paddingTop: espacoTopo(insets) }}>
          <GifExercicio chave={exercicio.chave} tamanho={300} raio={0} />
          <BotaoVoltar
            style={{ top: espacoTopo(insets) }}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Voltar"
          >
            <MaterialIcons name="chevron-left" size={26} color={cores.texto} />
          </BotaoVoltar>
        </Midia>

        <Pagina>
          <Nome>{exercicio.nome}</Nome>
          <Chips>
            <Chip texto={nomeDoGrupo(exercicio.grupo)} cor={cor} />
            <Chip texto={detalhe.equipamento} />
            <Chip texto={tipo.nome} />
            <Chip
              texto={`${exercicio.series} × ${exercicio.repeticoes}${exercicio.tempo ? " s" : ""}`}
            />
          </Chips>

          <Abas>
            <Aba
              $ativa={aba === "execucao"}
              onPress={() => setAba("execucao")}
              accessibilityRole="tab"
            >
              <AbaTexto $ativa={aba === "execucao"}>Execução</AbaTexto>
            </Aba>
            <Aba
              $ativa={aba === "historico"}
              onPress={() => setAba("historico")}
              accessibilityRole="tab"
            >
              <AbaTexto $ativa={aba === "historico"}>Histórico e recordes</AbaTexto>
            </Aba>
          </Abas>

          {aba === "execucao" ? (
            <>
              <Musculos>
                <IconeMusculo style={{ backgroundColor: comAlfa(cor, 0.15) }}>
                  <MaterialCommunityIcons name="arm-flex" size={30} color={cor} />
                </IconeMusculo>
                <InfoMusculos>
                  <Rotulo>Principal</Rotulo>
                  <Valor>{detalhe.principal}</Valor>
                  <Rotulo>Auxiliares</Rotulo>
                  <Valor style={{ marginBottom: 0 }}>{detalhe.auxiliares}</Valor>
                </InfoMusculos>
              </Musculos>

              <Secao style={{ marginTop: 22 }}>
                <Subtitulo>Passo a passo</Subtitulo>
                {detalhe.passos.map((passo, i) => (
                  <Passo key={i}>
                    <PassoNumero>
                      <PassoNumeroTexto>{i + 1}</PassoNumeroTexto>
                    </PassoNumero>
                    <TextoMedio style={{ flex: 1 }}>{passo}</TextoMedio>
                  </Passo>
                ))}
              </Secao>

              <Dica>
                <MaterialIcons name="warning-amber" size={18} color={cores.aviso} />
                <DicaTexto>{detalhe.dica}</DicaTexto>
              </Dica>
            </>
          ) : (
            <>
              <Secao style={{ marginTop: 18 }}>
                <LinhaNumeros>
                  <Numero>
                    <NumeroValor>
                      {estatisticas?.maiorCarga ? formatarNumero(estatisticas.maiorCarga, 1) : "—"}
                    </NumeroValor>
                    <NumeroLegenda>maior carga (kg)</NumeroLegenda>
                  </Numero>
                  <Numero>
                    <NumeroValor>
                      {estatisticas?.melhor1Rm ? formatarNumero(estatisticas.melhor1Rm, 1) : "—"}
                    </NumeroValor>
                    <NumeroLegenda>1RM estimado</NumeroLegenda>
                  </Numero>
                  <Numero>
                    <NumeroValor>
                      {estatisticas?.melhorVolume ? formatarNumero(estatisticas.melhorVolume) : "—"}
                    </NumeroValor>
                    <NumeroLegenda>melhor volume</NumeroLegenda>
                  </Numero>
                </LinhaNumeros>
              </Secao>

              <Secao style={{ marginTop: 22 }}>
                <Subtitulo style={{ marginBottom: 10 }}>Histórico</Subtitulo>
                {estatisticas?.historico.length ? (
                  estatisticas.historico.map((registro) => (
                    <Cartao key={registro.data} style={{ marginBottom: 8 }}>
                      <LinhaHistorico>
                        <Subtitulo style={{ fontSize: 14.5 }}>
                          {formatarDiaCurto(registro.data)}
                        </Subtitulo>
                        <TextoSuave>{formatarNumero(registro.volume)} kg de volume</TextoSuave>
                      </LinhaHistorico>
                      {registro.series.map((s, i) => (
                        <LinhaHistorico key={i}>
                          <TextoMedio>Série {i + 1}</TextoMedio>
                          <TextoMedio style={{ color: cores.texto }}>
                            {s.kg ? `${formatarNumero(s.kg, 1)} kg` : "sem carga"} × {s.reps}
                          </TextoMedio>
                        </LinhaHistorico>
                      ))}
                    </Cartao>
                  ))
                ) : (
                  <TextoMedio>Você ainda não registrou este exercício.</TextoMedio>
                )}
              </Secao>
            </>
          )}
        </Pagina>
      </ScrollView>
    </Container>
  );
}
