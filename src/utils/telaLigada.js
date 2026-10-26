import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

// Mantém a tela do celular ligada enquanto "ativo" for true (Screen Wake Lock API do navegador).
// O sistema solta o bloqueio quando o app vai para segundo plano; ao voltar, ele é pedido de novo.
// Devolve se o recurso existe neste aparelho, para a tela poder esconder o botão quando não existe.
export function useTelaLigada(ativo) {
  const suportado =
    Platform.OS === "web" && typeof navigator !== "undefined" && "wakeLock" in navigator;
  const [ligada, setLigada] = useState(false);
  const pedirRef = useRef(() => {});

  useEffect(() => {
    if (!suportado || !ativo) {
      setLigada(false);
      return undefined;
    }
    let bloqueio = null;
    let cancelado = false;

    const pedir = async () => {
      if (document.visibilityState !== "visible" || bloqueio) {
        return;
      }
      try {
        bloqueio = await navigator.wakeLock.request("screen");
        if (cancelado) {
          bloqueio.release();
          return;
        }
        setLigada(true);
        bloqueio.addEventListener("release", () => {
          bloqueio = null;
          setLigada(false);
        });
      } catch {
        setLigada(false);
      }
    };

    pedirRef.current = pedir;
    pedir();
    document.addEventListener("visibilitychange", pedir);
    return () => {
      cancelado = true;
      pedirRef.current = () => {};
      document.removeEventListener("visibilitychange", pedir);
      if (bloqueio) {
        bloqueio.release();
      }
    };
  }, [suportado, ativo]);

  // Alguns navegadores só liberam a tela ligada a partir de um toque: chame renovar() num onPress.
  const renovar = useCallback(() => pedirRef.current(), []);

  return { suportado, ligada, renovar };
}
