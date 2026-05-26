import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styles = {
    messageContainer: {
      display: 'flex',
      justifyContent: message.isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
      animation: 'slideIn 0.3s ease-out',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: '10px 14px',
      borderRadius: message.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
      backgroundColor: message.isUser ? '#5BE49B' : '#2a2f33',
      color: message.isUser ? '#181a1b' : '#f4f6f8',
      wordWrap: 'break-word' as const,
      whiteSpace: 'pre-wrap' as const,
      fontSize: '14px',
      lineHeight: '1.4',
      position: 'relative' as const,
    },
    timestamp: {
      fontSize: '11px',
      opacity: 0.6,
      marginTop: '4px',
      textAlign: message.isUser ? 'right' as const : 'left' as const,
    },
    actions: {
      display: 'flex',
      gap: '4px',
      marginTop: '4px',
    },
    actionButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 6px',
      fontSize: '11px',
      borderRadius: '4px',
      opacity: 0.7,
      transition: 'opacity 0.2s',
      color: 'inherit',
    },
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={styles.messageContainer}>
        <div>
          <div style={styles.messageBubble}>{message.text}</div>
          <div style={styles.timestamp}>{formatTime(message.timestamp)}</div>
          {!message.isUser && (
            <div style={styles.actions}>
              <button
                style={styles.actionButton}
                onClick={handleCopy}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                title="Copiar"
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
