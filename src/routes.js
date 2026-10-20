import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

import Semana from "./pages/Semana";
import Treino from "./pages/Treino";
import Historico from "./pages/Historico";
import { cores } from "./theme";

const Stack = createStackNavigator();

const cabecalho = {
  headerTitleAlign: "center",
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: cores.branco,
  headerTitleStyle: { fontWeight: "bold" },
  cardStyle: { flex: 1 },
};

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="semana" screenOptions={cabecalho}>
      <Stack.Screen
        name="semana"
        component={Semana}
        options={({ navigation }) => ({
          title: "MEU TREINO",
          headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("historico")}
              style={{ paddingHorizontal: 12 }}
              accessibilityLabel="Ver histórico"
            >
              <MaterialIcons name="history" size={24} color={cores.branco} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="treino" component={Treino} options={{ title: "TREINO" }} />
      <Stack.Screen name="historico" component={Historico} options={{ title: "HISTÓRICO" }} />
    </Stack.Navigator>
  );
}
