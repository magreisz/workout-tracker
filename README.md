# Meu Treino 💪

App pessoal de musculação feito em **React Native (Expo)**. Organiza o plano de
treino 3x por semana (A/B/C), registra carga, séries, repetições e observações de
cada sessão, mantém um histórico e tem cronômetro de descanso.

É um app de uso pessoal: os dados ficam salvos **no próprio aparelho** (ou no
navegador, na versão web), sem servidor e sem login.

> ⚠️ **Aviso:** este plano é um ponto de partida, não prescrição médica. Ajuste à
> sua capacidade, técnica e equipamentos. Pare se houver dor, tontura, perda de
> equilíbrio ou sintomas incomuns, e confirme com um profissional quais movimentos
> são seguros para você.

## Funcionalidades

- **Semana:** visão dos treinos A, B e C, com sugestão de qual fazer hoje (rodízio).
- **Treino:** para cada exercício — carga (kg), marcação de séries concluídas,
  repetições e observações; mostra a carga da última vez como referência.
- **Cronômetro de descanso:** 60s/90s conforme o tipo de exercício, com ajuste e vibração.
- **Histórico:** todas as sessões registradas, com totais e detalhes por exercício.

## O plano

| Dia sugerido | Sessão | Foco |
|---|---|---|
| Segunda-feira | A | Peito, ombros e tríceps |
| Quarta-feira | B | Costas, bíceps e abdômen |
| Sexta-feira | C | Pernas, ombros e abdômen |

Os exercícios de cada treino estão em [`src/data/treinos.js`](src/data/treinos.js) —
é só editar esse arquivo para mudar exercícios, séries ou repetições.

## Usar no celular (iPhone/Android) — recomendado

A forma mais prática, **sem precisar ligar o notebook**, é usar a versão web
publicada como um "app de tela de início" (PWA):

1. Este repositório publica o app automaticamente no **GitHub Pages** a cada envio
   para a branch `main` (veja [`.github/workflows/deploy-web.yml`](.github/workflows/deploy-web.yml)).
2. Ative o Pages uma vez: **Settings → Pages → Source: GitHub Actions**.
3. Abra o link gerado no **Safari** do iPhone → botão **Compartilhar** →
   **Adicionar à Tela de Início**.
4. Pronto: abre como um app, funciona offline e guarda seus treinos no aparelho.

> O endereço fica em `https://magreisz.github.io/workout-tracker/`.

## Rodar localmente (desenvolvimento)

Requer [Node 20+](https://nodejs.org/) e o app **Expo Go** no celular (opcional).

```bash
npm install
npm start        # abre o Expo; leia o QR Code com o Expo Go
npm run web      # abre no navegador
```

Gerar a versão web estática (a mesma que o GitHub Pages publica):

```bash
npx expo export --platform web --output-dir dist
```

## Estrutura

```text
src/
├── data/treinos.js        # o plano (A/B/C) — edite aqui
├── services/storage.js    # histórico salvo no aparelho (AsyncStorage)
├── theme.js               # cores e formatação
├── components/            # Botão, Campo, Cronômetro
├── pages/                 # Semana, Treino, Histórico
└── routes.js              # navegação
assets/ilustracoes/        # ilustrações SVG dos treinos
```

---

Feito com [Claude Code](https://claude.com/claude-code).
