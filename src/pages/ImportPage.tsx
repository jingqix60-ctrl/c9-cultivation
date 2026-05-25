import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChapterData } from '../data/types';
import { registerImportedChapter, saveChapterData } from '../data/math/zhangyu30';

function validateChapterData(data: unknown): { valid: true; data: ChapterData } | { valid: false; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') return { valid: false, errors: ['JSON 必须是一个对象'] };

  const d = data as Record<string, unknown>;

  if (typeof d.chapterId !== 'number') errors.push('缺少 chapterId（数字）');
  if (typeof d.chapterTitle !== 'string') errors.push('缺少 chapterTitle（字符串）');
  if (typeof d.book !== 'string') errors.push('缺少 book（字符串）');
  if (!Array.isArray(d.tasks)) errors.push('缺少 tasks（数组）');

  if (Array.isArray(d.tasks)) {
    d.tasks.forEach((t: unknown, i: number) => {
      const task = t as Record<string, unknown>;
      if (typeof task.id !== 'number') errors.push(`tasks[${i}]: 缺少 id`);
      if (typeof task.title !== 'string') errors.push(`tasks[${i}]: 缺少 title`);
      if (typeof task.question !== 'string') errors.push(`tasks[${i}]: 缺少 question`);
    });
  }

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true, data: d as unknown as ChapterData };
}

export default function ImportPage() {
  const navigate = useNavigate();
  const [jsonText, setJsonText] = useState('');
  const [result, setResult] = useState<{ valid: true; data: ChapterData } | { valid: false; errors: string[] } | null>(null);
  const [imported, setImported] = useState(false);

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const res = validateChapterData(parsed);
      setResult(res);
      setImported(false);
    } catch (e) {
      setResult({ valid: false, errors: [`JSON 解析失败：${(e as Error).message}`] });
      setImported(false);
    }
  };

  const handleImport = () => {
    if (!result || !result.valid) return;
    const data = result.data;

    // Save chapter data
    saveChapterData(data.chapterId, data);

    // Register in chapter list
    registerImportedChapter({
      chapterId: data.chapterId,
      chapterNumber: data.chapterId,
      chapterTitle: data.chapterTitle,
      book: data.book,
      description: data.description || '',
      taskCount: data.tasks.length,
      difficulty: 3,
      status: 'available',
    });

    setImported(true);
  };

  return (
    <div className="anim-in">
      <h3 style={{ color: 'var(--purple)', marginBottom: 8, fontSize: 14 }}>
        📥 导入章节 JSON
      </h3>

      <p style={{ color: 'var(--text2)', fontSize: 12, marginBottom: 8 }}>
        粘贴标准格式的章节 JSON，系统将自动校验并导入为可用章节。
        导入后可在章节目录中找到该章节，开始修炼。
      </p>

      <textarea
        value={jsonText}
        onChange={e => { setJsonText(e.target.value); setResult(null); setImported(false); }}
        placeholder='{"chapterId": 11, "chapterTitle": "...", ...}'
        style={{
          width: '100%',
          minHeight: 200,
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 12,
          fontSize: 12,
          fontFamily: 'monospace',
          resize: 'vertical',
        }}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn btn-accent" onClick={handleValidate} disabled={!jsonText.trim()}>
          🔍 校验 JSON
        </button>
        <button
          className="btn btn-green"
          onClick={handleImport}
          disabled={!result?.valid || imported}
        >
          {imported ? '✅ 已导入' : '📥 确认导入'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/math/zhangyu30')}>
          返回目录
        </button>
      </div>

      {/* Validation result */}
      {result && !result.valid && (
        <div style={{
          marginTop: 12,
          padding: 12,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid var(--red)',
          borderRadius: 'var(--radius)',
          fontSize: 12,
        }}>
          <strong style={{ color: 'var(--red)' }}>❌ 校验失败：</strong>
          <ul style={{ margin: '4px 0 0 16px', color: 'var(--red)' }}>
            {result.errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {result?.valid && !imported && (
        <div style={{
          marginTop: 12,
          padding: 12,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid var(--green)',
          borderRadius: 'var(--radius)',
          fontSize: 12,
        }}>
          <strong style={{ color: 'var(--green)' }}>✅ 校验通过</strong>
          <div style={{ marginTop: 6, color: 'var(--text)' }}>
            <div>章节：第{result.data.chapterId}讲 · {result.data.chapterTitle}</div>
            <div>书籍：{result.data.book}</div>
            <div>任务数：{result.data.tasks.length} 题</div>
            <div>知识点：{(result.data.knowledgePoints || []).join('、') || '—'}</div>
          </div>
          <p style={{ marginTop: 6, color: 'var(--text2)', fontSize: 11 }}>
            点击"确认导入"完成录入。
          </p>
        </div>
      )}

      {imported && (
        <div style={{
          marginTop: 12,
          padding: 12,
          background: 'rgba(251,191,36,0.08)',
          border: '1px solid var(--gold)',
          borderRadius: 'var(--radius)',
          fontSize: 12,
        }}>
          <strong style={{ color: 'var(--gold)' }}>🎉 导入成功！</strong>
          <p style={{ marginTop: 4, color: 'var(--text2)' }}>
            章节已添加到张宇30讲目录，可前往修炼。
          </p>
          <button
            className="btn btn-accent btn-sm"
            style={{ marginTop: 8 }}
            onClick={() => navigate('/math/zhangyu30')}
          >
            前往章节目录 →
          </button>
        </div>
      )}
    </div>
  );
}
