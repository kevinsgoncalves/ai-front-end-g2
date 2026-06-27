# Contexto do Agente — Branch: `feature/integration-frontend`

**MindJournal AI — Integração Frontend com Backend Spring Boot**

## Stack

- React 18 + TypeScript
- Vite 5 + proxy `/api` → `http://localhost:8080`
- Axios para requisições HTTP
- CSS Modules para escopo de estilos

## Arquitetura

```
src/
├── App.tsx                    # Raiz → renderiza Home
├── main.tsx                   # Bootstrap
├── pages/Home.tsx             # Página única: orquestra hooks e componentes
├── components/                # Componentes visuais reutilizáveis
│   ├── ChatWindow.tsx         # Container de mensagens + MessageInput
│   ├── Message.tsx            # Bolha de mensagem individual
│   ├── MessageInput.tsx       # Input de texto + botão enviar
│   ├── HealthIndicator.tsx    # Indicador de saúde da API (polling 30s)
│   ├── ProgressBar.tsx        # Barra de progresso (legado)
│   ├── Sidebar.tsx            # Placeholder (substituído por HistorySidebar)
│   ├── ChatArea.tsx           # Placeholder (substituído por ChatWindow)
│   ├── ChatInput.tsx          # Placeholder (substituído por MessageInput)
│   ├── MessageBubble.tsx      # Placeholder (substituído por Message)
│   └── UploadZone.tsx         # Placeholder (substituído pelo feature module)
├── features/
│   ├── history-sidebar/       # Sidebar de sessões (listar, criar, selecionar)
│   └── upload-area/           # Upload drag-and-drop com progresso real
├── hooks/
│   ├── useChat.ts             # Carregar mensagens + enviar via API
├── services/
│   ├── api.ts                 # Instância Axios (baseURL: /api)
│   ├── sessionService.ts      # GET/POST /api/sessions
│   ├── messageService.ts      # GET /api/sessions/{id}/messages
│   ├── chatService.ts         # POST /api/chat
│   ├── uploadService.ts       # Interface (feature module)
│   └── healthService.ts       # GET /api/health
└── types/
    ├── session.ts             # Session
    ├── message.ts             # Message, MessageRole, ChatResponse
    ├── attachment.ts          # Attachment, AttachmentType
    └── api.ts                 # ProblemDetail, HealthStatus
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/sessions` | Listar sessões (ordenadas por updatedAt desc) |
| POST | `/api/sessions` | Criar sessão |
| GET | `/api/sessions/{id}/messages` | Mensagens da sessão (ordenadas por timestamp asc) |
| POST | `/api/chat` | Enviar mensagem → retorna `{ userMessage, assistantMessage }` |
| POST | `/api/upload` | Upload de arquivo (multipart: file + sessionId) |

## Regras

- Nenhum componente faz chamada HTTP direta
- Chamadas de API concentradas em `services/`
- Estado e efeitos em Custom Hooks
- `App.tsx` e `Home.tsx` apenas compõem a interface e consomem hooks
- Upload requer sessão ativa (sessionId)
- Validação client-side: tipo (.txt, .pdf), extensão, tamanho (10 MB)
- Progresso real via `onUploadProgress` do Axios
- Erros seguem `ProblemDetail` (RFC 9457)
- Polling de health a cada 30 segundos
- Nenhum mock ativo nos fluxos principais

## Como executar

### Backend

```bash
cd ../ai-back-end-g2
./mvnw.cmd clean compile
./mvnw.cmd spring-boot:run
```

### Frontend

```bash
cp .env.example .env.local
npm install
npm run dev
```

Acessar `http://localhost:5173`.
