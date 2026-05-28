# Markdown Rendering & Answer Layout Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix Markdown rendering (raw `**x轴**`), answer panel layout, math formula flickering, and sub-question display.

**Architecture:** Three-pass text pipeline (LaTeX extract → Markdown → LaTeX restore) in `math.ts`. AnswerPanel restructured to card-based always-mounted layout. LatexContent wrapped in React.memo.

**Tech Stack:** React 19, TypeScript, KaTeX, Zustand

---

### Task 1: Add Markdown-to-HTML rendering in math.ts

**Files:**
- Modify: `src/utils/math.ts`

- [ ] **Step 1: Add renderMarkdown function**

Add a new function `renderMarkdown(text: string): string` that converts Markdown to HTML. The full pipeline: LaTeX extraction → Markdown → LaTeX restore.

Replace the entire file content with:

```typescript
import katex from 'katex';

// ── LaTeX rendering ──
function renderLatexInline(text: string): string {
  return text.replace(/\$([^$]+)\$/g, (_match, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), { throwOnError: false, displayMode: false });
    } catch {
      return _match;
    }
  });
}

function renderLatexBlock(text: string): string {
  return text.replace(/\$\$([^$]+)\$\$/g, (_match, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), { throwOnError: false, displayMode: true });
    } catch {
      return _match;
    }
  });
}

// ── Markdown rendering (lightweight, no dependency) ──
function renderMarkdown(text: string): string {
  // Step 1: Normalize line endings
  let html = text.replace(/\r\n/g, '\n');

  // Step 2: Bold **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Step 3: Convert double-newline blocks to paragraphs
  // Split on double newlines
  const paragraphs = html.split(/\n{2,}/);
  html = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    // If it's a single line break within paragraph, convert to <br/>
    const withBreaks = trimmed.replace(/\n/g, '<br/>');
    return `<p>${withBreaks}</p>`;
  }).join('');

  return html;
}

// ── Full pipeline: Markdown + LaTeX ──

// Placeholder tokens to protect LaTeX from Markdown processing
let placeholders: string[] = [];

function storeFormula(match: string): string {
  const idx = placeholders.length;
  placeholders.push(match);
  return `%%LATEX_${idx}%%`;
}

export function renderLatex(text: string): string {
  placeholders = [];

  // Pass 1: Extract LaTeX into placeholders
  let html = text;
  html = html.replace(/\$\$([^$]+)\$\$/g, storeFormula);
  html = html.replace(/\$([^$]+)\$/g, storeFormula);

  // Pass 2: Convert Markdown to HTML
  html = renderMarkdown(html);

  // Pass 3: Restore placeholders with KaTeX-rendered formulas
  html = html.replace(/%%LATEX_(\d+)%%/g, (_match, idxStr: string) => {
    const idx = parseInt(idxStr);
    const original = placeholders[idx];
    if (!original) return _match;

    if (original.startsWith('$$')) {
      // Display math
      const formula = original.slice(2, -2).trim();
      try {
        return katex.renderToString(formula, { throwOnError: false, displayMode: true });
      } catch {
        return original;
      }
    } else {
      // Inline math
      const formula = original.slice(1, -1).trim();
      try {
        return katex.renderToString(formula, { throwOnError: false, displayMode: false });
      } catch {
        return original;
      }
    }
  });

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  // Clean up leading <br/> in paragraphs
  html = html.replace(/<p><br\/>/g, '<p>');

  return html;
}

// Keep old exports for backward compatibility
export { renderLatexInline, renderLatexBlock };
```

- [ ] **Step 2: Run dev server to verify no import errors**

Run: `npm run dev` (check that it starts without errors)

---

### Task 2: Wrap LatexContent with React.memo

**Files:**
- Modify: `src/components/Task/LatexContent.tsx`

- [ ] **Step 1: Add React.memo**

Replace the file content with:

```typescript
import { useMemo, memo } from 'react';
import { renderLatex } from '../../utils/math';

interface Props {
  html: string;
  className?: string;
}

const LatexContent = memo(function LatexContent({ html, className }: Props) {
  const rendered = useMemo(() => renderLatex(html), [html]);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
});

export default LatexContent;
```

---

### Task 3: Restructure AnswerPanel with card layout and always-mounted pattern

**Files:**
- Modify: `src/components/Task/AnswerPanel.tsx`

- [ ] **Step 1: Rewrite AnswerPanel**

Replace the file content with:

```typescript
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
  // Match (1), (2), etc. or 1., 2., etc. or ①, ② etc. at line starts
  const lines = text.split('\n');
  const parts: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (/^\s*(?:\(\d+\)|\d+[\.\)]|[①②③④⑤⑥⑦⑧⑨⑩])\s*/.test(line)) {
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
                  <LatexContent html={sa} />
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
```

---

### Task 4: Improve sub-question display in TaskPage

**Files:**
- Modify: `src/components/Task/TaskPage.tsx`

- [ ] **Step 1: Fix splitSubQuestions and sub-question rendering**

Update the `splitSubQuestions` function and the sub-question rendering section (lines 7-22 and 119-129):

Replace lines 7-22:
```typescript
function splitSubQuestions(text: string): string[] {
  // Match markers at line start: (1), (2), 1., 2., ①, ②, **题1**, etc.
  const lines = text.split('\n');
  const parts: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    const isMarker = /^\s*(?:\(\d+\)|\(\w\)|\d+[\.\)]|[①②③④⑤⑥⑦⑧⑨⑩]|\*\*题\s*\d+\*\*)/.test(line);
    if (isMarker && current.length > 0) {
      parts.push(current.join('\n').trim());
      current = [];
    }
    current.push(line);
  }
  if (current.length > 0) {
    parts.push(current.join('\n').trim());
  }
  return parts.length > 1 ? parts : [text];
}
```

Replace lines 117-130 (the question rendering section):
```tsx
          <div className="task-section">
            <div className="task-section-label">题目</div>
            <div className="task-body md-content">
              {subQuestions.length > 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {subQuestions.map((sq, i) => (
                    <div key={i} style={{
                      padding: i > 0 ? '14px 0 0' : 0,
                      borderTop: i > 0 ? '1px solid var(--border)' : 'none'
                    }}>
                      <LatexContent html={sq} />
                    </div>
                  ))}
                </div>
              ) : (
                <LatexContent html={task.question} />
              )}
            </div>
          </div>
```

---

### Task 5: Add CSS styles for answer blocks and Markdown content

**Files:**
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Add new CSS classes**

Add the following styles after the existing `.answer-panel` / `.hint-panel` block (after line 317):

```css
/* ═══════════ ANSWER BLOCKS (card style) ═══════════ */
.answer-block {
  margin: 12px 0;
  padding: 16px;
  border-radius: 0 var(--radius) var(--radius) 0;
  font-size: 14px;
  line-height: 1.9;
  overflow-wrap: break-word;
  word-break: break-word;
}
.answer-block-label {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 0.03em;
}
.answer-block-answer {
  background: rgba(79,125,90,0.04);
  border-left: 3px solid var(--green);
}
.answer-block-answer .answer-block-label { color: var(--green); }
.answer-block-method {
  background: var(--accent-soft);
  border-left: 3px solid var(--accent);
}
.answer-block-method .answer-block-label { color: var(--accent); }
.answer-block-trap {
  background: var(--red-soft);
  border-left: 3px solid var(--red);
}
.answer-block-trap .answer-block-label { color: var(--red); }
.answer-block-mastery {
  background: var(--gold-soft);
  border-left: 3px solid var(--gold);
}
.answer-block-mastery .answer-block-label { color: var(--gold); }

.answer-sub-block {
  padding: 10px 12px;
  background: rgba(79,125,90,0.03);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(79,125,90,0.08);
}

/* ═══════════ MARKDOWN CONTENT ═══════════ */
.md-content strong {
  font-weight: 700;
  color: var(--text);
}
.md-content p {
  margin-bottom: 8px;
}
.md-content p:last-child {
  margin-bottom: 0;
}
.md-content ul,
.md-content ol {
  padding-left: 1.5em;
  margin: 6px 0 10px;
}
.md-content li {
  margin-bottom: 4px;
}
.md-content br + br {
  display: block;
  content: "";
  margin-top: 6px;
}
```

---

### Task 6: KaTeX font preload in index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add font preload link**

Add inside `<head>`, after the viewport meta tag:

```html
<link rel="preload" href="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/fonts/KaTeX_Main-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="preload" href="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/fonts/KaTeX_Math-Italic.woff2" as="font" type="font/woff2" crossorigin="anonymous">
```

---

### Task 7: Rewrite 3 sample answers with detailed structure

**Files:**
- Modify: `src/data/math/zhangyu30/chapter10.ts`

- [ ] **Step 1: Rewrite answer for task id=3 (simple disk method)**

Replace the `answer` field of task id=3 (绕x轴·圆盘法):

```typescript
answer: '**（1）方法选择：**\n\n绕 $x$ 轴旋转，被积函数 $y=y(x)$，直接用**圆盘法（垫片法）**：$V=\\pi\\int y^2 dx$。\n\n**（2）旋转轴：** $x$ 轴。\n\n**（3）微元取法：**\n\n在 $[0,\\pi]$ 上取宽度为 $dx$ 的小矩形竖条，绕 $x$ 轴旋转后形成**薄圆盘**。\n\n* 圆盘半径 $r = y(x) = e^{-x/2}\\sqrt{\\sin x}$\n* 圆盘面积 $A(x) = \\pi r^2 = \\pi e^{-x}\\sin x$\n* 体积微元 $dV = A(x)dx = \\pi e^{-x}\\sin x\\,dx$\n\n**（4）积分上下限：**\n\n函数 $y=\\sqrt{\\sin x}$ 要求 $\\sin x\\ge0$，因此定义域为 $x\\in[0,\\pi]$（$[\\pi,2\\pi]$ 上 $\\sin x\\le0$，函数无定义）。积分下限 $a=0$，上限 $b=\\pi$。\n\n**（5）积分表达式与计算：**\n\n$$V = \\pi\\int_0^\\pi e^{-x}\\sin x\\,dx$$\n\n分部积分两次：\n\n$$\\begin{aligned} \\int_0^\\pi e^{-x}\\sin x\\,dx &= \\left[-e^{-x}\\cos x\\right]_0^\\pi - \\int_0^\\pi e^{-x}\\cos x\\,dx \\\\ &= (e^{-\\pi}+1) - \\left(\\left[e^{-x}\\sin x\\right]_0^\\pi + \\int_0^\\pi e^{-x}\\sin x\\,dx\\right) \\\\ &= e^{-\\pi}+1 - \\int_0^\\pi e^{-x}\\sin x\\,dx \\end{aligned}$$\n\n移项得 $2\\int_0^\\pi e^{-x}\\sin x\\,dx = 1+e^{-\\pi}$，所以 $\\int_0^\\pi e^{-x}\\sin x\\,dx = \\frac{1+e^{-\\pi}}{2}$。\n\n**（6）最终结论：**\n\n$$V = \\frac{\\pi}{2}(1+e^{-\\pi})$$\n\n**（7）易错点：**\n\n* 不能直接在 $[0,2\\pi]$ 上积分——函数在 $(\\pi,2\\pi]$ 上无定义，必须先判断定义域。\n* 分部积分时符号容易搞混，建议写出完整的两次分部积分过程。\n\n**（8）本题总结：**\n\n圆盘法绕 $x$ 轴的标准三步：确认定义域 → 写出 $y^2$ → 计算定积分。本题同时考察了定义域判断和分部积分技法。',
```

- [ ] **Step 2: Rewrite answer for task id=8 (method comparison)**

Replace the `answer` field of task id=8:

```typescript
answer: '**（1）方法选择：圆盘法（反解）**\n\n绕 $y$ 轴旋转，第一种方法是**圆盘法**。需要反解 $y=x^2$ 得 $x=\\sqrt{y}$（取正根，因为 $x\\in[0,1]$）。\n\n**旋转轴：** $y$ 轴。\n\n**微元取法：** 对 $y$ 积分，取水平薄圆盘。$y$ 从 $0$ 到 $1$，圆盘半径 $r(y)=\\sqrt{y}$，面积 $\\pi(\\sqrt{y})^2=\\pi y$。\n\n$$V = \\pi\\int_0^1 (\\sqrt{y})^2\\,dy = \\pi\\int_0^1 y\\,dy = \\frac{\\pi}{2}$$\n\n---\n\n**（2）方法选择：柱壳法**\n\n绕 $y$ 轴旋转，第二种方法是**柱壳法**。不需要反解函数。\n\n**旋转轴：** $y$ 轴。\n\n**微元取法：** 对 $x$ 积分，取 $[x,x+dx]$ 上的竖条，绕 $y$ 轴旋转形成**圆柱壳**。\n\n* 壳周长 $= 2\\pi x$\n* 壳高度 $= x^2$\n* 壳厚度 $= dx$\n* 体积微元 $dV = 2\\pi x \\cdot x^2 \\cdot dx = 2\\pi x^3\\,dx$\n\n$$V = 2\\pi\\int_0^1 x \\cdot x^2\\,dx = 2\\pi\\int_0^1 x^3\\,dx = \\frac{\\pi}{2}$$\n\n---\n\n**（3）方法对比：**\n\n结果一致 ✓。柱壳法更简单——不需要反解函数，直接对 $x$ 积分。但本题反解 $x=\\sqrt{y}$ 也很容易，所以两种方法差异不大。\n\n**核心原则：** 绕 $y$ 轴优先考虑柱壳法；反解特别容易时可用圆盘法。花 5 秒判断，性价比极高。\n\n**易错点：** 不要形成"永远用柱壳法"的教条。反解容易时圆盘法可能更简洁。\n\n**本题总结：** 这道题建立了方法选择的"5秒判断"意识——在动笔前快速比较两种方法的计算量。',
```

- [ ] **Step 3: Rewrite answer for task id=16 (comprehensive multi-part)**

Replace the `answer` field of task id=16:

```typescript
answer: '**（1）求 $a$ 和切点坐标**\n\n**方法：** 公切线条件——两曲线在切点处函数值相等且导数相等。\n\n设切点横坐标为 $x_0$：\n\n$$y_1\' = \\frac{a}{2\\sqrt{x}}, \\quad y_2\' = \\frac{1}{2x}$$\n\n导数相等：$\\frac{a}{2\\sqrt{x_0}} = \\frac{1}{2x_0}$ → $a\\sqrt{x_0} = 1$\n\n函数值相等：$a\\sqrt{x_0} = \\ln\\sqrt{x_0}$ → $\\ln\\sqrt{x_0} = 1$ → $\\sqrt{x_0} = e$ → $x_0 = e^2$\n\n代入得 $a = \\frac{1}{e}$，切点 $(e^2, 1)$。\n\n---\n\n**（2）求面积 $S$**\n\n**方法：** $S = \\int(上-下)dx$。注意两曲线的定义域不同：\n\n* $y_1 = \\frac{\\sqrt{x}}{e}$ 定义域 $[0, +\\infty)$\n* $y_2 = \\ln\\sqrt{x} = \\frac{1}{2}\\ln x$ 定义域 $(0, +\\infty)$，在 $(0,1)$ 上 $y_2 < 0$（在 $x$ 轴下方）\n\n区域由 $y_1$、$y_2$ 与 $x$ 轴围成，需分段处理：\n\n$$S = \\int_0^{e^2} \\frac{\\sqrt{x}}{e}\\,dx - \\int_1^{e^2} \\frac{1}{2}\\ln x\\,dx = \\frac{e^2}{6} - \\frac{1}{2}$$\n\n---\n\n**（3）求体积 $V$**\n\n**方法：** 绕 $x$ 轴旋转，用垫片法 $V = \\pi\\int(上^2 - 下^2)dx$。\n\n**旋转轴：** $x$ 轴。\n\n**微元取法：** 取宽 $dx$ 的竖条，绕 $x$ 轴形成薄圆环（垫圈）。\n\n* 外半径 $R = \\frac{\\sqrt{x}}{e}$（来自 $y_1$）\n* 内半径 $r = \\frac{1}{2}\\ln x$（来自 $y_2$，仅在 $x\\ge1$ 时有效）\n\n$$V = \\pi\\int_0^{e^2} \\left(\\frac{\\sqrt{x}}{e}\\right)^2 dx - \\pi\\int_1^{e^2} \\left(\\frac{1}{2}\\ln x\\right)^2 dx$$\n\n$$= \\frac{\\pi}{e^2}\\cdot\\frac{x^2}{2}\\Big|_0^{e^2} - \\frac{\\pi}{4}\\int_1^{e^2} \\ln^2 x\\,dx = \\frac{\\pi}{2}$$\n\n---\n\n**易错点：** 两个积分区间不同！$y_1$ 在 $[0,e^2]$ 上，$y_2$ 仅在 $[1,e^2]$ 上非负。混淆上下限是常见失分点。\n\n**本题总结：** 公切线→面积→体积的三连击是压轴题型标准结构。关键在于公切线条件（导数相等 + 函数值相等）和体积积分区间的确认。',
```

---

### Task 8: Build check

**Files:**
- N/A (verification only)

- [ ] **Step 1: Run TypeScript check and Vite build**

Run: `npm run build`

Expected: No errors. Build completes successfully.

- [ ] **Step 2: Run dev server and do spot-check**

Run: `npm run dev`

Open in browser and verify:
- Task questions show `**bold**` as bold text, not raw asterisks
- Answer panel shows 4 card blocks with colored left borders
- Toggling "查看答案" does not cause formula flickering
- Multi-part questions (id=8, id=16) show sub-questions and sub-answers properly split
- Mobile width does not overflow
