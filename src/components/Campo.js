import React, { useState } from "react";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

import { cores } from "../theme";

const Bloco = styled.View`
  width: 100%;
  margin-bottom: 12px;
`;

const Rotulo = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${cores.texto};
  margin-bottom: 4px;
`;

const Caixa = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${cores.branco};
  border-width: 1.5px;
  border-color: ${(p) => (p.$erro ? cores.perigo : cores.borda)};
  border-radius: 10px;
  padding: 0 12px;
`;

const Entrada = styled.TextInput.attrs({
  placeholderTextColor: "#9A9A9A",
})`
  flex: 1;
  height: 46px;
  font-size: 15px;
  color: ${cores.texto};
`;

const Olho = styled.TouchableOpacity`
  padding: 6px;
`;

const Erro = styled.Text`
  color: ${cores.perigo};
  font-size: 12px;
  margin-top: 4px;
`;

export default function Campo({ rotulo, icone, erro, senha = false, ...props }) {
  const [oculto, setOculto] = useState(true);

  return (
    <Bloco>
      {rotulo ? <Rotulo>{rotulo}</Rotulo> : null}
      <Caixa $erro={Boolean(erro)}>
        {icone ? (
          <MaterialIcons
            name={icone}
            size={20}
            color={cores.textoSuave}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <Entrada secureTextEntry={senha && oculto} {...props} />
        {senha ? (
          <Olho
            onPress={() => setOculto(!oculto)}
            accessibilityLabel={oculto ? "Mostrar senha" : "Ocultar senha"}
          >
            <MaterialIcons
              name={oculto ? "visibility" : "visibility-off"}
              size={20}
              color={cores.textoSuave}
            />
          </Olho>
        ) : null}
      </Caixa>
      {erro ? <Erro>{erro}</Erro> : null}
    </Bloco>
  );
}
