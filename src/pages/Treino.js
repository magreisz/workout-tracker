import React, { useCallback, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import Cronometro from "../components/Cronometro";
import Botao from "../components/Botao";
import { cores, corDoGrupo, nomeDoGrupo, tiposExercicio } from "../theme";
import { buscarTreino } from "../data/treinos";
import { mapaUltimosRegistros, salvarSessao } from "../services/storage";
import { avisar, confirmar } from "../utils/mensagens";

const Container = styled.View`
  flex: 1;
  background-color: ${cores.fundo};
`;

const Conteudo = styled.View`
  padding: 16px;
  max-width: 560px;
  width: 100%;
  align-self: center;
`;

const Cabecalho = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 14px;
`;

const CabecalhoTextos = styled.View`
  margin-left: 12px;
  flex: 1;
`;

const Foco = styled.Text`
  font-size: 14px;
  color: ${cores.textoSuave};
`;

const Dica = styled.Text`
  font-size: 12.5px;
  color: ${cores.textoSuave};
  margin-bottom: 14px;
  line-height: 18px;
`;

const Cartao = styled.View`
  background-color: ${cores.branco};
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  shadow-offset: 0px 2px;
`;

const LinhaTopo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const NomeExercicio = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  color: ${cores.texto};
`;

const Badge = styled.View`
  background-color: ${(p) => p.$cor}22;
  border-radius: 10px;
  padding: 3px 9px;
  margin-left: 6px;
`;

const BadgeTexto = styled.Text`
  color: ${(p) => p.$cor};
  font-size: 11px;
  font-weight: bold;
`;

const Alvo = styled.Text`
  font-size: 13px;
  color: ${cores.textoSuave};
  margin-bottom: 8px;
`;

const Referencia = styled.Text`
  font-size: 12px;
  color: ${cores.primaria};
  margin-bottom: 10px;
`;

const Rotulo = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${cores.textoSuave};
  margin-bottom: 4px;
`;

const Linha = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 10px;
`;

const Coluna = styled.View`
  flex: 1;
  margin-right: ${(p) => (p.$ultima ? "0px" : "10px")};
`;

const Entrada = styled.TextInput.attrs({
  placeholderTextColor: "#9AA0A6",
})`
  background-color: ${cores.fundo};
  border-width: 1.5px;
  border-color: ${cores.borda};
  border-radius: 10px;
  height: 44px;
  padding: 0 12px;
  font-size: 15px;
  color: ${cores.texto};
`;

const SeriesLinha = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const Serie = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  margin-bottom: 6px;
  border-width: 2px;
  border-color: ${(p) => (p.$feita ? cores.sucesso : cores.borda)};
  background-color: ${(p) => (p.$feita ? cores.sucesso : cores.branco)};
`;

const SerieNum = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${(p) => (p.$feita ? cores.branco : cores.textoSuave)};
`;

const BotaoDescanso = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  background-color: ${cores.escuro};
  border-radius: 10px;
  padding: 8px 12px;
  margin-top: 2px;
`;

const BotaoDescansoTexto = styled.Text`
  color: ${cores.branco};
  font-size: 13px;
  font-weight: bold;
  margin-left: 6px;
`;

const Rodape = styled.View`
  padding: 12px 16px;
  padding-bottom: ${Platform.OS === "ios" ? "28px" : "16px"};
  background-color: ${cores.branco};
  border-top-width: 1px;
  border-top-color: ${cores.borda};
`;

const DescansoFlutuante = styled.View`
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 92px;
`;

export default function Treino() {
  const navigation = useNavigation();
  const route = useRoute();
  const treino = buscarTreino(route.params?.treinoId);

  const [registros, setRegistros] = useState({});
  const [ultimos, setUltimos] = useState({});
  const [descanso, setDescanso] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [inicio] = useState(() => Date.now());

  useEffect(() => {
    if (treino) {
      navigation.setOptions({ title: `TREINO ${treino.id}` });
    }
    mapaUltimosRegistros().then(setUltimos);
  }, [treino, navigation]);

  const atualizar = useCallback((exercicioId, campo, valor) => {
    setRegistros((atual) => ({
      ...atual,
      [exercicioId]: { ...atual[exercicioId], [campo]: valor },
    }));
  }, []);

  const alternarSerie = useCallback((exercicio, indice) => {
    setRegistros((atual) => {
      const feitas = atual[exercicio.id]?.seriesFeitas || 0;
      const novo = feitas === indice + 1 ? indice : indice + 1;
      return {
        ...atual,
        [exercicio.id]: { ...atual[exercicio.id], seriesFeitas: novo },
      };
    });
  }, []);

  const totalSeriesFeitas = useMemo(
    () => Object.values(registros).reduce((soma, r) => soma + (r.seriesFeitas || 0), 0),
    [registros],
  );

  if (!treino) {
    return (
      <Container>
        <Conteudo>
          <Foco>Treino não encontrado.</Foco>
        </Conteudo>
      </Container>
    );
  }

  const finalizar = async () => {
    const algumRegistro = Object.values(registros).some(
      (r) => r.carga || r.seriesFeitas || r.reps || r.obs,
    );
    if (!algumRegistro) {
      avisar("Nada registrado", "Marque ao menos uma série ou carga antes de finalizar.");
      return;
    }

    const confirmado = await confirmar(
      "Finalizar treino?",
      "O treino será salvo no seu histórico.",
      "Finalizar",
    );
    if (!confirmado) {
      return;
    }

    setSalvando(true);
    try {
      const sessao = {
        id: `${Date.now()}`,
        treinoId: treino.id,
        data: new Date().toISOString(),
        duracaoSegundos: Math.round((Date.now() - inicio) / 1000),
        itens: treino.exercicios.map((ex) => {
          const r = registros[ex.id] || {};
          return {
            exercicioId: ex.id,
            nome: ex.nome,
            carga: (r.carga || "").trim(),
            seriesFeitas: r.seriesFeitas || 0,
            seriesAlvo: ex.series,
            reps: (r.reps || "").trim(),
            obs: (r.obs || "").trim(),
          };
        }),
      };
      await salvarSessao(sessao);
      navigation.reset({
        index: 1,
        routes: [{ name: "semana" }, { name: "historico" }],
      });
    } catch {
      avisar("Erro", "Não foi possível salvar o treino. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Conteudo>
            <Cabecalho>
              <MaterialCommunityIcons name={treino.icone} size={34} color={treino.cor} />
              <CabecalhoTextos>
                <NomeExercicio>{treino.titulo}</NomeExercicio>
                <Foco>{treino.foco}</Foco>
              </CabecalhoTextos>
            </Cabecalho>
            <Dica>
              Aquecimento ~4 min, parte principal priorizando os compostos e término em torno de 40
              min. Termine as séries sentindo que ainda faria 1–3 repetições com boa técnica.
            </Dica>

            {treino.exercicios.map((ex) => {
              const r = registros[ex.id] || {};
              const ultimo = ultimos[ex.id];
              const tipo = tiposExercicio[ex.tipo];
              const corGrupo = corDoGrupo(ex.grupo);
              return (
                <Cartao key={ex.id}>
                  <LinhaTopo>
                    <NomeExercicio>{ex.nome}</NomeExercicio>
                    <Badge $cor={corGrupo}>
                      <BadgeTexto $cor={corGrupo}>{nomeDoGrupo(ex.grupo)}</BadgeTexto>
                    </Badge>
                  </LinhaTopo>
                  <Alvo>
                    {ex.series} séries × {ex.repeticoes}
                    {ex.tempo ? " s" : " reps"} · {tipo.nome}
                  </Alvo>
                  {ultimo && (ultimo.carga || ultimo.reps) ? (
                    <Referencia>
                      Última vez: {ultimo.carga ? `${ultimo.carga} kg` : "sem carga"}
                      {ultimo.reps ? ` · ${ultimo.reps}` : ""}
                    </Referencia>
                  ) : null}

                  <Linha>
                    <Coluna>
                      <Rotulo>Carga (kg)</Rotulo>
                      <Entrada
                        value={r.carga || ""}
                        onChangeText={(v) => atualizar(ex.id, "carga", v)}
                        placeholder="0"
                        keyboardType="numeric"
                        maxLength={7}
                      />
                    </Coluna>
                    <Coluna $ultima>
                      <Rotulo>{ex.tempo ? "Tempo / reps" : "Repetições"}</Rotulo>
                      <Entrada
                        value={r.reps || ""}
                        onChangeText={(v) => atualizar(ex.id, "reps", v)}
                        placeholder={ex.tempo ? "ex.: 40, 35 s" : "ex.: 10, 10, 9"}
                        maxLength={40}
                      />
                    </Coluna>
                  </Linha>

                  <Rotulo>Séries concluídas ({r.seriesFeitas || 0}/{ex.series})</Rotulo>
                  <SeriesLinha>
                    {Array.from({ length: ex.series }).map((_, i) => {
                      const feita = (r.seriesFeitas || 0) > i;
                      return (
                        <Serie
                          key={i}
                          $feita={feita}
                          activeOpacity={0.7}
                          onPress={() => alternarSerie(ex, i)}
                          accessibilityLabel={`Série ${i + 1}`}
                        >
                          <SerieNum $feita={feita}>{i + 1}</SerieNum>
                        </Serie>
                      );
                    })}
                  </SeriesLinha>

                  <Rotulo>Observações</Rotulo>
                  <Entrada
                    value={r.obs || ""}
                    onChangeText={(v) => atualizar(ex.id, "obs", v)}
                    placeholder="Técnica, esforço, desconforto…"
                    maxLength={120}
                    style={{ marginBottom: 10 }}
                  />

                  <BotaoDescanso
                    activeOpacity={0.8}
                    onPress={() => setDescanso({ id: `${ex.id}-${Date.now()}`, segundos: tipo.descanso })}
                  >
                    <MaterialIcons name="timer" size={18} color={cores.branco} />
                    <BotaoDescansoTexto>Descanso {tipo.descanso}s</BotaoDescansoTexto>
                  </BotaoDescanso>
                </Cartao>
              );
            })}
          </Conteudo>
        </ScrollView>

        {descanso ? (
          <DescansoFlutuante>
            <Cronometro
              key={descanso.id}
              segundosIniciais={descanso.segundos}
              onFechar={() => setDescanso(null)}
            />
          </DescansoFlutuante>
        ) : null}

        <Rodape>
          <Botao
            titulo={`Finalizar treino (${totalSeriesFeitas} séries)`}
            icone="check-circle"
            onPress={finalizar}
            carregando={salvando}
          />
        </Rodape>
      </KeyboardAvoidingView>
    </Container>
  );
}
