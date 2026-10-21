import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import Botao from "../components/Botao";
import Chip from "../components/Chip";
import Cronometro from "../components/Cronometro";
import GifExercicio from "../components/GifExercicio";
import Vidro from "../components/Vidro";
import { TextoMedio } from "../components/ui";
import {
  cores,
  corDoGrupo,
  formatarCronometro,
  formatarNumero,
  nomeDoGrupo,
  paraNumero,
  tiposExercicio,
} from "../theme";
import { buscarTreino } from "../data/treinos";
import { mapaUltimosRegistros, salvarSessao } from "../services/storage";
import { seriesDoItem } from "../services/metricas";
import { avisar, confirmar } from "../utils/mensagens";

const Container = styled.View`
  flex: 1;
  background-color: ${cores.fundo};
`;

const Topo = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 6px 14px 0;
`;

const BotaoVoltar = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
`;

const TopoInfo = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const TopoLegenda = styled.Text`
  font-size: 12px;
  color: ${cores.textoMedio};
`;

const TopoValor = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: ${cores.texto};
  font-variant: tabular-nums;
`;

const Trilha = styled.View`
  height: 4px;
  background-color: ${cores.elevada};
  border-radius: 4px;
  margin: 12px 18px;
  overflow: hidden;
`;

const Preenchido = styled.View`
  height: 4px;
  background-color: ${cores.destaque};
`;

const Conteudo = styled.View`
  padding: 6px 18px 0;
  max-width: 560px;
  width: 100%;
  align-self: center;
`;

const Bloco = styled.View`
  margin-top: 22px;
`;

const BlocoTopo = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const BlocoInfo = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const NomeExercicio = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${cores.destaque};
`;

const Chips = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Observacao = styled.TextInput.attrs({ placeholderTextColor: cores.textoSuave })`
  margin-top: 10px;
  background-color: ${cores.superficie};
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13.5px;
  color: ${cores.texto};
`;

const LinhaDescanso = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const TextoDescanso = styled.Text`
  color: ${cores.destaque};
  font-size: 13px;
  font-weight: 600;
  margin-left: 5px;
`;

const Cabecalho = styled.View`
  flex-direction: row;
  margin-top: 8px;
  padding: 0 4px;
`;

const Coluna = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: ${cores.textoSuave};
  text-align: center;
`;

const LinhaSerie = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(p) => (p.$feita ? cores.sucessoSuave : cores.superficie)};
  border-radius: 10px;
  padding: 6px 4px;
  margin-top: 6px;
`;

const Celula = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${cores.texto};
  text-align: center;
`;

const Anterior = styled.Text`
  font-size: 13px;
  color: ${cores.textoSuave};
  text-align: center;
`;

// Célula com largura proporcional: as colunas dividem a linha sem passar da largura da tela.
const CelulaFlex = styled.View`
  flex: ${(p) => p.$flex};
  min-width: 0;
  align-items: center;
  padding: 0 4px;
`;

const Entrada = styled.TextInput.attrs({ placeholderTextColor: cores.textoSuave })`
  width: 100%;
  min-width: 0;
  background-color: ${(p) => (p.$feita ? "transparent" : cores.elevada)};
  border-radius: 8px;
  height: 34px;
  font-size: 15px;
  font-weight: 600;
  color: ${cores.texto};
  text-align: center;
`;

const Check = styled.TouchableOpacity`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  align-items: center;
  justify-content: center;
  align-self: center;
  background-color: ${(p) => (p.$feita ? cores.sucesso : cores.elevada)};
`;

const BotaoAdicionar = styled.TouchableOpacity`
  height: 38px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${cores.elevada};
  margin-top: 8px;
`;

const TextoAdicionar = styled.Text`
  color: ${cores.texto};
  font-size: 14px;
  font-weight: 600;
`;

const Rodape = styled.View`
  position: absolute;
  left: 12px;
  right: 12px;
  max-width: 560px;
  align-self: center;
  width: 100%;
`;

const PESOS = { serie: 0.6, anterior: 1.3, kg: 1.1, reps: 1.1, check: 0.9 };

// Séries iniciais: o alvo do plano ou, se na última vez foram feitas mais, essa quantidade.
function seriesIniciais(exercicio, anterior) {
  const quantidade = Math.max(exercicio.series, anterior.length);
  return Array.from({ length: quantidade }, () => ({ kg: "", reps: "", feita: false }));
}

// Cronômetro do topo isolado para não redesenhar a tela inteira a cada segundo.
function TempoDecorrido({ inicio }) {
  const [agora, setAgora] = useState(Date.now());
  useEffect(() => {
    const intervalo = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);
  return <TopoValor>{formatarCronometro(Math.floor((agora - inicio) / 1000))}</TopoValor>;
}

const BlocoExercicio = memo(function BlocoExercicio({
  exercicio,
  series,
  anterior,
  obs,
  onAlterarSerie,
  onAlternarSerie,
  onAdicionarSerie,
  onObs,
  onAbrir,
}) {
  const tipo = tiposExercicio[exercicio.tipo];
  const cor = corDoGrupo(exercicio.grupo);

  return (
    <Bloco>
      <BlocoTopo
        activeOpacity={0.8}
        onPress={onAbrir}
        accessibilityLabel={`Ver como executar ${exercicio.nome}`}
      >
        <GifExercicio chave={exercicio.chave} tamanho={56} />
        <BlocoInfo>
          <NomeExercicio>{exercicio.nome}</NomeExercicio>
          <Chips>
            <Chip texto={nomeDoGrupo(exercicio.grupo)} cor={cor} />
            <Chip texto={`${tipo.nome} · ${exercicio.repeticoes}${exercicio.tempo ? " s" : ""}`} />
          </Chips>
        </BlocoInfo>
        <MaterialIcons name="info-outline" size={20} color={cores.textoSuave} />
      </BlocoTopo>

      <Observacao
        value={obs}
        onChangeText={(v) => onObs(exercicio.id, v)}
        placeholder="Observações (técnica, esforço, desconforto…)"
        maxLength={120}
      />

      <LinhaDescanso>
        <MaterialIcons name="timer" size={15} color={cores.destaque} />
        <TextoDescanso>Descanso {formatarCronometro(tipo.descanso)}</TextoDescanso>
      </LinhaDescanso>

      <Cabecalho>
        <CelulaFlex $flex={PESOS.serie}>
          <Coluna>SÉRIE</Coluna>
        </CelulaFlex>
        <CelulaFlex $flex={PESOS.anterior}>
          <Coluna>ANTERIOR</Coluna>
        </CelulaFlex>
        <CelulaFlex $flex={PESOS.kg}>
          <Coluna>KG</Coluna>
        </CelulaFlex>
        <CelulaFlex $flex={PESOS.reps}>
          <Coluna>{exercicio.tempo ? "SEG" : "REPS"}</Coluna>
        </CelulaFlex>
        <CelulaFlex $flex={PESOS.check} />
      </Cabecalho>

      {series.map((serie, i) => {
        const ant = anterior[i];
        return (
          <LinhaSerie key={i} $feita={serie.feita}>
            <CelulaFlex $flex={PESOS.serie}>
              <Celula>{i + 1}</Celula>
            </CelulaFlex>
            <CelulaFlex $flex={PESOS.anterior}>
              <Anterior numberOfLines={1}>
                {ant ? `${ant.kg ? formatarNumero(ant.kg, 1) : "—"} × ${ant.reps || "—"}` : "—"}
              </Anterior>
            </CelulaFlex>
            <CelulaFlex $flex={PESOS.kg}>
              <Entrada
                $feita={serie.feita}
                value={serie.kg}
                onChangeText={(v) => onAlterarSerie(exercicio.id, i, "kg", v)}
                placeholder={ant?.kg ? formatarNumero(ant.kg, 1) : "0"}
                keyboardType="decimal-pad"
                maxLength={6}
                accessibilityLabel={`Carga da série ${i + 1}`}
              />
            </CelulaFlex>
            <CelulaFlex $flex={PESOS.reps}>
              <Entrada
                $feita={serie.feita}
                value={serie.reps}
                onChangeText={(v) => onAlterarSerie(exercicio.id, i, "reps", v)}
                placeholder={ant?.reps ? String(ant.reps) : exercicio.repeticoes.split("–")[0]}
                keyboardType="number-pad"
                maxLength={4}
                accessibilityLabel={`Repetições da série ${i + 1}`}
              />
            </CelulaFlex>
            <CelulaFlex $flex={PESOS.check}>
              <Check
                $feita={serie.feita}
                onPress={() => onAlternarSerie(exercicio, i)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: serie.feita }}
                accessibilityLabel={`Concluir série ${i + 1}`}
              >
                <MaterialIcons
                  name="check"
                  size={20}
                  color={serie.feita ? cores.sucessoTexto : cores.textoSuave}
                />
              </Check>
            </CelulaFlex>
          </LinhaSerie>
        );
      })}

      <BotaoAdicionar
        onPress={() => onAdicionarSerie(exercicio.id)}
        accessibilityLabel="Adicionar série"
      >
        <TextoAdicionar>+ Adicionar série</TextoAdicionar>
      </BotaoAdicionar>
    </Bloco>
  );
});

export default function Treino() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const treino = buscarTreino(route.params?.treinoId);

  const [series, setSeries] = useState({});
  const [obs, setObs] = useState({});
  const [anteriores, setAnteriores] = useState({});
  const [descanso, setDescanso] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [inicio] = useState(() => Date.now());
  const [alturaTopo, setAlturaTopo] = useState(120);

  useEffect(() => {
    if (!treino) {
      return;
    }
    mapaUltimosRegistros().then((mapa) => {
      const ant = {};
      const iniciais = {};
      for (const ex of treino.exercicios) {
        ant[ex.id] = seriesDoItem(mapa[ex.id]);
        iniciais[ex.id] = seriesIniciais(ex, ant[ex.id]);
      }
      setAnteriores(ant);
      setSeries((atual) => (Object.keys(atual).length ? atual : iniciais));
    });
  }, [treino]);

  const alterarSerie = useCallback((exercicioId, indice, campo, valor) => {
    const limpo = valor.replace(campo === "kg" ? /[^0-9.,]/g : /[^0-9]/g, "");
    setSeries((atual) => ({
      ...atual,
      [exercicioId]: atual[exercicioId].map((s, i) =>
        i === indice ? { ...s, [campo]: limpo } : s,
      ),
    }));
  }, []);

  // Marcar a série usa o que foi digitado ou, se vazio, o valor da última vez (como sugestão).
  const alternarSerie = useCallback(
    (exercicio, indice) => {
      const serie = series[exercicio.id]?.[indice];
      if (!serie) {
        return;
      }
      let nova;
      if (serie.feita) {
        nova = { ...serie, feita: false };
      } else {
        // Campo vazio: repete a série anterior deste treino ou, na primeira, a da última vez.
        const ant = anteriores[exercicio.id]?.[indice];
        const acima = series[exercicio.id][indice - 1];
        nova = {
          kg: serie.kg || acima?.kg || (ant?.kg ? String(ant.kg).replace(".", ",") : ""),
          reps:
            serie.reps ||
            acima?.reps ||
            (ant?.reps ? String(ant.reps) : exercicio.repeticoes.split("–")[0]),
          feita: true,
        };
      }
      setSeries((atual) => ({
        ...atual,
        [exercicio.id]: atual[exercicio.id].map((s, i) => (i === indice ? nova : s)),
      }));
      // Concluir uma série já inicia o descanso do tipo do exercício.
      if (nova.feita) {
        setDescanso({
          id: `${exercicio.id}-${Date.now()}`,
          segundos: tiposExercicio[exercicio.tipo].descanso,
          legenda: `${exercicio.nome} · próxima: série ${indice + 2}`,
        });
      }
    },
    [series, anteriores],
  );

  const adicionarSerie = useCallback((exercicioId) => {
    setSeries((atual) => ({
      ...atual,
      [exercicioId]: [...atual[exercicioId], { kg: "", reps: "", feita: false }],
    }));
  }, []);

  const alterarObs = useCallback((exercicioId, valor) => {
    setObs((atual) => ({ ...atual, [exercicioId]: valor }));
  }, []);

  const resumo = useMemo(() => {
    let feitas = 0;
    let total = 0;
    let volume = 0;
    for (const lista of Object.values(series)) {
      for (const s of lista) {
        total += 1;
        if (s.feita) {
          feitas += 1;
          volume += paraNumero(s.kg) * paraNumero(s.reps);
        }
      }
    }
    return { feitas, total, volume };
  }, [series]);

  if (!treino) {
    return (
      <Container style={{ paddingTop: insets.top + 20, paddingHorizontal: 18 }}>
        <TextoMedio>Treino não encontrado.</TextoMedio>
      </Container>
    );
  }

  const sair = async () => {
    if (
      resumo.feitas === 0 ||
      (await confirmar("Sair do treino?", "As séries marcadas não serão salvas.", "Sair"))
    ) {
      navigation.goBack();
    }
  };

  const finalizar = async () => {
    if (resumo.feitas === 0) {
      avisar("Nada registrado", "Marque ao menos uma série antes de finalizar.");
      return;
    }
    const confirmado = await confirmar(
      "Finalizar treino?",
      `${resumo.feitas} séries · ${formatarNumero(resumo.volume)} kg de volume. O treino será salvo no seu histórico.`,
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
          const lista = (series[ex.id] || []).map((s) => ({
            kg: paraNumero(s.kg),
            reps: paraNumero(s.reps),
            feita: s.feita,
          }));
          const feitas = lista.filter((s) => s.feita);
          const maiorCarga = feitas.reduce((maior, s) => Math.max(maior, s.kg), 0);
          return {
            exercicioId: ex.id,
            nome: ex.nome,
            series: lista,
            carga: maiorCarga ? String(maiorCarga) : "",
            seriesFeitas: feitas.length,
            seriesAlvo: ex.series,
            reps: feitas.map((s) => s.reps).join(", "),
            obs: (obs[ex.id] || "").trim(),
          };
        }),
      };
      await salvarSessao(sessao);
      navigation.reset({ index: 0, routes: [{ name: "inicio", params: { aba: "progresso" } }] });
    } catch {
      avisar("Erro", "Não foi possível salvar o treino. Tente novamente.");
      setSalvando(false);
    }
  };

  const fracao = resumo.total ? resumo.feitas / resumo.total : 0;

  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: alturaTopo, paddingBottom: 150 }}
        >
          <Conteudo>
            <TextoMedio style={{ fontSize: 13, marginTop: 10 }}>
              Aquecimento ~4 min, depois priorize os compostos. Termine as séries sentindo que ainda
              faria 1–3 repetições com boa técnica.
            </TextoMedio>
            {treino.exercicios.map((ex) => (
              <BlocoExercicio
                key={ex.id}
                exercicio={ex}
                series={series[ex.id] || []}
                anterior={anteriores[ex.id] || []}
                obs={obs[ex.id] || ""}
                onAlterarSerie={alterarSerie}
                onAlternarSerie={alternarSerie}
                onAdicionarSerie={adicionarSerie}
                onObs={alterarObs}
                onAbrir={() => navigation.navigate("exercicio", { exercicioId: ex.id })}
              />
            ))}
          </Conteudo>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Topo de vidro fixo: os exercícios rolam por baixo, desfocados. */}
      <Vidro
        intensidade="forte"
        borda={false}
        onLayout={(e) => setAlturaTopo(e.nativeEvent.layout.height)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: Math.max(insets.top, 12),
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.08)",
        }}
      >
        <Topo>
          <BotaoVoltar onPress={sair} accessibilityLabel="Sair do treino">
            <MaterialIcons name="close" size={20} color={cores.texto} />
          </BotaoVoltar>
          <TopoInfo>
            <TopoLegenda>{treino.titulo}</TopoLegenda>
            <TempoDecorrido inicio={inicio} />
          </TopoInfo>
          <TopoInfo style={{ alignItems: "center" }}>
            <TopoLegenda>Volume</TopoLegenda>
            <TopoValor>{formatarNumero(resumo.volume)} kg</TopoValor>
          </TopoInfo>
          <Botao
            titulo="Finalizar"
            variante="sucesso"
            compacto
            onPress={finalizar}
            carregando={salvando}
          />
        </Topo>
        <Trilha>
          <Preenchido style={{ width: `${fracao * 100}%` }} />
        </Trilha>
      </Vidro>

      {descanso ? (
        <Rodape style={{ bottom: Math.max(insets.bottom, 12) + 8 }}>
          <Cronometro
            key={descanso.id}
            segundosIniciais={descanso.segundos}
            legenda={descanso.legenda}
            onFechar={() => setDescanso(null)}
          />
        </Rodape>
      ) : null}
    </Container>
  );
}
