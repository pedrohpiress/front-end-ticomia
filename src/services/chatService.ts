import axios from 'axios';

// Tipos para melhor type-safety
interface ChatRequest {
  pergunta: string;
  evento_id?: number | null;
  evento_nome?: string | null;
  consolidado?: boolean;
}

interface ChatResponse {
  resposta: string;
}

// Configurações
const CHAT_API_BASE_URL = (import.meta as ImportMeta & { env?: { VITE_CHAT_API_URL?: string } }).env?.VITE_CHAT_API_URL || '/chat';
const MAX_RETRIES = 2;
const TIMEOUT_MS = 120000;
const DASHBOARD_EVENT_STORAGE_KEY = 'dashboardSelectedEventContext';

// Criando instância do axios
const chatApi = axios.create({
  baseURL: CHAT_API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getSelectedDashboardEventContext = () => {
  try {
    const stored = localStorage.getItem(DASHBOARD_EVENT_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as {
      eventoId?: number | null;
      eventoNome?: string | null;
      consolidado?: boolean;
    };
  } catch (error) {
    console.error('Erro ao ler contexto da dashboard para o chat:', error);
    return null;
  }
};

/**
 * Serviço centralizado para comunicação com o chatbot backend
 *
 * Features:
 * - Retry automático com backoff exponencial
 * - Tratamento específico de diferentes tipos de erro
 * - Timeout configurável
 * - Validação de entrada
 */
export const chatService = {
  /**
   * Envia mensagem para o chatbot e retorna resposta
   *
   * @param message - Pergunta do usuário
   * @returns Promise com a resposta da IA
   * @throws Error com mensagem amigável em caso de falha
   */
  async sendMessage(message: string): Promise<string> {
    // Validação básica
    if (!message || !message.trim()) {
      throw new Error('Mensagem não pode estar vazia');
    }

    let lastError: Error | null = null;

    // Loop de retry
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const contexto = getSelectedDashboardEventContext();
        const response = await chatApi.post<ChatResponse>('/chat/', {
          pergunta: message.trim(),
          ...(contexto
            ? {
                evento_id: contexto.eventoId ?? null,
                evento_nome: contexto.eventoNome ?? null,
                consolidado: Boolean(contexto.consolidado),
              }
            : {}),
        });

        // Validar resposta
        if (!response.data?.resposta) {
          throw new Error('Resposta vazia do servidor');
        }

        return response.data.resposta;
      } catch (error) {
        lastError = error as Error;

        // Se não é a última tentativa, retry com delay
        if (attempt < MAX_RETRIES) {
          // Backoff exponencial: 1s, 2s
          await new Promise(resolve =>
            setTimeout(resolve, 1000 * (attempt + 1))
          );
          continue;
        }

        // Tratamento específico de erros Axios
        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNREFUSED') {
            throw new Error('Servidor de chat não está respondendo');
          }
          if (error.code === 'ECONNABORTED') {
            throw new Error('Requisição expirou');
          }
          if (error.response?.status === 500) {
            throw new Error('Erro no servidor de chat');
          }
          if (error.response?.status === 429) {
            throw new Error('Muitas requisições. Aguarde um momento');
          }
        }

        throw lastError;
      }
    }

    throw lastError || new Error('Erro ao enviar mensagem');
  },
};

export default chatService;
