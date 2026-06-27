# System Specification — MindJourney IA (Front-end)

## 1. Visão geral da aplicação

Aplicação SPA (Single Page Application) em React com TypeScript e Vite para o sistema de diário pessoal inteligente MindJourney IA. Interface de chat com lista de sessões, troca de mensagens e upload drag-and-drop de arquivos TXT e PDF com barra de progresso. Consome a API REST do back-end Spring Boot em `http://localhost:8080/api`.

A stack front-end aprovada é: **React 18, TypeScript (strict), Vite 5, Axios**. Nenhuma biblioteca externa de UI é utilizada — todos os componentes são próprios.

---

## 2. Escopo

### Dentro do escopo (Etapa 1)

- Inicialização do projeto com Vite + React + TypeScript strict
- Definição de tipos TypeScript para todos os contratos da API (`Session`, `Message`, `Attachment`, `ChatResponse`, `ProblemDetail`, `HealthStatus`)
- Configuração do Axios com `baseURL`, timeout e interceptors
- Implementação de serviços HTTP tipados (`sessionService`, `messageService`, `chatService`, `uploadService`, `healthService`)
- Layout de duas colunas (Sidebar + ChatArea) com Header
- Sidebar: listagem de sessões, botão "[+ Nova]", sessão ativa destacada, loading skeleton, placeholder vazio
- ChatArea: container scrollável de mensagens, placeholder vazio, loading skeleton
- MessageBubble: exibição de remetente, conteúdo e timestamp com distinção visual USER/ASSISTANT
- ChatInput: campo de texto com envio por Enter ou botão, desabilitado sem sessão ativa
- UploadZone: drag-and-drop + seletor de arquivos, validação client-side (.txt, .pdf, 10 MB)
- ProgressBar: percentual numérico com `role="progressbar"` e atributos ARIA
- HealthIndicator: polling a cada 30s, indicador verde/amarelo/vermelho
- Estados de loading (skeleton), sucesso (conteúdo normal), vazio (placeholder), erro (mensagem com `title` e `detail` do `ProblemDetail`)
- Acessibilidade: navegação por teclado, ARIA labels, contraste, foco visível

### Fora do escopo (Etapa 1)

- Autenticação e login de usuários
- Roteamento com React Router (múltiplas páginas)
- Tema escuro / claro
- Edição e exclusão de mensagens
- Exclusão de sessões
- Respostas com streaming (WebSocket ou SSE)
- Testes automatizados (serão especificados em etapa posterior)
- Internacionalização (i18n)
- Suporte a markdown ou rich text nas mensagens
- Animações avançadas
- PWA e instalação
- Notificações push
- Upload para cloud storage

---

## 3. Árvore de diretórios proposta

```
src/
├── App.tsx                        # Componente raiz — compõe layout, consome hooks
├── App.css                        # Estilos globais do layout
├── main.tsx                       # Entry point — createRoot + StrictMode
├── vite-env.d.ts                  # Tipos do Vite
├── index.css                      # Reset e estilos base
├── components/
│   ├── Sidebar.tsx                # Lista de sessões + botão [+ Nova]
│   ├── ChatArea.tsx               # Container scrollável de mensagens
│   ├── MessageBubble.tsx          # Mensagem individual
│   ├── ChatInput.tsx              # Campo de texto + botão de envio
│   ├── UploadZone.tsx             # Área drag-and-drop
│   ├── ProgressBar.tsx            # Barra de progresso do upload
│   └── HealthIndicator.tsx        # Indicador de saúde da API
├── hooks/
│   ├── useSessions.ts             # Gerenciamento de sessões
│   ├── useMessages.ts             # Histórico e envio de mensagens
│   ├── useUpload.ts               # Upload com validação e progresso
│   └── useHealth.ts               # Polling de saúde da API
├── services/
│   ├── api.ts                     # Instância do Axios configurada
│   ├── sessionService.ts          # CRUD de sessões
│   ├── messageService.ts          # Histórico de mensagens
│   ├── chatService.ts             # Envio de mensagens
│   ├── uploadService.ts           # Upload de arquivos
│   └── healthService.ts           # Health check
├── types/
│   ├── session.ts                 # Session interface
│   ├── message.ts                 # Message, Sender, ChatResponse
│   ├── attachment.ts              # Attachment, AttachmentType
│   └── api.ts                     # ProblemDetail, HealthStatus
└── utils/
    ├── formatters.ts              # Formatação de datas
    └── validators.ts              # Validação de arquivos (tipo, extensão, tamanho)
```

---

## 4. Lista de páginas

A aplicação possui **uma única página** com layout dividido:

```
┌──────────────────────────────────────────┐
│  Header (título + HealthIndicator)       │
├──────────┬───────────────────────────────┤
│          │                               │
│ Sidebar  │     ChatArea                  │
│          │     ┌─────────────────────┐   │
│ • Sessão1│     │ MessageBubble (usr) │   │
│ • Sessão2│     │ MessageBubble (ast) │   │
│ • Sessão3│     │ ─────────────       │   │
│          │     │ ChatInput            │   │
│ [+ Nova] │     │ [UploadZone]         │   │
│          │     └─────────────────────┘   │
└──────────┴───────────────────────────────┘
```

**Fluxo 1 — Início:** Sidebar carrega lista de sessões. Se vazia, exibe placeholder "Nenhuma sessão ainda. Crie uma!".

**Fluxo 2 — Selecionar sessão:** Usuário clica em sessão na Sidebar → ChatArea carrega mensagens via `GET /api/sessions/{id}/messages`.

**Fluxo 3 — Criar sessão:** Usuário clica "[+ Nova]" → `POST /api/sessions` → nova sessão aparece na Sidebar e é selecionada automaticamente.

**Fluxo 4 — Enviar mensagem:** Usuário digita no ChatInput e pressiona Enter → `POST /api/chat` → mensagens do usuário e da resposta aparecem no ChatArea.

**Fluxo 5 — Upload:** Usuário arrasta arquivo para UploadZone ou clica para selecionar → `POST /api/upload` (apenas com sessão ativa) → ProgressBar é exibida → confirmação ou erro.

---

## 5. Lista de componentes visuais

| Componente | Descrição |
|------------|-----------|
| `App` | Componente raiz — compõe Header, Sidebar, ChatArea e UploadZone. Consome hooks. Sem estado próprio. |
| `Sidebar` | Lista de sessões com botão "[+ Nova]". Sessão ativa destacada. Loading skeleton. Placeholder vazio. |
| `ChatArea` | Container scrollável de mensagens. Loading skeleton. Placeholder vazio. Scroll automático ao final. |
| `MessageBubble` | Mensagem individual com remetente, conteúdo e timestamp. Estilos distintos para USER e ASSISTANT. |
| `ChatInput` | Campo de texto com botão de envio. Envia por Enter ou clique. Desabilitado sem sessão ativa ou durante envio. |
| `UploadZone` | Área drag-and-drop com clique para selecionar. Validação visual de hover. Exibe erro inline. Desabilitada sem sessão ativa. |
| `ProgressBar` | Barra de progresso com percentual numérico. Visível apenas durante upload. Role `progressbar` com atributos ARIA. |
| `HealthIndicator` | Indicador de estado da API: verde ("API ativa"), amarelo ("Verificando..."), vermelho ("API indisponível"). |

---

## 6. Lista de hooks customizados

| Hook | Responsabilidade |
|------|-----------------|
| `useSessions` | Gerenciar lista de sessões, criar nova sessão, selecionar sessão ativa |
| `useMessages` | Carregar histórico de mensagens, enviar mensagem, gerenciar estado de envio |
| `useUpload` | Validar arquivo client-side, executar upload com progresso, expor erro/resultado |
| `useHealth` | Verificar periodicamente a saúde da API via polling |

### 6.1 useSessions

| Estado | Tipo | Inicial | Descrição |
|--------|------|---------|-----------|
| `sessions` | `Session[]` | `[]` | Lista de sessões |
| `activeSessionId` | `number \| null` | `null` | Sessão selecionada |
| `isLoading` | `boolean` | `true` | Carregando lista |
| `error` | `string \| null` | `null` | Erro ao carregar/criar |

Comportamentos:
- Carregar sessões via `GET /api/sessions` na montagem
- Criar sessão via `POST /api/sessions` com título opcional
- Selecionar sessão e definir `activeSessionId`

### 6.2 useMessages

| Estado | Tipo | Inicial | Descrição |
|--------|------|---------|-----------|
| `messages` | `Message[]` | `[]` | Mensagens da sessão ativa |
| `isLoading` | `boolean` | `false` | Carregando histórico |
| `isSending` | `boolean` | `false` | Enviando mensagem |
| `error` | `string \| null` | `null` | Erro ao carregar/enviar |

Comportamentos:
- Carregar histórico via `GET /api/sessions/{id}/messages` quando `activeSessionId` muda
- Enviar mensagem via `POST /api/chat` e extrair `userMessage` e `assistantMessage` da resposta
- Adicionar mensagem do usuário otimisticamente; substituir pela resposta real
- Limpar mensagens quando nenhuma sessão ativa

### 6.3 useUpload

| Estado | Tipo | Inicial | Descrição |
|--------|------|---------|-----------|
| `isUploading` | `boolean` | `false` | Upload em andamento |
| `progress` | `number` | `0` | Percentual 0–100 |
| `error` | `string \| null` | `null` | Erro no upload |
| `attachment` | `Attachment \| null` | `null` | Anexo criado |

Comportamentos:
- Validar tipo (.txt, .pdf), extensão e tamanho (10 MB) no client-side
- Enviar arquivo via `POST /api/upload` com `onUploadProgress` apenas se houver sessão ativa
- Atualizar `progress` durante o envio
- Resetar estados após conclusão ou erro (3 segundos)
- Expor `error` com `status`, `title` e `detail` extraídos do `ProblemDetail` da API

### 6.4 useHealth

| Estado | Tipo | Inicial | Descrição |
|--------|------|---------|-----------|
| `status` | `'healthy' \| 'unhealthy' \| 'loading'` | `'loading'` | Estado da API |

Comportamentos:
- Polling `GET /api/health` a cada 30 segundos
- Atualizar status conforme resposta (200 → healthy, erro → unhealthy)
- Cleanup do intervalo no unmount

---

## 7. Estados da aplicação

### Loading

- Sidebar: skeleton de 3 itens pulsantes
- ChatArea: 2–3 skeleton messages
- HealthIndicator: círculo amarelo pulsante "Verificando..."
- UploadZone: desabilitada durante carregamento inicial

### Sucesso

- Sidebar: lista normal de sessões
- ChatArea: mensagens renderizadas
- HealthIndicator: círculo verde "API ativa"
- Toast "Arquivo enviado com sucesso!" no upload (autoremove após 3s)

### Vazio

- Sidebar: "Nenhuma sessão ainda. Crie uma!"
- ChatArea: "Nenhuma mensagem ainda. Escreva algo!"
- UploadZone: "Arraste arquivos ou clique para selecionar"

### Erro

- Toast/Banner no topo com `title` e `detail` do `ProblemDetail`
- HealthIndicator: círculo vermelho "API indisponível"
- ChatInput desabilitado se API offline
- UploadZone exibe mensagem de erro com `detail` do `ProblemDetail`

---

## 8. Fluxo de criação e seleção de sessões

1. `App` monta → `useSessions` carrega lista via `GET /api/sessions`
2. Sidebar exibe `isLoading` skeleton ou lista de sessões
3. Se lista vazia, Sidebar exibe placeholder
4. Usuário clica "[+ Nova]" → `useSessions.createSession()` → `POST /api/sessions` → nova sessão adicionada à lista e selecionada
5. Usuário clica em sessão existente → `useSessions.selectSession(id)` → `activeSessionId` atualizado
6. `useMessages` detecta mudança em `activeSessionId` e carrega histórico

---

## 9. Fluxo de envio de mensagens

1. Usuário digita no `ChatInput` e pressiona Enter (ou clica no botão enviar)
2. `ChatInput` chama `onSendMessage(content)` fornecido por `useMessages`
3. `useMessages` define `isSending = true`
4. Mensagem do usuário é adicionada otimisticamente ao array `messages`
5. `chatService.sendMessage(sessionId, content)` → `POST /api/chat`
6. Resposta retorna `{ userMessage: MessageDTO, assistantMessage: MessageDTO }`
7. Mensagem otimista do usuário é substituída por `userMessage`; `assistantMessage` é adicionada ao array
8. `ChatArea` faz scroll automático para a última mensagem
9. `useMessages` define `isSending = false`
10. Em caso de erro, mensagem otimista é removida e `error` é definido

---

## 10. Fluxo de carregamento do histórico

1. Usuário seleciona sessão na Sidebar
2. `useMessages` detecta mudança em `activeSessionId`
3. `useMessages` define `isLoading = true` e limpa mensagens anteriores
4. `messageService.getBySessionId(id)` → `GET /api/sessions/{id}/messages`
5. Mensagens são armazenadas no estado (já ordenadas pelo back-end por `timestamp` asc)
6. `ChatArea` renderiza mensagens com scroll ao final
7. Se lista vazia, exibe placeholder "Nenhuma mensagem ainda. Escreva algo!"
8. `useMessages` define `isLoading = false`

---

## 11. Fluxo de upload de arquivos

1. Usuário arrasta arquivo sobre `UploadZone` ou clica para abrir seletor de arquivos
2. `UploadZone` chama `onFileSelected(file)` — apenas entrega o arquivo para o hook
3. `useUpload` valida tipo (.txt, .pdf), extensão e tamanho (10 MB)
4. Se inválido, `useUpload` define `error` sem chamar a API; `UploadZone` exibe o erro
5. Se válido, `useUpload` verifica se há sessão ativa (`activeSessionId`)
6. `useUpload` define `isUploading = true`, `progress = 0`
7. `uploadService.upload(file, sessionId, onProgress)` → `POST /api/upload` com `onUploadProgress`
8. `ProgressBar` exibe percentual atualizado a cada evento de progresso
9. Ao concluir, `useUpload` define `attachment` e `isUploading = false`
10. Em caso de erro, `useUpload` define `error` com `status`, `title` e `detail` do `ProblemDetail`
11. Após 3 segundos, feedback de sucesso/erro é removido

---

## 12. Requisitos de acessibilidade

- Todos os inputs possuem `<label>` ou `aria-label`
- `MessageBubble` com `role="article"` e `aria-label` informando remetente
- `ProgressBar` com `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- `UploadZone` com `role="button"` e `tabindex="0"`, ativável por Enter e Espaço
- Mensagens de erro têm `role="alert"`
- Navegação por Tab entre todos os elementos interativos
- Contraste mínimo de 4.5:1 para textos
- Foco visível em todos os elementos interativos
- Suporte a leitores de tela com `aria-busy` em estados de carregamento

---

## 13. Critérios de aceite

- [ ] Sidebar carrega e exibe lista de sessões
- [ ] Botão "[+ Nova]" cria sessão e a seleciona automaticamente
- [ ] Clique em sessão carrega histórico de mensagens
- [ ] Input de texto envia mensagem e exibe `userMessage` e `assistantMessage`
- [ ] ChatArea faz scroll automático para última mensagem
- [ ] Upload drag-and-drop aceita .txt e .pdf e exibe progresso
- [ ] Upload permitido apenas com sessão ativa
- [ ] Upload de tipo inválido exibe erro imediato (sem chamar API)
- [ ] Upload com sessionId inválido exibe erro com `detail` do `ProblemDetail`
- [ ] HealthIndicator exibe estado da API (verde/amarelo/vermelho)
- [ ] Estados de loading exibidos com skeleton ou spinner
- [ ] Estados de vazio exibem placeholder amigável
- [ ] Estados de erro exibem `title` e `detail` do `ProblemDetail`
- [ ] Todos os elementos interativos acessíveis por teclado
- [ ] Nenhum componente chama API diretamente
- [ ] Nenhum hook contém JSX
- [ ] `App` não contém estado próprio — apenas consome hooks

---

## 14. Decisões aprovadas pela equipe

1. **Stack front-end:** React 18, TypeScript strict, Vite 5, Axios
2. **Nenhuma biblioteca externa de UI** — componentes são próprios
3. **App** apenas compõe a interface e consome hooks — sem estado próprio
4. **Upload** permitido apenas com sessão ativa; `sessionId` obrigatório no multipart
5. **UploadZone** recebe o arquivo e renderiza estados; validação e HTTP ficam no `useUpload`
6. **Erros** seguem `ProblemDetail` (RFC 9457) — front-end utiliza `status`, `title`, `detail`
7. **Datas** em ISO 8601 UTC
8. **Componentes** são responsáveis exclusivamente por renderização
9. **Estado e efeitos colaterais** permanecem em Custom Hooks
10. **Chamadas HTTP** concentradas na camada de serviços

---

## 15. Decisões pendentes

| Pendência | Impacto |
|-----------|---------|
| Estratégia de estado global (Context API, Zustand ou prop drilling) | Sem estado global, o prop drilling pode crescer conforme a aplicação evolui. A decisão pode ser postergada até que haja desconforto com a profundidade das props. |
| Formatação de datas no front-end (biblioteca vs `Intl.DateTimeFormat`) | `Intl.DateTimeFormat` nativo cobre o caso de uso inicial. Se houver necessidade de formatação complexa, uma biblioteca leve como `date-fns` pode ser avaliada. |
| Feedback de sucesso no upload (toast vs inline) | Toast é a escolha inicial por ser menos intrusiva. Pode ser revisada com base em testes de usabilidade. |
| Proxy CORS no `vite.config.ts` vs CORS configurado no back-end | Ambas as abordagens funcionam. A decisão depende de quem configura o CORS. Se o back-end já tiver CORS configurado, o proxy do Vite é opcional. |
| Paginação do histórico de mensagens | Fora do escopo da Etapa 1, mas necessário para sessões com muitas mensagens. |

---

## 16. Sequência sugerida de implementação

```
Fase 1 — Bootstrap React com Vite e TypeScript
  └── Fase 2 — Tipos da API (interfaces TypeScript)
        └── Fase 3 — Serviços HTTP (Axios + services)
              ├── Fase 4 — Layout base (componentes estáticos)
              │     ├── Fase 5 — useHealth + HealthIndicator
              │     ├── Fase 6 — useSessions + Sidebar
              │     │     ├── Fase 7 — useMessages + Chat
              │     │     └── Fase 8 — useUpload + UploadZone
              │     └── ...
              └── Fase 9 — Estados de loading, vazio e erro
Fase 10 — Acessibilidade
Fase 11 — Integração final com o back-end
```

Fases 5, 6 e 8 podem ser implementadas em paralelo.
Fase 7 depende da Fase 6 (`activeSessionId`).
Fases 9 e 10 podem ser implementadas em paralelo.
Fase 11 requer o back-end funcional.
