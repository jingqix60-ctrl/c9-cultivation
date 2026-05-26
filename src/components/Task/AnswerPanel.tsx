import LatexContent from './LatexContent';

interface Props {
  answer: string;
  method: string;
  trap: string;
  afterMastery: string;
  visible: boolean;
  onToggle: () => void;
}

function splitAnswerSubs(text: string): string[] {
  const lines = text.split('\n');
  const parts: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (/^\s*(?:\(\d+\)|\(\w\)|\d+[\.\)]|[①②③④⑤⑥⑦⑧⑨⑩])\s*/.test(line)) {
      if (current.length > 0) {
        parts.push(current.join('\n').trim());
        current = [];
      }
    }
    current.push(line);
  }
  if (current.length > 0) {
    parts.push(current.join('\n').trim());
  }
  return parts.length > 1 ? parts : [text];
}

export default function AnswerPanel({ answer, method, trap, afterMastery, visible, onToggle }: Props) {
  const subAnswers = splitAnswerSubs(answer);
  const hasSubs = subAnswers.length > 1;

  return (
    <div style={{ marginTop: 8 }}>
      <button className="btn btn-accent btn-sm" onClick={onToggle}>
        {visible ? '🔼 收起答案' : '📝 查看答案'}
      </button>

      <div style={{ display: visible ? 'block' : 'none' }}>
        {/* Answer Card */}
        <div className="answer-block answer-block-answer">
          <div className="answer-block-label">📝 答案</div>
          {hasSubs ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {subAnswers.map((sa, i) => (
                <div key={i} className="answer-sub-block">
                  <LatexContent html={sa} className="md-content" />
                </div>
              ))}
            </div>
          ) : (
            <LatexContent html={answer} className="md-content" />
          )}
        </div>

        {/* Method Card */}
        <div className="answer-block answer-block-method">
          <div className="answer-block-label">🔧 方法解析</div>
          <LatexContent html={method} className="md-content" />
        </div>

        {/* Trap Card */}
        <div className="answer-block answer-block-trap">
          <div className="answer-block-label">⚠️ 易错陷阱</div>
          <LatexContent html={trap} className="md-content" />
        </div>

        {/* After Mastery Card */}
        <div className="answer-block answer-block-mastery">
          <div className="answer-block-label">✅ 完成后掌握</div>
          <LatexContent html={afterMastery} className="md-content" />
        </div>
      </div>
    </div>
  );
}
