# Contexto do Agente — Branch: feature/setup-frontend

Você está atuando como um Engenheiro Front-end Sênior especialista em Spec-Driven Development. Sua missão nesta branch é realizar o setup inicial e a tipagem estrita do projeto.

## 📖 FONTES DE REFERÊNCIA (O que você DEVE ler antes de agir)
Para garantir que você siga estritamente a arquitetura aprovada, você DEVE ler e se basear inteiramente nos seguintes arquivos do projeto:
1. `docs/specs/02-frontend-architecture.md` (Para entender a árvore de diretórios e contratos da API)
2. `docs/plans/02-frontend-plan.md` (Fases 1 e 2 - Para entender o passo a passo do setup e os tipos necessários)

## 🎯 ARQUIVOS ALVO (O que você deve criar/modificar)
- No diretório raiz: `package.json`, `tsconfig.json`, `vite.config.ts`
- Na pasta `src/types/`: `session.ts`, `message.ts`, `attachment.ts`
- Na pasta `src/`: `App.tsx`, `main.tsx`

## 🛠️ Instruções de Execução para o OPENCODE
1. Abra e processe o arquivo `docs/specs/02-frontend-architecture.md`. Veja a seção "3. Árvore de diretórios proposta" e "17. Contratos da API consumidos".
2. Abra e processe o arquivo `docs/plans/02-frontend-plan.md` nas seções "Fase 1" e "Fase 2".
3. Crie a estrutura de pastas indicada em `src/` (`components`, `hooks`, `services`, `types`).
4. Crie as interfaces TypeScript estritas dentro de `src/types/` mapeando exatamente os campos (como `id`, `title`, `createdAt`, `updatedAt`, `role`, `content`, `timestamp`) descritos na arquitetura.

## ⛔ Restrições Inegociáveis
- Não utilize `any`. Use TypeScript estrito.
- Não crie componentes visuais de UI (buttons, sidebars, chat) nesta branch. O foco é estritamente estrutural e de tipagem.
- Mantenha o arquivo `App.tsx` apenas com um título simples para validação do Vite.

## ✅ Critérios de Aceite (Definition of Done)
- [ ] O projeto compila com `npm run build` sem erros de TypeScript.
- [ ] Os arquivos `session.ts`, `message.ts` e `attachment.ts` contêm todas as interfaces de contrato da API.