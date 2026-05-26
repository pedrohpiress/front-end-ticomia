import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import chatService from '../../services/chatService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessagesFromStorage = () => {
    try {
      const stored = localStorage.getItem('chatMessages');
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    }
  };

  const saveMessagesToStorage = (msgs: Message[]) => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(msgs));
    } catch (err) {
      console.error('Erro ao salvar histórico:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMessagesFromStorage();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(text);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updated = [...prev, aiMessage];
        saveMessagesToStorage(updated);
        return updated;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar sua pergunta';
      setError(errorMessage);

      const displayMessage = errorMessage.toLowerCase().includes('tente novamente')
        ? errorMessage
        : `${errorMessage}. Tente novamente.`;

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ ${displayMessage}`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Deseja limpar o histórico de mensagens?')) {
      setMessages([]);
      localStorage.removeItem('chatMessages');
      setError(null);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: isOpen ? 'flex' : 'none',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      zIndex: 9999,
      animation: isOpen ? 'fadeIn 0.3s ease' : 'fadeOut 0.3s ease',
      pointerEvents: isOpen ? 'auto' : 'none',
    },
    modal: {
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#1f2125',
      borderRadius: '16px 16px 0 0',
      boxShadow: '0 5px 40px rgba(0, 0, 0, 0.6)',
      width: '100%',
      maxWidth: '420px',
      height: '600px',
      animation: isOpen ? 'slideUp 0.3s ease' : 'slideDown 0.3s ease',
      // Responsive handled via the <style> tag below; do not include @media in JS styles
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottom: '1px solid rgba(99, 115, 129, 0.24)',
      backgroundColor: '#23272a',
      borderRadius: '16px 16px 0 0',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#5BE49B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#181a1b',
      fontWeight: 600,
      fontSize: '18px',
    },
    headerInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2px',
    },
    title: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#f4f6f8',
    },
    status: {
      fontSize: '12px',
      color: '#b0b8c1',
    },
    headerButtons: {
      display: 'flex',
      gap: '8px',
    },
    iconButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      fontSize: '18px',
      color: '#b0b8c1',
      borderRadius: '6px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#1f2125',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#b0b8c1',
      textAlign: 'center' as const,
      gap: '12px',
    },
    emptyIcon: {
      fontSize: '48px',
      opacity: 0.5,
    },
    emptyText: {
      fontSize: '14px',
      lineHeight: '1.5',
    },
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
        .chat-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(99, 115, 129, 0.3);
          border-radius: 3px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(99, 115, 129, 0.5);
        }
        @media (max-width: 768px) {
          [data-chat-modal] {
            max-width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      <div style={styles.overlay} onClick={onClose}>
        <div
          data-chat-modal
          style={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <header style={styles.header}>
            <div style={styles.headerContent}>
              <div style={styles.avatar}>🤖</div>
              <div style={styles.headerInfo}>
                <div style={styles.title}>Assistente Financeiro</div>
                <div style={styles.status}>
                  {loading ? 'Digitando...' : '● Online'}
                </div>
              </div>
            </div>
            <div style={styles.headerButtons}>
              <button
                style={styles.iconButton}
                onClick={handleClearChat}
                title="Limpar conversa"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 115, 129, 0.16)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                🗑️
              </button>
              <button
                style={styles.iconButton}
                onClick={onClose}
                title="Fechar"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 115, 129, 0.16)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                ✕
              </button>
            </div>
          </header>

          <div style={styles.messagesContainer} className="chat-scrollbar">
            {messages.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>💬</div>
                <div style={styles.emptyText}>
                  Olá! Sou seu assistente financeiro.
                  <br />
                  Como posso ajudar?
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {loading && (
                  <div style={{ marginBottom: '12px' }}>
                    <TypingIndicator />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <ChatInput
            onSend={handleSendMessage}
            disabled={loading}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}
