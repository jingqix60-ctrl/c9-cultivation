import LatexContent from './LatexContent';

interface Props {
  answer: string;
  method: string;
  trap: string;
  afterMastery: string;
  visible: boolean;
  onToggle: () => void;
}

export default function AnswerPanel({ answer, method, trap, afterMastery, visible, onToggle }: Props) {
  return (
    <div style={{ marginTop: 8 }}>
      <button className="btn btn-accent btn-sm" onClick={onToggle}>
        {visible ? '🔼 收起答案' : '📝 查看答案'}
      </button>
      {visible && (
        <div className="answer-panel anim-in">
          <strong style={{ color: 'var(--green)' }}>📝 答案：</strong>
          <LatexContent html={answer} />
          <br />
          <strong style={{ color: 'var(--accent)' }}>🔧 方法解析：</strong>
          <LatexContent html={method} />
          <br />
          <strong style={{ color: 'var(--red)' }}>⚠️ 易错陷阱：</strong>
          <LatexContent html={trap} />
          <br />
          <strong style={{ color: 'var(--gold)' }}>✅ 完成后掌握：</strong>
          <LatexContent html={afterMastery} />
        </div>
      )}
    </div>
  );
}
