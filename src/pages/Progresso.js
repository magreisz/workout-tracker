import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import {
  Cartao,
  CabecalhoSecao,
  Letra,
  LetraTexto,
  Link,
  Pagina,
  Secao,
  Sobretitulo,
  Subtitulo,
  TextoMedio,
  TextoSuave,
  Titulo,
} from "../components/ui";
import { cores, formatarDiaCurto, formatarDuracao, formatarNumero, formatarVolume } from "../theme";
import { buscarTreino } from "../data/treinos";
import { removerSessao } from "../services/storage";
import {
  calendarioDoMes,
  maiorCargaDoItem,
  recordesDaSessao,
  seriesDaSessao,
  seriesDoItem,
  volumeDaSessao,
  volumePorSemana,
} from "../services/metricas";
import { confirmar } from "../utils/mensagens";

const DIAS = ["S", "T", "Q", "Q", "S", "S", "D"];

// Sessões salvas antes da troca de plano (sem pernas) não guardam o foco: mostra o do plano antigo.
const FOCO_PLANO_ANTIGO = {
  A: "Peito, ombros e tríceps",
  B: "Costas, bíceps e abdômen",
  C: "Pernas, ombros e abdômen",
};

const Grande = styled.Text`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: ${cores.texto};
  margin-top: 2px;
`;

const Variacao = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => (p.$negativa ? cores.perigo : cores.sucesso)};
`;

const Barras = styled.View`
  flex-direction: row;
  align-items: flex-end;
  height: 120px;
  gap: 8px;
  margin-top: 16px;
`;

const Barra = styled.View`
  flex: 1;
  border-radius: 6px;
  min-height: 4px;
  background-color: ${(p) => (p.$atual ? cores.destaque : cores.elevada)};
`;

const Rotulos = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 6px;
`;

const RotuloBarra = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 10px;
  color: ${cores.textoSuave};
`;

const Grade = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Celula = styled.View`
  width: 14.2857%;
  padding: 3px;
`;

const Quadrado = styled.View`
  height: 30px;
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => p.$cor || cores.elevada};
  opacity: ${(p) => (p.$futuro ? 0.4 : 1)};
`;

const NumeroDia = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => (p.$escuro ? cores.fundo : cores.textoSuave)};
`;

const Legenda = styled.View`
  flex-direction: row;
  gap: 14px;
  margin-top: 10px;
`;

const ItemLegenda = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const Bolinha = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background-color: ${(p) => p.$cor};
`;

const SessaoTopo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Kpis = styled.View`
  flex-direction: row;
  gap: 16px;
  margin-top: 10px;
`;

const Lista = styled.View`
  border-top-width: 1px;
  border-top-color: ${cores.linha};
  margin-top: 10px;
  padding-top: 8px;
`;

const LinhaItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
`;

const Selo = styled.Text`
  font-size: 10px;
  font-weight: 800;
  color: #2b1a00;
  background-color: ${cores.recorde};
  border-radius: 4px;
  padding: 1px 5px;
  margin-left: 6px;
  overflow: hidden;
`;

const BotaoApagar = styled.TouchableOpacity`
  padding: 6px;
  margin: -6px -6px -6px 6px;
`;

const Vazio = styled.View`
  align-items: center;
  padding: 28px 10px;
`;

function Kpi({ valor, legenda }) {
  return (
    <TextoMedio style={{ fontSize: 13 }}>
      <TextoMedio style={{ color: cores.texto, fontWeight: "700", fontSize: 13 }}>
        {valor}
      </TextoMedio>{" "}
      {legenda}
    </TextoMedio>
  );
}

function resumoDoItem(item) {
  const series = seriesDoItem(item);
  const carga = maiorCargaDoItem(item);
  if (!series.length) {
    return null;
  }
  return carga ? `${series.length} × ${formatarNumero(carga, 1)} kg` : `${series.length} séries`;
}

export default function Progresso({ sessoes, recarregar, topo, fim }) {
  const [verTodos, setVerTodos] = useState(false);
  const hoje = new Date();

  const semanas = useMemo(() => volumePorSemana(sessoes, 8), [sessoes]);
  const calendario = useMemo(() => calendarioDoMes(sessoes), [sessoes]);
  const maiorSemana = Math.max(1, ...semanas.map((s) => s.volume));
  const atual = semanas[semanas.length - 1].volume;
  const anterior = semanas[semanas.length - 2].volume;
  const variacao = anterior > 0 ? Math.round(((atual - anterior) / anterior) * 100) : null;
  const noMes = calendario.filter((c) => c?.treinoId).length;

  const visiveis = verTodos ? sessoes : sessoes.slice(0, 5);

  const apagar = async (sessao) => {
    const treino = buscarTreino(sessao.treinoId);
    const ok = await confirmar(
      "Apagar treino?",
      `${treino?.titulo || "Treino"} de ${formatarDiaCurto(sessao.data)} será removido do histórico.`,
      "Apagar",
    );
    if (ok) {
      await removerSessao(sessao.id);
      recarregar();
    }
  };

  const mes = hoje.toLocaleDateString("pt-BR", { month: "long" });

  return (
    <ScrollView contentContainerStyle={{ paddingTop: topo, paddingBottom: fim }}>
      <Pagina>
        <Sobretitulo>{mes}</Sobretitulo>
        <Titulo>Progresso</Titulo>

        <Secao style={{ marginTop: 18 }}>
          <Cartao style={{ padding: 16 }}>
            <TextoMedio style={{ fontSize: 13 }}>Volume desta semana</TextoMedio>
            <Grande>
              {formatarVolume(atual)}{" "}
              {variacao !== null ? (
                <Variacao $negativa={variacao < 0}>
                  {variacao > 0 ? "+" : ""}
                  {variacao}% vs. semana passada
                </Variacao>
              ) : null}
            </Grande>
            <Barras>
              {semanas.map((s, i) => (
                <Barra
                  key={s.inicio.toISOString()}
                  $atual={i === semanas.length - 1}
                  style={{ height: `${Math.max(3, (s.volume / maiorSemana) * 100)}%` }}
                />
              ))}
            </Barras>
            <Rotulos>
              {semanas.map((s) => (
                <RotuloBarra key={s.inicio.toISOString()}>
                  {String(s.inicio.getDate()).padStart(2, "0")}/
                  {String(s.inicio.getMonth() + 1).padStart(2, "0")}
                </RotuloBarra>
              ))}
            </Rotulos>
          </Cartao>
        </Secao>

        <Secao>
          <CabecalhoSecao>
            <Subtitulo>Frequência</Subtitulo>
            <TextoSuave style={{ fontSize: 13 }}>
              {noMes} {noMes === 1 ? "treino" : "treinos"} no mês
            </TextoSuave>
          </CabecalhoSecao>
          <Cartao style={{ padding: 10 }}>
            <Grade>
              {DIAS.map((d, i) => (
                <Celula key={`c${i}`}>
                  <TextoSuave style={{ textAlign: "center", fontSize: 11, fontWeight: "600" }}>
                    {d}
                  </TextoSuave>
                </Celula>
              ))}
              {calendario.map((c, i) => {
                const cor = c?.treinoId ? buscarTreino(c.treinoId)?.cor : null;
                return (
                  <Celula key={i}>
                    {c ? (
                      <Quadrado $cor={cor} $futuro={c.futuro}>
                        <NumeroDia $escuro={Boolean(cor)}>{c.dia}</NumeroDia>
                      </Quadrado>
                    ) : (
                      <Quadrado $cor="transparent" />
                    )}
                  </Celula>
                );
              })}
            </Grade>
          </Cartao>
          <Legenda>
            {["A", "B", "C"].map((id) => (
              <ItemLegenda key={id}>
                <Bolinha $cor={buscarTreino(id).cor} />
                <TextoSuave>Treino {id}</TextoSuave>
              </ItemLegenda>
            ))}
          </Legenda>
        </Secao>

        <Secao>
          <CabecalhoSecao>
            <Subtitulo>Últimos treinos</Subtitulo>
            {sessoes.length > 5 ? (
              <Link onPress={() => setVerTodos((v) => !v)}>
                {verTodos ? "Ver menos" : "Ver todos"}
              </Link>
            ) : null}
          </CabecalhoSecao>

          {sessoes.length === 0 ? (
            <Cartao>
              <Vazio>
                <MaterialIcons name="insights" size={34} color={cores.textoSuave} />
                <TextoMedio style={{ textAlign: "center", marginTop: 8 }}>
                  Finalize seu primeiro treino para ver o volume, a frequência e os recordes aqui.
                </TextoMedio>
              </Vazio>
            </Cartao>
          ) : (
            visiveis.map((sessao) => {
              const treino = buscarTreino(sessao.treinoId);
              const recordes = recordesDaSessao(sessao, sessoes);
              const itens = sessao.itens.filter((item) => resumoDoItem(item));
              return (
                <Cartao key={sessao.id} style={{ marginBottom: 10 }}>
                  <SessaoTopo>
                    <Letra $cor={treino?.cor || cores.textoMedio} style={{ marginRight: 10 }}>
                      <LetraTexto>{sessao.treinoId}</LetraTexto>
                    </Letra>
                    <Subtitulo style={{ flex: 1, fontSize: 15 }} numberOfLines={1}>
                      {sessao.foco || FOCO_PLANO_ANTIGO[sessao.treinoId] || "Treino"}
                    </Subtitulo>
                    <TextoSuave>{formatarDiaCurto(sessao.data)}</TextoSuave>
                    <BotaoApagar onPress={() => apagar(sessao)} accessibilityLabel="Apagar treino">
                      <MaterialIcons name="delete-outline" size={19} color={cores.textoSuave} />
                    </BotaoApagar>
                  </SessaoTopo>
                  <Kpis>
                    <Kpi valor={formatarDuracao(sessao.duracaoSegundos)} legenda="" />
                    <Kpi valor={seriesDaSessao(sessao)} legenda="séries" />
                    <Kpi valor={`${formatarNumero(volumeDaSessao(sessao))} kg`} legenda="volume" />
                  </Kpis>
                  {itens.length ? (
                    <Lista>
                      {itens.map((item) => (
                        <LinhaItem key={item.exercicioId}>
                          <TextoMedio style={{ fontSize: 13, flex: 1 }} numberOfLines={1}>
                            {item.nome}
                          </TextoMedio>
                          <TextoMedio
                            style={{ fontSize: 13, color: cores.texto, fontWeight: "600" }}
                          >
                            {resumoDoItem(item)}
                          </TextoMedio>
                          {recordes.has(item.exercicioId) ? <Selo>PR</Selo> : null}
                        </LinhaItem>
                      ))}
                    </Lista>
                  ) : null}
                </Cartao>
              );
            })
          )}
        </Secao>
      </Pagina>
    </ScrollView>
  );
}
