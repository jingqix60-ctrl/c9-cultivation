import { useState } from 'react';
import { getProfiles, createProfile, deleteProfile, renameProfile, setActiveProfileId, getActiveProfileId, type Profile } from '../../utils/storage';

interface Props {
  onProfileChange: () => void;
}

export default function ProfileSwitcher({ onProfileChange }: Props) {
  const [refresh, setRefresh] = useState(0);
  const profiles = (() => { void refresh; return getProfiles(); })();
  const activeId = getActiveProfileId();

  const handleSwitch = (id: string) => {
    setActiveProfileId(id);
    setRefresh(r => r + 1);
    onProfileChange();
  };

  const handleCreate = () => {
    const name = prompt('输入学习者名称：', '学习者' + (profiles.length + 1));
    if (name && name.trim()) {
      createProfile(name.trim());
      setRefresh(r => r + 1);
      onProfileChange();
    }
  };

  const handleRename = (p: Profile) => {
    const name = prompt('新名称：', p.name);
    if (name && name.trim()) {
      renameProfile(p.id, name.trim());
      setRefresh(r => r + 1);
    }
  };

  const handleDelete = (p: Profile) => {
    if (profiles.length <= 1) { alert('至少保留一个学习者档案。'); return; }
    if (confirm(`确定删除「${p.name}」的学习进度吗？此操作不可撤销。`)) {
      deleteProfile(p.id);
      setRefresh(r => r + 1);
      onProfileChange();
    }
  };

  return (
    <div style={{
      padding: 16, background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-title)' }}>👤 学习者档案</span>
        <button className="btn btn-primary btn-sm" onClick={handleCreate}>+ 新建</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {profiles.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 'var(--radius-sm)',
            background: p.id === activeId ? 'var(--accent-soft)' : 'transparent',
            border: p.id === activeId ? '1px solid var(--accent)' : '1px solid transparent',
          }}>
            <span style={{ flex: 1, fontSize: 13, fontWeight: p.id === activeId ? 600 : 400 }}>
              {p.name} <span style={{ fontSize: 10, color: 'var(--text3)' }}>{p.createdAt}</span>
            </span>
            {p.id !== activeId && (
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 8px' }}
                onClick={() => handleSwitch(p.id)}>切换</button>
            )}
            {p.id === activeId && (
              <span className="tag tag-green" style={{ fontSize: 10 }}>当前</span>
            )}
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}
              onClick={() => handleRename(p)}>✏️</button>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}
              onClick={() => handleDelete(p)}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}
