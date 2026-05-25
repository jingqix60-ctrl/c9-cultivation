import LatexContent from './LatexContent';

interface Props {
  hint: string;
  visible: boolean;
  onToggle: () => void;
}

export default function HintPanel({ hint, visible, onToggle }: Props) {
  return (
    <div style={{ marginTop: 8 }}>
      <button className="btn btn-ghost btn-sm" onClick={onToggle}>
        {visible ? '🔽 收起提示' : '💡 查看提示'}
      </button>
      {visible && (
        <div className="hint-panel anim-in">
          <strong style={{ color: 'var(--gold)' }}>💡 提示：</strong>
          <LatexContent html={hint} />
        </div>
      )}
    </div>
  );
}
