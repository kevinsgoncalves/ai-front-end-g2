# MindJourney IA — Front-end

Interface de chat inteligente com gerenciamento de sessões, troca de mensagens, upload drag-and-drop de arquivos TXT e PDF, suporte a RAG e temas.

## Funcionalidades

- **Sessões** — criar, listar, selecionar, renomear e excluir conversas
- **Mensagens** — enviar e receber mensagens com suporte a Enter (enviar) e Shift+Enter (nova linha)
- **Integração com IA** — respostas geradas por `llama3.2:3b` via Ollama
- **Upload TXT/PDF** — arrastar e soltar ou selecionar arquivos, com progresso real
- **Anexos** — listagem e refresh dos arquivos enviados na sessão ativa
- **Fontes RAG** — exibição dos fragmentos consultados na resposta do assistente
- **Temas** — alternar entre Spring, Summer, Autumn e Winter
- **Rolagem interna** — somente a lista de mensagens rola; header, sidebar e input permanecem fixos

## Tecnologias

- React 18 + TypeScript
- Vite 5
- Axios
- CSS Modules (features)

## Pré-requisitos

- Node.js 18 ou superior
- npm
- Back-end rodando em `http://localhost:8080`

## Instalação

```powershell
cd "C:\caminho\para\ai-front-end-g2"
npm install
```

## Execução

```powershell
npm run dev
```

Acessar: **http://localhost:5174**

A porta é fixa porque `vite.config.ts` define:

```ts
port: 5174,
strictPort: true,
```

## Proxy

O `vite.config.ts` configura um proxy:

```
/api → http://localhost:8080
```

O Axios usa `baseURL: "/api"`. Toda requisição para `/api/chat`, `/api/sessions`, etc. é encaminhada automaticamente para o back-end. O CORS está configurado no back-end para aceitar `http://localhost:5174`.

Não é necessário criar `.env.local`. A variável `VITE_API_URL` não é consumida pelo código atual.

## Build

```powershell
npm run build
```

## Solução de problemas

### Porta 5174 ocupada

Encerre o processo que está usando a porta ou altere `port` no `vite.config.ts`.

### ECONNREFUSED

O back-end não está rodando. Inicie o back-end em `http://localhost:8080` antes do front-end.

### Limpar cache do Vite

```powershell
rm -r node_modules/.vite
npm run dev
```

### Conferir health

```powershell
curl.exe http://localhost:5174/api/health
```

## Endpoints consumidos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check da API |
| GET | `/api/sessions` | Listar sessões (ordenadas por updatedAt desc) |
| POST | `/api/sessions` | Criar sessão |
| PATCH | `/api/sessions/{id}/title` | Atualizar título da sessão |
| DELETE | `/api/sessions/{id}` | Excluir sessão e dados vinculados |
| GET | `/api/sessions/{id}/messages` | Mensagens da sessão |
| POST | `/api/chat` | Enviar mensagem e receber resposta |
| POST | `/api/upload` | Upload de arquivo (multipart: file + sessionId) |
| GET | `/api/documents/{id}/status` | Status de indexação do documento |

## Estrutura

```text
src/
├── App.tsx
├── main.tsx
├── pages/Home.tsx
├── components/
│   ├── ChatWindow.tsx
│   ├── Message.tsx
│   ├── MessageInput.tsx
│   ├── AttachmentList.tsx
│   ├── AttachmentCard.tsx
│   ├── SourcePanel.tsx
│   ├── HealthIndicator.tsx
│   └── ThemeToggle.tsx
├── features/
│   ├── history-sidebar/
│   └── upload-area/
├── hooks/
│   ├── useChat.ts
│   ├── useHealth.ts
│   ├── useTheme.ts
│   └── useAttachments.ts
├── services/
│   ├── api.ts
│   ├── sessionService.ts
│   ├── messageService.ts
│   ├── chatService.ts
│   ├── uploadService.ts
│   └── healthService.ts
├── types/
│   ├── session.ts
│   ├── message.ts
│   ├── attachment.ts
│   └── api.ts
├── index.css
└── App.css
```

## Passo a passo completo

1. Inicie o back-end (porta 8080)
2. Neste diretório, execute:
   ```powershell
   npm install
   npm run dev
   ```
3. Abra http://localhost:5174
4. Crie ou selecione uma sessão na barra lateral
5. Digite uma mensagem e pressione Enter
