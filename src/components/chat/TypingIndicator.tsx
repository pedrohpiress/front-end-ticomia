const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    backgroundColor: '#2a2f33',
    borderRadius: '12px',
    width: 'fit-content',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#5BE49B',
    animation: 'typing 1.4s infinite',
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
};

export function TypingIndicator() {
  return (
    <>
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-8px); }
        }
      `}</style>
      <div style={styles.container}>
        <div style={{ ...styles.dot, ...styles.dot1 }} />
        <div style={{ ...styles.dot, ...styles.dot2 }} />
        <div style={{ ...styles.dot, ...styles.dot3 }} />
      </div>
    </>
  );
}
