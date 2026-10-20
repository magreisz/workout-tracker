import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

import { cores } from "../theme";

const estilos = {
  primario: { fundo: cores.primaria, texto: cores.branco, borda: cores.primaria },
  secundario: { fundo: cores.branco, texto: cores.primaria, borda: cores.primaria },
  perigo: { fundo: cores.branco, texto: cores.perigo, borda: cores.perigo },
  escuro: { fundo: cores.escuro, texto: cores.branco, borda: cores.escuro },
};

const Toque = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${(p) => p.$estilo.borda};
  background-color: ${(p) => p.$estilo.fundo};
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  margin-vertical: 6px;
`;

const Texto = styled.Text`
  color: ${(p) => p.$cor};
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  margin-left: ${(p) => (p.$comIcone ? "8px" : "0px")};
`;

export default function Botao({
  titulo,
  onPress,
  variante = "primario",
  icone,
  carregando = false,
  disabled = false,
  style,
}) {
  const estilo = estilos[variante];
  const bloqueado = disabled || carregando;

  return (
    <Toque
      $estilo={estilo}
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
          {icone ? <MaterialIcons name={icone} size={20} color={estilo.texto} /> : null}
          <Texto $cor={estilo.texto} $comIcone={Boolean(icone)}>
            {titulo}
          </Texto>
        </>
      )}
    </Toque>
  );
}
