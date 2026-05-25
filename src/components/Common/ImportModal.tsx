import { useState, useRef } from 'react';
import { useProgressStore } from '../../store/useProgressStore';
import { importAllProgress, createProfile, type ExportedProgress } from '../../utils/storage';

interface Props { onClose: () => void; }

export default function ImportModal({ onClose }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ExportedProgress | null>(null);
  const [choice, setChoice] = useState<'overwrite' | 'new' | null>(null);
  const importAllData = useProgressStore(s => s.importAllData);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = reader.result as string;
        const result = importAllData(json);
        if (!result.success) {
          setError(result.error || '导入失败');
          return;
        }
        setParsedData(result.data!);
        setError(null);
      } catch (err) {
        setError(`文件解析失败：${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!parsedData || !choice) return;
    if (choice === 'overwrite') {
      importAllProgress(parsedData, useProgressStore.getState().profileId || parsedData.profile.id);
    } else {
      const newProfile = createProfile(parsedData.profile.name + ' (导入)');
      importAllProgress(parsedData, newProfile.id);
    }
    onClose();
    window.location.reload();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <h3>📤 导入进度</h3>
        {!parsedData ? (
          <>
            <p style={{ fontSize: 12, color: 'var(--text2)' }}>
              选择之前导出的 JSON 进度文件。导入不会覆盖题库内容，只恢复学习进度。
            </p>
            <input ref={fileRef} type="file" accept=".json"
              onChange={handleFile}
              style={{ display: 'block', margin: '12px 0', fontSize: 12 }} />
            {error && (
              <div style={{ padding: '8px 12px', background: 'var(--red-soft)', color: 'var(--red)', borderRadius: 6, fontSize: 11, marginBottom: 8 }}>
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
              已读取进度数据：
            </p>
            <div style={{ fontSize: 11, color: 'var(--text2)', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 6, marginBottom: 10 }}>
              <div>学习者：{parsedData.profile.name}</div>
              <div>导出时间：{parsedData.exportedAt.slice(0, 10)}</div>
              <div>包含 {Object.keys(parsedData.chapters).length} 个章节的进度</div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>选择导入方式：</p>
            <div className="modal-actions" style={{ flexDirection: 'column', gap: 6 }}>
              <button className={`btn btn-sm ${choice === 'overwrite' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%' }}
                onClick={() => setChoice('overwrite')}>
                覆盖当前学习者进度
              </button>
              <button className={`btn btn-sm ${choice === 'new' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%' }}
                onClick={() => setChoice('new')}>
                新建学习者并导入
              </button>
              {choice && (
                <button className="btn btn-primary btn-sm" style={{ width: '100%' }}
                  onClick={handleImport}>确认导入</button>
              )}
              <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}
                onClick={onClose}>取消</button>
            </div>
          </>
        )}
        <div className="modal-actions" style={{ marginTop: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
}
