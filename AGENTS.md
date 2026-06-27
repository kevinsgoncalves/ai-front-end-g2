# Contexto do Agente — Branch: `feature/layout-frontend`

Você está atuando como um **Engenheiro Front-end Sênior** especialista em **React, TypeScript, Vite, CSS Responsivo, Acessibilidade (WCAG 2.1) e Clean Code**.

Sua missão nesta branch é implementar **exclusivamente a camada de apresentação (UI)** do projeto **MindJournal AI**, preparando a interface para as próximas fases sem implementar qualquer lógica de negócio.

---

# 📖 FONTES DE REFERÊNCIA (Leitura obrigatória)

Antes de qualquer decisão, leia integralmente:

1. `AGENTS.md`
2. `docs/specs/01-backend-architecture.md`
3. `docs/specs/02-frontend-architecture.md`
4. `docs/plans/02-frontend-plan.md`
5. todos os arquivos existentes em `src/`
6. `package.json`
7. `vite.config.ts`
8. `tsconfig.json`
9. demais arquivos de configuração do TypeScript

A implementação deve seguir rigorosamente a arquitetura aprovada.

---

# 🎯 Objetivo da Branch

Implementar exclusivamente o **layout base responsivo** da SPA.

Esta etapa contempla apenas a construção visual dos componentes React.

Nenhuma integração com API deverá existir.

Nenhuma regra de negócio deverá existir.

Nenhum estado funcional deverá existir.

---

# 🧩 Componentes previstos

Implemente apenas os componentes definidos na arquitetura:

* `Sidebar`
* `ChatArea`
* `MessageBubble`
* `ChatInput`
* `UploadZone`
* `ProgressBar`
* `HealthIndicator`

O componente `App.tsx` deve apenas organizar esses componentes na tela.

Não deve possuir:

* estado próprio;
* lógica de negócio;
* chamadas HTTP;
* efeitos colaterais;
* regras de sessão;
* regras de upload;
* regras de chat.

---

# 📂 Arquivos permitidos

## Criar

```text
src/components/Sidebar.tsx
src/components/ChatArea.tsx
src/components/MessageBubble.tsx
src/components/ChatInput.tsx
src/components/UploadZone.tsx
src/components/ProgressBar.tsx
src/components/HealthIndicator.tsx
```

## Modificar

```text
src/App.tsx
src/App.css
src/index.css
```

## Preservar obrigatoriamente

```text
src/main.tsx

src/hooks/
src/services/
src/types/
src/utils/

README.md
docs/
AGENTS.md
vite.config.ts
package.json
tsconfig.json
```

Não alterar nenhum contrato TypeScript existente.

---

# 🖥 Estrutura visual esperada

A aplicação deve possuir:

## Header

* título **MindJournal AI**
* pequena descrição opcional
* componente `HealthIndicator`
* indicador inicial:

```text
Verificando...
```

---

## Sidebar

Título:

```text
Sessões
```

Botão:

```text
Nova sessão
```

Estado inicial:

```text
Nenhuma sessão ainda
```

Preparar espaço visual para futura lista de sessões.

Preparar estilo para futura sessão ativa.

---

## Área principal

Deve conter:

* identificação da sessão
* área scrollável de mensagens
* placeholder

```text
Nenhuma mensagem ainda.
Escreva algo!
```

Preparar visualmente:

* mensagens do usuário
* mensagens do assistente

---

## ChatInput

Campo de texto

Botão enviar

Ambos desabilitados visualmente.

---

## UploadZone

Área preparada para Drag-and-Drop.

Texto:

```text
Arraste arquivos .txt ou .pdf
ou clique para selecionar
```

Também apresentar:

```text
Limite máximo: 10 MB
```

Estado inicial desabilitado.

Preparar espaço para futura `ProgressBar`.

---

## ProgressBar

Apenas estrutura visual.

Percentual inicial:

```text
0%
```

Sem animação funcional.

---

# 🎨 Direção visual

A identidade visual deve representar um diário pessoal moderno.

Utilizar:

* fundo claro;
* superfícies brancas;
* sombras discretas;
* cantos arredondados;
* boa hierarquia visual;
* espaçamento confortável;
* contraste adequado;
* aparência limpa.

Preparar diferenciação visual para:

* mensagens do usuário;
* mensagens do assistente.

Não utilizar bibliotecas externas.

Todo o CSS deverá ser próprio.

---

# 📱 Responsividade

## Desktop

* Sidebar fixa à esquerda
* Chat ocupa restante da largura
* Área de mensagens scrollável

## Tablet

* Sidebar reduzida
* Layout em duas colunas

## Mobile

* Layout em coluna
* Sidebar acima do chat
* Componentes adaptados ao toque
* Sem rolagem horizontal

---

# ♿ Acessibilidade

A interface deve utilizar:

* `header`
* `aside`
* `main`
* `section`

Aplicar:

* `aria-label`
* foco visível
* contraste adequado
* `role="progressbar"`
* elementos desabilitados identificados
* estrutura preparada para leitores de tela

---

# 🚫 Restrições inegociáveis

Não implementar:

* Hooks
* Services
* Axios
* Fetch
* chamadas HTTP
* Context API
* Redux
* Zustand
* lógica de sessões
* chat funcional
* upload funcional
* drag-and-drop funcional
* Health Check
* polling
* histórico
* loading real
* estados reais
* dados simulados de usuário

Não instalar bibliotecas de UI.

Não alterar:

* documentação;
* README;
* AGENTS;
* contratos TypeScript.

Não avançar para próximas fases.

---

# ✅ Critérios de aceite

Ao finalizar esta branch:

* Layout completo renderizado.
* Componentes separados conforme arquitetura.
* `App.tsx` apenas compõe os componentes.
* CSS organizado e responsivo.
* Estrutura semântica implementada.
* Acessibilidade básica aplicada.
* Nenhuma integração funcional existente.
* Projeto compilando sem erros.

---

# 🧪 Validação obrigatória

Executar antes do commit:

```bash
npm install
npm run build
npm run dev
git status
```

---

# ✅ Commit sugerido

```bash
git add src
git commit -m "feat: cria layout base do MindJournal AI"
git push -u origin feature/layout-frontend
```

---

# 📌 Escopo desta Branch

Esta branch termina quando a interface visual estiver completamente implementada.

Qualquer implementação envolvendo:

* Hooks
* Services
* Axios
* Integração REST
* Sessões
* Chat
* Upload
* Health Check
* Estados funcionais

pertence às próximas fases do projeto e não deve ser iniciada nesta branch.
