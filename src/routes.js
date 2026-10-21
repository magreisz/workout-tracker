import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Inicio from "./pages/Inicio";
import Treino from "./pages/Treino";
import Exercicio from "./pages/Exercicio";
import { cores } from "./theme";

const Stack = createStackNavigator();

// Cada tela desenha o próprio topo (com vidro translúcido), então o cabeçalho padrão fica oculto.
const opcoes = {
  headerShown: false,
  cardStyle: { flex: 1, backgroundColor: cores.fundo },
};

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="inicio" screenOptions={opcoes}>
      <Stack.Screen name="inicio" component={Inicio} options={{ title: "Meu Treino" }} />
      <Stack.Screen name="treino" component={Treino} options={{ title: "Treino" }} />
      <Stack.Screen name="exercicio" component={Exercicio} options={{ title: "Exercício" }} />
    </Stack.Navigator>
  );
}
