import { useState } from 'react';
import { useProgressStore } from '../../store/useProgressStore';

interface Props {
  onClose: () => void;
}

export default function ResetModal({ onClose }: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const resetChapter = useProgressStore(s => s.resetChapter);
  const resetOptions = useProgressStore(s => s.resetOptions);

  const handleReset = (type: 'all' | 'done' | 'retry') => {
    if (type === 'all') resetChapter();
    else if (type === 'done') resetOptions({ done: true });
    else if (type === 'retry') resetOptions({ retry: true });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>重置本章进度</h3>
        {!confirmed ? (
          <>
            <p>重置将清除本章的学习记录。题目内容不会删除。</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmed(true)}>
                重置整个章节（完成+心魔+统计）
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleReset('done')}>
                仅重置完成状态
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleReset('retry')}>
                仅清空心魔本
              </button>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={onClose}>取消</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: 'var(--red)' }}>
              确定要重置本章全部进度吗？此操作不可撤销。
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmed(false)}>取消</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleReset('all')}>
                确认重置
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
