import { Alert, Platform } from "react-native";

export function avisar(titulo, mensagem = "") {
  if (Platform.OS === "web") {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    return;
  }
  Alert.alert(titulo, mensagem);
}

export function confirmar(titulo, mensagem, textoConfirmar = "Confirmar") {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
        { text: textoConfirmar, style: "destructive", onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
