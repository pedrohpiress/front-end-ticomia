import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ChatInput({ onSend, disabled = false, loading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled && !loading) {
      onSend(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      handleSend();
    }
  };

  const styles = {
    container: {
      display: 'flex',
      gap: '8px',
      padding: '12px',
      borderTop: '1px solid rgba(99, 115, 129, 0.24)',
      backgroundColor: '#1f2125',
      alignItems: 'flex-end',
    },
    inputWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    textarea: {
      flex: 1,
      padding: '10px 12px',
      backgroundColor: '#2a2f33',
      border: '1px solid rgba(99, 115, 129, 0.24)',
      borderRadius: '8px',
      color: '#f4f6f8',
      fontFamily: 'inherit',
      fontSize: '14px',
      resize: 'none' as const,
      minHeight: '40px',
      maxHeight: '100px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    textareaFocus: {
      borderColor: '#5BE49B',
    },
    textareaDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#5BE49B',
      color: '#181a1b',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '14px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '44px',
      height: '40px',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    hint: {
      fontSize: '11px',
      color: '#b0b8c1',
      marginTop: '4px',
    },
  };

  const isDisabledState = disabled || loading || !message.trim();

  return (
    <div style={styles.container}>
      <div style={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua pergunta... (Shift+Enter para quebra de linha)"
          disabled={disabled || loading}
          style={{
            ...styles.textarea,
            ...(disabled || loading ? styles.textareaDisabled : {}),
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#5BE49B';
          }}
          onBlur={(e) => {
            if (!message.trim()) {
              e.currentTarget.style.borderColor = 'rgba(99, 115, 129, 0.24)';
            }
          }}
        />
        <div style={styles.hint}>
          {disabled ? 'Conectando...' : 'Pressione Enter para enviar'}
        </div>
      </div>
      <button
        onClick={handleSend}
        disabled={isDisabledState}
        style={{
          ...styles.button,
          ...(isDisabledState ? styles.buttonDisabled : {}),
        }}
        onMouseEnter={(e) => {
          if (!isDisabledState) {
            e.currentTarget.style.backgroundColor = '#4db87a';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabledState) {
            e.currentTarget.style.backgroundColor = '#5BE49B';
          }
        }}
        title={isDisabledState ? 'Digite uma mensagem para enviar' : 'Enviar (Enter)'}
      >
        {loading ? '⟳' : '↪'}
      </button>
    </div>
  );
}
