import React from "react";
import { Platform, View } from "react-native";

// Superfície translúcida no estilo do iOS: o conteúdo de trás aparece desfocado.
// No navegador (PWA) usa backdrop-filter; no app nativo, que não desfoca sem biblioteca
// extra, a cor fica mais opaca para manter a leitura.
const intensidades = {
  leve: { web: "rgba(30,33,40,0.45)", nativo: "rgba(30,33,40,0.92)", blur: 20 },
  media: { web: "rgba(21,23,28,0.62)", nativo: "rgba(21,23,28,0.95)", blur: 28 },
  forte: { web: "rgba(11,12,15,0.72)", nativo: "rgba(11,12,15,0.97)", blur: 32 },
};

export default function Vidro({ intensidade = "media", borda = true, style, children, ...props }) {
  const config = intensidades[intensidade];
  const web = Platform.OS === "web";
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: web ? config.web : config.nativo,
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: borda ? 1 : 0,
          overflow: "hidden",
        },
        web && {
          backdropFilter: `blur(${config.blur}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${config.blur}px) saturate(180%)`,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
