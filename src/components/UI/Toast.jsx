export function Toast({ toast, onRemove }) {
  const typeEmoji = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  };

  const emoji = typeEmoji[toast.type] || '•';

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-emoji">{emoji}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove?.(toast.id)}>
        ×
      </button>
    </div>
  );
}

export function ToastContainer({ toasts = [], onRemove = null }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
