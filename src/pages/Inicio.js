import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import Hoje from "./Hoje";
import Exercicios from "./Exercicios";
import Progresso from "./Progresso";
import Vidro from "../components/Vidro";
import { cores } from "../theme";
import { listarSessoes } from "../services/storage";

const abas = [
  {
    id: "hoje",
    titulo: "Início",
    icone: "home-variant-outline",
    iconeAtivo: "home-variant",
    tela: Hoje,
  },
  {
    id: "exercicios",
    titulo: "Exercícios",
    icone: "dumbbell",
    iconeAtivo: "dumbbell",
    tela: Exercicios,
  },
  {
    id: "progresso",
    titulo: "Progresso",
    icone: "chart-line",
    iconeAtivo: "chart-line",
    tela: Progresso,
  },
];

// Espaço que as telas reservam no fim da rolagem para o conteúdo não ficar atrás da barra.
export const ALTURA_BARRA = 64;

const Container = styled.View`
  flex: 1;
  background-color: ${cores.fundo};
`;

const Aba = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  border-radius: 26px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => (p.$ativa ? "rgba(255,255,255,0.14)" : "transparent")};
`;

const AbaTexto = styled.Text`
  font-size: 13px;
  font-weight: 700;
  margin-left: 6px;
  color: ${cores.texto};
`;

export default function Inicio() {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [aba, setAba] = useState(route.params?.aba || "hoje");
  const [sessoes, setSessoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Ao voltar de um treino finalizado a rota pede uma aba específica.
  useEffect(() => {
    if (route.params?.aba) {
      setAba(route.params.aba);
    }
  }, [route.params?.aba]);

  const carregar = useCallback(async () => {
    setSessoes(await listarSessoes());
    setCarregando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const Tela = abas.find((a) => a.id === aba).tela;
  const baseBarra = Math.max(insets.bottom, 12);

  return (
    <Container>
      <Tela
        sessoes={sessoes}
        carregando={carregando}
        recarregar={carregar}
        topo={Math.max(insets.top, 16) + 8}
        fim={baseBarra + ALTURA_BARRA + 24}
      />

      {/* Faixa de vidro atrás da barra de status: o conteúdo rola por baixo desfocado. */}
      <Vidro
        intensidade="forte"
        borda={false}
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: insets.top }}
      />

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: baseBarra,
          alignItems: "center",
        }}
      >
        <Vidro
          intensidade="leve"
          style={{
            width: "100%",
            height: ALTURA_BARRA,
            borderRadius: ALTURA_BARRA / 2,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 6,
            maxWidth: 420,
            shadowColor: "#000",
            shadowOpacity: 0.35,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
          }}
        >
          {abas.map((a) => {
            const ativa = a.id === aba;
            return (
              <Aba
                key={a.id}
                $ativa={ativa}
                activeOpacity={0.7}
                onPress={() => setAba(a.id)}
                accessibilityRole="tab"
                accessibilityLabel={a.titulo}
                accessibilityState={{ selected: ativa }}
              >
                <MaterialCommunityIcons
                  name={ativa ? a.iconeAtivo : a.icone}
                  size={25}
                  color={ativa ? cores.texto : cores.textoMedio}
                />
                {ativa ? <AbaTexto>{a.titulo}</AbaTexto> : null}
              </Aba>
            );
          })}
        </Vidro>
      </View>
    </Container>
  );
}
