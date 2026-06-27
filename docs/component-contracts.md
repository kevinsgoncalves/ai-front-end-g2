# Component Contracts — MindJourney IA (Front-end)

Este documento define os contratos de props e responsabilidades de cada componente React da aplicação. Nenhum componente realiza chamadas diretas à API — toda a comunicação HTTP é feita exclusivamente pelos serviços, consumidos pelos hooks.

---

## 1. App

**Props:** nenhuma (componente raiz)

**Responsabilidade:**
- Compor o layout global (Header, Sidebar, ChatArea, UploadZone)
- Consumir os Custom Hooks (`useSessions`, `useMessages`, `useUpload`, `useHealth`)
- Passar props para componentes filhos
- Não conter regras de estado próprias

**Estrutura visual:**
```
<header>
  <h1>MindJourney IA</h1>
  <HealthIndicator status={healthStatus} />
</header>
<div class="layout">
  <Sidebar ... />
  <main>
    <ChatArea ... />
    <ChatInput ... />
    <UploadZone ... />
  </main>
</div>
<ProgressBar percent={uploadProgress} />
```

---

## 2. Sidebar

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `sessions` | `Session[]` | Sim | Lista de sessões |
| `activeSessionId` | `number \| null` | Sim | ID da sessão ativa |
| `onSelectSession` | `(id: number) => void` | Sim | Callback ao clicar em sessão |
| `onCreateSession` | `() => void` | Sim | Callback ao clicar em "[+ Nova]" |
| `isLoading` | `boolean` | Sim | Indicador de carregamento |

**Estados:**
- **Loading:** exibe 3 skeletons pulsantes no lugar da lista
- **Vazio:** exibe "Nenhuma sessão ainda. Crie uma!"
- **Sucesso:** lista de itens clicáveis com a sessão ativa destacada visualmente
- **Erro:** tratado externamente via toast/banner no `App`

**Acessibilidade:**
- Lista com `role="listbox"` ou `role="list"`
- Cada sessão com `role="option"` / `role="listitem"` e `aria-selected` quando ativa
- Botão "[+ Nova]" com `aria-label="Criar nova sessão"`

---

## 3. ChatArea

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `messages` | `Message[]` | Sim | Lista de mensagens |
| `isLoading` | `boolean` | Sim | Indicador de carregamento |

**Responsabilidade:**
- Container scrollável que renderiza `MessageBubble` para cada mensagem
- Scroll automático para a última mensagem quando `messages` é atualizado
- Exibir placeholder quando lista vazia e não está carregando

**Estados:**
- **Loading:** exibe 2–3 skeleton messages
- **Vazio:** exibe "Nenhuma mensagem ainda. Escreva algo!"
- **Sucesso:** lista de `MessageBubble` renderizada

**Acessibilidade:**
- `role="log"` e `aria-live="polite"` para anunciar novas mensagens
- `aria-busy` durante carregamento

---

## 4. MessageBubble

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `sender` | `'USER' \| 'ASSISTANT'` | Sim | Remetente da mensagem |
| `content` | `string` | Sim | Conteúdo textual |
| `timestamp` | `string` | Sim | Data/hora (ISO 8601) |

**Responsabilidade:**
- Exibir o conteúdo da mensagem com distinção visual entre USER e ASSISTANT
- Exibir o timestamp formatado

**Estados:**
- Normal: exibe conteúdo e timestamp com estilo conforme o remetente

**Acessibilidade:**
- `role="article"`
- `aria-label` informando remetente (ex: "Mensagem do usuário" ou "Mensagem do assistente")

---

## 5. ChatInput

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `onSendMessage` | `(content: string) => void` | Sim | Callback ao enviar mensagem |
| `isDisabled` | `boolean` | Sim | Desabilitado durante envio ou se API off-line |

**Responsabilidade:**
- Input de texto com botão de envio
- Envio por Enter ou clique no botão
- Não enviar mensagens vazias ou com apenas espaços

**Estados:**
- **Habilitado:** sessão ativa e API online
- **Desabilitado:** sem sessão ativa, API offline, ou mensagem sendo enviada

**Acessibilidade:**
- Input com `aria-label="Digite sua mensagem"` (ou `<label>` associado)
- Botão com `aria-label="Enviar mensagem"`
- Placeholder: "Digite sua mensagem..." quando habilitado; "Selecione uma sessão para começar" quando desabilitado

---

## 6. UploadZone

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `onFileSelected` | `(file: File) => void` | Sim | Callback quando usuário seleciona/arrasta um arquivo |
| `isUploading` | `boolean` | Sim | Indicador de upload em andamento |
| `error` | `string \| null` | Sim | Mensagem de erro do upload |
| `isDisabled` | `boolean` | Sim | Desabilitado quando não há sessão ativa |

**Responsabilidade:**
- Aceitar drag-and-drop e clique para abrir seletor de arquivos
- Entregar o arquivo para o hook via `onFileSelected` — sem lógica de validação
- Exibir feedback visual de hover durante o arrasto
- Exibir erro inline quando presente

**Estados:**
- **Normal:** "Arraste arquivos ou clique para selecionar"
- **Hover/drag-over:** destaque visual na borda
- **Uploading:** exibe indicador ou desabilita interação
- **Desabilitado:** "Selecione uma sessão para fazer upload"
- **Erro:** exibe mensagem de erro com `detail` do `ProblemDetail`

**Acessibilidade:**
- `role="button"` e `tabindex="0"`
- Ativável por Enter e Espaço
- `aria-label` descrevendo a ação
- Input file oculto com `aria-hidden="true"`

---

## 7. ProgressBar

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `percent` | `number` | Sim | Percentual 0–100 |

**Responsabilidade:**
- Exibir barra de progresso com percentual numérico centralizado
- Visível apenas durante upload (`percent > 0` ou estado uploading)
- Largura da barra preenchida proporcional ao percentual

**Estados:**
- **0%:** invisível ou barra vazia
- **Em progresso (1–99%):** barra azul com animação suave
- **Completo (100%):** barra verde
- **Erro:** barra vermelha (opcional, pode ser controlado por prop extra)

**Acessibilidade:**
- `role="progressbar"`
- `aria-valuenow` com valor atual
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- `aria-label="Progresso do upload"`

---

## 8. HealthIndicator

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `status` | `'healthy' \| 'unhealthy' \| 'loading'` | Sim | Estado da API |

**Responsabilidade:**
- Exibir indicador visual do estado de saúde da API

**Estados:**
- **loading:** círculo amarelo pulsante + texto "Verificando..."
- **healthy:** círculo verde + texto "API ativa"
- **unhealthy:** círculo vermelho + texto "API indisponível"

**Acessibilidade:**
- `aria-label` com o texto descritivo (ex: "API ativa")
- `role="status"`

---

## 9. Tipos compartilhados (interfaces)

Definidos em `src/types/`:

```typescript
// types/session.ts
export interface Session {
  id: number;
  title: string;
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}

// types/message.ts
export type Sender = 'USER' | 'ASSISTANT';

export interface Message {
  id: number;
  sessionId: number;
  sender: Sender;
  content: string;
  timestamp: string;   // ISO 8601
}

export interface ChatResponse {
  userMessage: Message;
  assistantMessage: Message;
}

// types/attachment.ts
export type AttachmentType = 'TXT' | 'PDF';

export interface Attachment {
  id: number;
  sessionId: number;
  filename: string;
  type: AttachmentType;
  size: number;
  uploadDate: string;   // ISO 8601
}

// types/api.ts
export interface ProblemDetail {
  status: number;
  title: string;
  detail: string;
}

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
}
```

---

## 10. Regras de contrato entre componentes e hooks

1. Componentes **recebem dados e callbacks por props** — nunca chamam serviços ou hooks diretamente
2. Hooks **gerenciam estado e efeitos colaterais** — nunca contêm JSX
3. `App` é o único componente que **consome hooks** e **distribui props** para os filhos
4. Nenhum componente visual conhece a existência de Axios, fetch ou URLs de API
5. Serviços HTTP **retornam dados tipados** (interfaces de `types/`) — nunca dados brutos
6. Erros da API chegam aos componentes como `string` (mensagem amigável) via props
