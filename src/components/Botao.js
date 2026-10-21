import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

import { cores } from "../theme";

const estilos = {
  primario: { fundo: cores.destaque, texto: cores.branco },
  secundario: { fundo: cores.elevada, texto: cores.texto },
  sucesso: { fundo: cores.sucesso, texto: cores.sucessoTexto },
  perigo: { fundo: "rgba(255,90,95,0.12)", texto: cores.perigo },
};

const Toque = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: ${(p) => (p.$compacto ? "38px" : "52px")};
  padding: 0 ${(p) => (p.$compacto ? "14px" : "18px")};
  border-radius: ${(p) => (p.$compacto ? "10px" : "14px")};
  background-color: ${(p) => p.$estilo.fundo};
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
`;

const Texto = styled.Text`
  color: ${(p) => p.$cor};
  font-size: ${(p) => (p.$compacto ? "14px" : "16px")};
  font-weight: 700;
  margin-left: ${(p) => (p.$comIcone ? "8px" : "0px")};
`;

export default function Botao({
  titulo,
  onPress,
  variante = "primario",
  icone,
  carregando = false,
  disabled = false,
  compacto = false,
  style,
}) {
  const estilo = estilos[variante];
  const bloqueado = disabled || carregando;

  return (
    <Toque
      $estilo={estilo}
      $compacto={compacto}
      onPress={onPress}
      disabled={bloqueado}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
      style={style}
    >
      {carregando ? (
        <ActivityIndicator color={estilo.texto} />
      ) : (
        <>
          {icone ? (
            <MaterialIcons name={icone} size={compacto ? 18 : 20} color={estilo.texto} />
          ) : null}
          <Texto $cor={estilo.texto} $comIcone={Boolean(icone)} $compacto={compacto}>
            {titulo}
          </Texto>
        </>
      )}
    </Toque>
  );
}
