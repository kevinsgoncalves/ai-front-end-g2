# API Integration Strategy — MindJourney IA (Front-end)

## 1. Visão geral

A comunicação com o back-end é feita exclusivamente através de uma camada de serviços HTTP, consumida pelos Custom Hooks. Nenhum componente visual realiza chamadas diretas à API. O Axios é a biblioteca escolhida para as requisições HTTP.

---

## 2. Configuração da URL do back-end

A instância do Axios é configurada em `services/api.ts` com:

| Parâmetro | Valor |
|-----------|-------|
| `baseURL` | `http://localhost:8080/api` |
| `timeout` | 30000ms (30 segundos) |

### Estratégia de configuração

- A `baseURL` é definida como constante no arquivo `api.ts`
- Para ambientes de produção, a URL pode ser externalizada via variável de ambiente `VITE_API_BASE_URL`
- O Vite suporta variáveis de ambiente com prefixo `VITE_` acessíveis via `import.meta.env`

```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';
```

### Proxy CORS (opcional)

Caso o back-end não tenha CORS configurado, o `vite.config.ts` pode ser ajustado para proxy:

```typescript
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

Neste cenário, a `baseURL` do Axios passaria a ser simplesmente `/api` (relativa).

---

## 3. Contratos da API consumidos

Fonte oficial: `01-backend-architecture.md` (documento de especificação do back-end).

| Método | Rota | Consumido por | Serviço |
|--------|------|---------------|---------|
| GET | `/api/health` | `useHealth` | `healthService.check()` |
| GET | `/api/sessions` | `useSessions` | `sessionService.getAll()` |
| POST | `/api/sessions` | `useSessions` | `sessionService.create(title?)` |
| GET | `/api/sessions/{id}` | `useSessions` | `sessionService.getById(id)` |
| POST | `/api/chat` | `useMessages` | `chatService.sendMessage(sessionId, content)` |
| GET | `/api/sessions/{id}/messages` | `useMessages` | `messageService.getBySessionId(id)` |
| POST | `/api/upload` | `useUpload` | `uploadService.upload(file, sessionId, onProgress)` |
| GET | `/api/sessions/{id}/attachments` | *opcional* | *não implementado na Etapa 1* |

---

## 4. Estrutura dos serviços HTTP

### 4.1 api.ts — Instância do Axios

```typescript
// Configuração
- baseURL: 'http://localhost:8080/api' (ou variável de ambiente)
- timeout: 30000
- Headers padrão: Content-Type application/json

// Interceptor de resposta
- Sucesso: retorna response.data diretamente
- Erro: extrai ProblemDetail da resposta e rejeita a Promise com o objeto
```

### 4.2 healthService.ts

| Função | Retorno | Descrição |
|--------|---------|-----------|
| `check()` | `Promise<HealthStatus>` | `GET /api/health` |

### 4.3 sessionService.ts

| Função | Retorno | Descrição |
|--------|---------|-----------|
| `getAll()` | `Promise<Session[]>` | `GET /api/sessions` |
| `getById(id: number)` | `Promise<Session>` | `GET /api/sessions/{id}` |
| `create(title?: string)` | `Promise<Session>` | `POST /api/sessions` — body: `{ title }` |

### 4.4 messageService.ts

| Função | Retorno | Descrição |
|--------|---------|-----------|
| `getBySessionId(sessionId: number)` | `Promise<Message[]>` | `GET /api/sessions/{id}/messages` |

### 4.5 chatService.ts

| Função | Retorno | Descrição |
|--------|---------|-----------|
| `sendMessage(sessionId: number, content: string)` | `Promise<ChatResponse>` | `POST /api/chat` — body: `{ sessionId, content }` |

### 4.6 uploadService.ts

| Função | Retorno | Descrição |
|--------|---------|-----------|
| `upload(file: File, sessionId: number, onProgress: (percent: number) => void)` | `Promise<Attachment>` | `POST /api/upload` — multipart/form-data com `file` e `sessionId` |

**Observações:**
- `sessionId` é obrigatório no upload
- O progresso é obtido via `onUploadProgress` do Axios
- O conteúdo do `FormData` deve conter: `file` (o arquivo) e `sessionId` (number convertido para string)
- O back-end valida tipo, extensão e tamanho do arquivo no `AttachmentService`

---

## 5. Tratamento de erros

### 5.1 ProblemDetail (RFC 9457)

Todos os erros da API seguem o formato `ProblemDetail`:

```json
{
  "status": 400,
  "title": "Invalid file type",
  "detail": "Only .txt and .pdf files are allowed"
}
```

### 5.2 Códigos de erro esperados

| Código | Significado | Cenário |
|--------|-------------|---------|
| 400 | Bad Request | Arquivo inválido, conteúdo vazio, extensão não permitida |
| 404 | Not Found | Sessão inexistente |
| 413 | Payload Too Large | Arquivo excede 10 MB |
| 500 | Internal Server Error | Falha inesperada no servidor |

### 5.3 Estratégia de tratamento no front-end

1. **Interceptor do Axios** captura erros HTTP e converte para `ProblemDetail`
2. **Serviços** propagam o erro como `ProblemDetail` (não como string genérica)
3. **Hooks** recebem o erro e extraem `status`, `title`, `detail`
4. **Hooks** convertem para mensagem amigável (string) e expõem via estado `error`
5. **Componentes** exibem o erro com `role="alert"`

### 5.4 Validação client-side (upload)

Antes de chamar a API, o `useUpload` valida:

| Validação | Critério | Ação |
|-----------|----------|------|
| Tipo de arquivo | .txt ou .pdf | Erro imediato sem chamar API |
| Extensão | .txt ou .pdf | Erro imediato sem chamar API |
| Tamanho | ≤ 10 MB | Erro imediato sem chamar API |

A validação do back-end é a fonte da verdade, mas a validação client-side evita requisições desnecessárias e dá feedback instantâneo.

---

## 6. Fluxo de dados

```
Componente (UI)
    ↓ props (dados + callbacks)
Hook (estado + efeitos)
    ↓ chamada de função
Serviço (HTTP + Axios)
    ↓ requisição
Back-end (Spring Boot REST API)
    ↓ resposta
Serviço (retorna dados tipados)
    ↓
Hook (atualiza estado)
    ↓
Componente (re-renderiza)
```

### Regras

1. **Componente → Hook:** nunca. Componentes recebem dados e callbacks por props.
2. **Hook → Serviço:** sim. Hooks chamam serviços para operações HTTP.
3. **Serviço → Axios:** sim. Serviços usam a instância configurada do Axios.
4. **Componente → Serviço:** nunca. Nenhum componente importa ou chama serviços.
5. **Componente → Axios/fetch:** nunca. Nenhum componente faz chamadas HTTP diretas.

---

## 7. Interceptor de erros (api.ts)

O interceptor de resposta deve:

1. Para respostas bem-sucedidas (2xx): retornar `response.data`
2. Para respostas de erro:
   - Se a resposta contiver `status`, `title` e `detail` → extrair como `ProblemDetail`
   - Se a resposta não tiver corpo → criar `ProblemDetail` genérico com `status` do HTTP e mensagem padrão
   - Se não houver resposta (erro de rede) → criar `ProblemDetail` com `status: 0`, `title: "Network Error"`, `detail: "Servidor indisponível"`
3. Rejeitar a Promise com o objeto `ProblemDetail`

---

## 8. Dados mock (desenvolvimento)

Durante o desenvolvimento sem back-end, os hooks podem utilizar dados mock para teste:

- `useSessions`: retornar array vazio ou lista predefinida de sessões
- `useMessages`: retornar array vazio ou mensagens de exemplo
- `useHealth`: retornar `{ status: 'healthy' }` após delay simulado
- `useUpload`: simular progresso com `setInterval` e retornar `Attachment` fictício

Os dados mock devem ser ativados por uma flag (`USE_MOCK`) e removidos na integração final.

---

## 9. Pendências

| Pendência | Descrição |
|-----------|-----------|
| CORS | Definir se o CORS será configurado no back-end ou via proxy do Vite |
| Ambiente de produção | Definir URL da API em produção e estratégia de variáveis de ambiente |
| Refresh de token | Não há autenticação na Etapa 1, mas deve ser considerado no futuro |
| Paginação | Histórico de mensagens pode crescer — paginação pode ser necessária em versões futuras |
