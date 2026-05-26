import { useState } from 'react';
import { ChatModal } from './ChatModal';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const styles = {
    button: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: '#5BE49B',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(91, 228, 155, 0.4)',
      zIndex: 9998,
      transition: 'all 0.3s ease',
      fontSize: '24px',
      fontWeight: 600,
      color: '#181a1b',
    },
    badge: {
      position: 'absolute' as const,
      top: '-2px',
      right: '-2px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: '#db2020',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      color: '#fff',
      fontWeight: 700,
      border: '2px solid #1f2125',
    },
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        [data-chat-button]:hover {
          animation: pulse 0.6s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          [data-chat-button] {
            bottom: 20px !important;
            right: 20px !important;
            width: 48px !important;
            height: 48px !important;
          }
        }
      `}</style>

      <button
        data-chat-button
        style={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Fechar chat' : 'Abrir chat'}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(91, 228, 155, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 228, 155, 0.4)';
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
