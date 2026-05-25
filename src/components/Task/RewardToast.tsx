import { useEffect } from 'react';
import { useProgressStore } from '../../store/useProgressStore';

export default function RewardToast() {
  const toastMessage = useProgressStore(s => s.toastMessage);
  const toastType = useProgressStore(s => s.toastType);
  const clearToast = useProgressStore(s => s.clearToast);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(clearToast, 2500);
      return () => clearTimeout(t);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className="toast-overlay">
      <div className={`toast toast-${toastType}`}>{toastMessage}</div>
    </div>
  );
}
