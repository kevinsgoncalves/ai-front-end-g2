# MindJournal AI — Frontend

Interface de chat inteligente com gerenciamento de sessões, troca de mensagens e upload drag-and-drop de arquivos TXT e PDF.

## Stack

- React 18 + TypeScript
- Vite 5
- Axios

## Pré-requisitos

- Node.js 18+
- Back-end MindJournal rodando em `http://localhost:8080`

## Configuração

```bash
cp .env.example .env.local
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acessar `http://localhost:5173`.

## Build

```bash
npm run build
```

## Endpoints consumidos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check da API |
| GET | `/api/sessions` | Listar sessões |
| POST | `/api/sessions` | Criar sessão |
| GET | `/api/sessions/{id}/messages` | Mensagens da sessão |
| POST | `/api/chat` | Enviar mensagem |
| POST | `/api/upload` | Upload de arquivo (multipart) |

## Proxy

O `vite.config.ts` faz proxy de `/api` para `http://localhost:8080`. O CORS está configurado no back-end.