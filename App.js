import React from "react";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Routes from "./src/routes";
import { cores } from "./src/theme";

// Tema escuro também na navegação, para não piscar branco entre as telas.
const tema = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: cores.destaque,
    background: cores.fundo,
    card: cores.fundo,
    text: cores.texto,
    border: cores.linha,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <SafeAreaProvider>
        <NavigationContainer theme={tema}>
          <StatusBar style="light" translucent backgroundColor="transparent" />
          <Routes />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
