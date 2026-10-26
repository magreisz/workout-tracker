import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import Botao from "../components/Botao";
import GifExercicio from "../components/GifExercicio";
import {
  Cartao,
  CabecalhoSecao,
  Letra,
  LetraTexto,
  LinhaNumeros,
  Numero,
  NumeroLegenda,
  NumeroValor,
  NumeroVariacao,
  Pagina,
  Secao,
  Sobretitulo,
  Subtitulo,
  TextoMedio,
  TextoSuave,
  Titulo,
} from "../components/ui";
import { cores, formatarDiaCurto, formatarVolume, raio } from "../theme";
import { proximoTreino, treinos } from "../data/treinos";
import { diasDaSemana, semanasSeguidas, treinosNoMes, volumePorSemana } from "../services/metricas";

const DIAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

const Semana = styled.View`
  flex-direction: row;
  gap: 6px;
  margin-top: 18px;
`;

const Dia = styled.View`
  flex: 1;
  align-items: center;
  padding: 9px 0 10px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(p) => (p.$hoje ? cores.destaque : "transparent")};
  background-color: ${(p) => (p.$hoje ? cores.destaqueSuave : cores.superficie)};
`;

const DiaNome = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: ${cores.textoSuave};
`;

const DiaNumero = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${cores.texto};
  margin-top: 3px;
`;

const Ponto = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  margin-top: 6px;
  background-color: ${(p) => p.$cor || "transparent"};
`;

const Destaque = styled.View`
  margin-top: 22px;
  border-radius: 22px;
  overflow: hidden;
  background-color: ${cores.superficie};
`;

const Etiqueta = styled.View`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(11, 12, 15, 0.72);
  border-radius: 100px;
  padding: 6px 10px;
`;

const EtiquetaTexto = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: ${cores.texto};
`;

const DestaqueCorpo = styled.View`
  padding: 16px 18px 18px;
`;

const DestaqueTitulo = styled.Text`
  font-size: 23px;
  font-weight: 800;
  color: ${cores.texto};
`;

const Metas = styled.View`
  flex-direction: row;
  gap: 14px;
  margin: 8px 0 16px;
`;

const Meta = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MetaTexto = styled.Text`
  font-size: 13px;
  color: ${cores.textoMedio};
  margin-left: 5px;
`;

const Plano = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${cores.superficie};
  border-radius: ${raio}px;
  padding: 11px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${(p) => (p.$proximo ? "rgba(47,210,122,0.35)" : "transparent")};
`;

const Miniatura = styled.View`
  margin-right: 13px;
`;

const LetraCanto = styled.View`
  position: absolute;
  right: -5px;
  bottom: -5px;
  border-width: 3px;
  border-color: ${cores.superficie};
  border-radius: 10px;
`;

const PlanoInfo = styled.View`
  flex: 1;
`;

const Aviso = styled.View`
  flex-direction: row;
  background-color: ${cores.avisoSuave};
  border-radius: 12px;
  padding: 12px;
  margin-top: 16px;
`;

const AvisoTexto = styled.Text`
  flex: 1;
  margin-left: 10px;
  font-size: 12.5px;
  line-height: 18px;
  color: ${cores.avisoTexto};
`;

function totalSeries(treino) {
  return treino.exercicios.reduce((soma, ex) => soma + ex.series, 0);
}

function dataPorExtenso(data) {
  return data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

export default function Hoje({ sessoes, topo, fim }) {
  const navigation = useNavigation();
  const hoje = new Date();

  const sugestao = proximoTreino(sessoes[0]?.treinoId);
  const semana = useMemo(() => diasDaSemana(sessoes), [sessoes]);
  const volumes = useMemo(() => volumePorSemana(sessoes, 2), [sessoes]);
  const [volumeAnterior, volumeAtual] = [volumes[0].volume, volumes[1].volume];
  const variacao =
    volumeAnterior > 0 ? Math.round(((volumeAtual - volumeAnterior) / volumeAnterior) * 100) : null;

  const ultimaPorTreino = useMemo(() => {
    const mapa = {};
    for (const s of sessoes) {
      if (!mapa[s.treinoId]) {
        mapa[s.treinoId] = s.data;
      }
    }
    return mapa;
  }, [sessoes]);

  const treinouHoje = semana.find((d) => d.hoje)?.treinoId;
  const corDoTreino = (id) => treinos.find((t) => t.id === id)?.cor;
  const comecar = (treinoId) => navigation.navigate("treino", { treinoId });

  return (
    <ScrollView contentContainerStyle={{ paddingTop: topo, paddingBottom: fim }}>
      <Pagina>
        <Sobretitulo>{dataPorExtenso(hoje)}</Sobretitulo>
        <Titulo>{treinouHoje ? "Treino feito hoje" : "Bora treinar"}</Titulo>

        <Semana>
          {semana.map((dia, i) => (
            <Dia key={DIAS[i]} $hoje={dia.hoje}>
              <DiaNome>{DIAS[i]}</DiaNome>
              <DiaNumero>{dia.data.getDate()}</DiaNumero>
              <Ponto
                $cor={dia.treinoId ? corDoTreino(dia.treinoId) : dia.hoje ? cores.destaque : null}
              />
            </Dia>
          ))}
        </Semana>

        <Destaque>
          <GifExercicio chave={sugestao.exercicios[0].chave} altura={210} raio={0} />
          <Etiqueta>
            <EtiquetaTexto>{treinouHoje ? "PRÓXIMO TREINO" : "SUGESTÃO DE HOJE"}</EtiquetaTexto>
          </Etiqueta>
          <DestaqueCorpo>
            <DestaqueTitulo>{sugestao.titulo}</DestaqueTitulo>
            <TextoMedio>{sugestao.foco}</TextoMedio>
            <Metas>
              <Meta>
                <MaterialCommunityIcons name="dumbbell" size={15} color={cores.textoMedio} />
                <MetaTexto>{sugestao.exercicios.length} exercícios</MetaTexto>
              </Meta>
              <Meta>
                <MaterialIcons name="format-list-bulleted" size={15} color={cores.textoMedio} />
                <MetaTexto>{totalSeries(sugestao)} séries</MetaTexto>
              </Meta>
              <Meta>
                <MaterialIcons name="timer" size={15} color={cores.textoMedio} />
                <MetaTexto>~40 min</MetaTexto>
              </Meta>
            </Metas>
            <Botao
              titulo="Começar treino"
              icone="play-arrow"
              onPress={() => comecar(sugestao.id)}
            />
          </DestaqueCorpo>
        </Destaque>

        <Secao>
          <LinhaNumeros>
            <Numero>
              <NumeroValor>{treinosNoMes(sessoes)}</NumeroValor>
              <NumeroLegenda>treinos no mês</NumeroLegenda>
            </Numero>
            <Numero>
              <NumeroValor>{formatarVolume(volumeAtual)}</NumeroValor>
              <NumeroLegenda>volume na semana</NumeroLegenda>
              {variacao !== null ? (
                <NumeroVariacao $negativa={variacao < 0}>
                  {variacao > 0 ? "+" : ""}
                  {variacao}%
                </NumeroVariacao>
              ) : null}
            </Numero>
            <Numero>
              <NumeroValor>{semanasSeguidas(sessoes)}</NumeroValor>
              <NumeroLegenda>semanas seguidas</NumeroLegenda>
            </Numero>
          </LinhaNumeros>
        </Secao>

        <Secao>
          <CabecalhoSecao>
            <Subtitulo>Seus treinos</Subtitulo>
          </CabecalhoSecao>
          {treinos.map((treino) => {
            const proximo = treino.id === sugestao.id;
            const ultima = ultimaPorTreino[treino.id];
            return (
              <Plano
                key={treino.id}
                $proximo={proximo}
                activeOpacity={0.8}
                onPress={() => comecar(treino.id)}
                accessibilityLabel={`Começar ${treino.titulo}`}
              >
                <Miniatura>
                  <GifExercicio chave={treino.exercicios[0].chave} tamanho={62} />
                  <LetraCanto>
                    <Letra $cor={treino.cor}>
                      <LetraTexto>{treino.id}</LetraTexto>
                    </Letra>
                  </LetraCanto>
                </Miniatura>
                <PlanoInfo>
                  <Subtitulo style={{ fontSize: 15.5 }}>{treino.foco}</Subtitulo>
                  <TextoMedio style={{ fontSize: 13, marginTop: 2 }}>
                    {treino.diaSugerido} · {treino.exercicios.length} exercícios ·{" "}
                    {totalSeries(treino)} séries
                  </TextoMedio>
                  <TextoSuave
                    style={{ marginTop: 4, color: proximo ? cores.sucesso : cores.textoSuave }}
                  >
                    {proximo
                      ? "Próximo do rodízio"
                      : ultima
                        ? `Último: ${formatarDiaCurto(ultima)}`
                        : "Ainda não registrado"}
                  </TextoSuave>
                </PlanoInfo>
                <MaterialIcons name="chevron-right" size={22} color={cores.textoSuave} />
              </Plano>
            );
          })}
        </Secao>

        <Aviso>
          <MaterialIcons name="health-and-safety" size={20} color={cores.aviso} />
          <AvisoTexto>
            Este plano é um ponto de partida, não prescrição médica. Considerando seu histórico,
            confirme com médico/fisioterapeuta quais movimentos são seguros. Pare se sentir dor,
            tontura ou perda de equilíbrio.
          </AvisoTexto>
        </Aviso>
        <Cartao style={{ marginTop: 10, backgroundColor: "transparent", paddingHorizontal: 2 }}>
          <TextoSuave>Animações dos exercícios: ExerciseDB.</TextoSuave>
        </Cartao>
      </Pagina>
    </ScrollView>
  );
}
