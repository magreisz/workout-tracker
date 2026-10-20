import React, { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { cores, formatarDataHora, formatarDuracao } from "../theme";
import { buscarTreino } from "../data/treinos";
import { listarSessoes, removerSessao } from "../services/storage";
import { confirmar } from "../utils/mensagens";

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${cores.fundo};
`;

const Conteudo = styled.View`
  padding: 16px;
  max-width: 560px;
  width: 100%;
  align-self: center;
`;

const Resumo = styled.View`
  flex-direction: row;
  background-color: ${cores.branco};
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Metrica = styled.View`
  flex: 1;
  align-items: center;
`;

const MetricaNumero = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${cores.primaria};
`;

const MetricaRotulo = styled.Text`
  font-size: 12px;
  color: ${cores.textoSuave};
  margin-top: 2px;
  text-align: center;
`;

const Vazio = styled.View`
  align-items: center;
  padding: 48px 24px;
`;

const VazioTexto = styled.Text`
  font-size: 15px;
  color: ${cores.textoSuave};
  text-align: center;
  margin-top: 12px;
`;

const Cartao = styled.View`
  background-color: ${cores.branco};
  border-radius: 14px;
  margin-bottom: 12px;
  border-left-width: 5px;
  border-left-color: ${(p) => p.$cor};
  overflow: hidden;
`;

const CartaoTopo = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 14px;
`;

const CartaoTextos = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const CartaoTitulo = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${cores.texto};
`;

const CartaoData = styled.Text`
  font-size: 12.5px;
  color: ${cores.textoSuave};
  margin-top: 2px;
`;

const Detalhes = styled.View`
  padding: 0 14px 12px;
`;

const ItemLinha = styled.View`
  flex-direction: row;
  padding: 8px 0;
  border-top-width: 1px;
  border-top-color: ${cores.fundo};
`;

const ItemNome = styled.Text`
  flex: 1;
  font-size: 14px;
  color: ${cores.texto};
`;

const ItemDados = styled.Text`
  font-size: 13px;
  color: ${cores.textoSuave};
  margin-left: 8px;
`;

const ItemObs = styled.Text`
  font-size: 12px;
  color: ${cores.textoSuave};
  font-style: italic;
  margin-top: 2px;
`;

const Remover = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  padding: 8px 0;
  margin-top: 4px;
`;

const RemoverTexto = styled.Text`
  color: ${cores.perigo};
  font-size: 13px;
  font-weight: bold;
  margin-left: 6px;
`;

export default function Historico() {
  const [sessoes, setSessoes] = useState([]);
  const [abertos, setAbertos] = useState({});

  const carregar = useCallback(() => {
    listarSessoes().then(setSessoes);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const alternar = (id) => {
    setAbertos((atual) => ({ ...atual, [id]: !atual[id] }));
  };

  const excluir = async (id) => {
    const ok = await confirmar(
      "Excluir registro?",
      "Esse treino será removido do histórico.",
      "Excluir",
    );
    if (ok) {
      await removerSessao(id);
      carregar();
    }
  };

  const esteMes = sessoes.filter((s) => {
    const d = new Date(s.data);
    const agora = new Date();
    return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
  }).length;

  return (
    <Container>
      <Conteudo>
        <Resumo>
          <Metrica>
            <MetricaNumero>{sessoes.length}</MetricaNumero>
            <MetricaRotulo>Treinos no total</MetricaRotulo>
          </Metrica>
          <Metrica>
            <MetricaNumero>{esteMes}</MetricaNumero>
            <MetricaRotulo>Neste mês</MetricaRotulo>
          </Metrica>
        </Resumo>

        {sessoes.length === 0 ? (
          <Vazio>
            <MaterialCommunityIcons name="clipboard-text-outline" size={48} color={cores.borda} />
            <VazioTexto>
              Nenhum treino registrado ainda. Conclua um treino para vê-lo aqui.
            </VazioTexto>
          </Vazio>
        ) : (
          sessoes.map((sessao) => {
            const treino = buscarTreino(sessao.treinoId);
            const cor = treino?.cor || cores.primaria;
            const aberto = abertos[sessao.id];
            const comRegistro = sessao.itens.filter(
              (i) => i.carga || i.seriesFeitas || i.reps || i.obs,
            );
            return (
              <Cartao key={sessao.id} $cor={cor}>
                <CartaoTopo activeOpacity={0.7} onPress={() => alternar(sessao.id)}>
                  <MaterialCommunityIcons
                    name={treino?.icone || "dumbbell"}
                    size={26}
                    color={cor}
                  />
                  <CartaoTextos>
                    <CartaoTitulo>
                      Treino {sessao.treinoId} — {treino?.foco || ""}
                    </CartaoTitulo>
                    <CartaoData>
                      {formatarDataHora(sessao.data)} · {formatarDuracao(sessao.duracaoSegundos)}
                    </CartaoData>
                  </CartaoTextos>
                  <MaterialIcons
                    name={aberto ? "expand-less" : "expand-more"}
                    size={24}
                    color={cores.textoSuave}
                  />
                </CartaoTopo>

                {aberto ? (
                  <Detalhes>
                    {comRegistro.length === 0 ? (
                      <ItemObs>Sem dados registrados.</ItemObs>
                    ) : (
                      comRegistro.map((item) => (
                        <ItemLinha key={item.exercicioId}>
                          <ItemNome>
                            {item.nome}
                            {item.obs ? <ItemObs>{"\n"}{item.obs}</ItemObs> : null}
                          </ItemNome>
                          <ItemDados>
                            {item.carga ? `${item.carga} kg` : "—"}
                            {"\n"}
                            {item.seriesFeitas}/{item.seriesAlvo} séries
                            {item.reps ? `\n${item.reps}` : ""}
                          </ItemDados>
                        </ItemLinha>
                      ))
                    )}
                    <Remover onPress={() => excluir(sessao.id)}>
                      <MaterialIcons name="delete-outline" size={18} color={cores.perigo} />
                      <RemoverTexto>Excluir registro</RemoverTexto>
                    </Remover>
                  </Detalhes>
                ) : null}
              </Cartao>
            );
          })
        )}
      </Conteudo>
    </Container>
  );
}
