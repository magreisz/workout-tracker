import React from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import Chip from "../components/Chip";
import GifExercicio from "../components/GifExercicio";
import {
  CabecalhoSecao,
  Letra,
  LetraTexto,
  Pagina,
  Secao,
  Sobretitulo,
  Subtitulo,
  TextoMedio,
  Titulo,
} from "../components/ui";
import { cores, corDoGrupo, nomeDoGrupo, raio } from "../theme";
import { treinos } from "../data/treinos";

const Linha = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${cores.superficie};
  border-radius: ${raio}px;
  padding: 10px;
  margin-bottom: 8px;
`;

const Info = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const Chips = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const TituloTreino = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export default function Exercicios({ topo, fim }) {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ paddingTop: topo, paddingBottom: fim }}>
      <Pagina>
        <Sobretitulo>Seu plano</Sobretitulo>
        <Titulo>Exercícios</Titulo>
        <TextoMedio style={{ marginTop: 6 }}>
          Toque em um exercício para ver a execução animada, os músculos trabalhados e seus
          recordes.
        </TextoMedio>

        {treinos.map((treino) => (
          <Secao key={treino.id}>
            <CabecalhoSecao>
              <TituloTreino>
                <Letra $cor={treino.cor}>
                  <LetraTexto>{treino.id}</LetraTexto>
                </Letra>
                <Subtitulo>{treino.foco}</Subtitulo>
              </TituloTreino>
            </CabecalhoSecao>
            {treino.exercicios.map((ex) => (
              <Linha
                key={ex.id}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("exercicio", { exercicioId: ex.id })}
                accessibilityLabel={`Ver como executar ${ex.nome}`}
              >
                <GifExercicio chave={ex.chave} tamanho={58} />
                <Info>
                  <Subtitulo style={{ fontSize: 15 }}>{ex.nome}</Subtitulo>
                  <Chips>
                    <Chip texto={nomeDoGrupo(ex.grupo)} cor={corDoGrupo(ex.grupo)} />
                    <Chip texto={`${ex.series} × ${ex.repeticoes}${ex.tempo ? " s" : ""}`} />
                  </Chips>
                </Info>
                <MaterialIcons name="chevron-right" size={22} color={cores.textoSuave} />
              </Linha>
            ))}
          </Secao>
        ))}
      </Pagina>
    </ScrollView>
  );
}
