# Markdown Rendering & Answer Layout Overhaul

**Date**: 2026-05-26  
**Status**: draft

## Problem Summary

The site has four rendering issues:
1. Markdown syntax (`**bold**`) renders as raw text instead of styled HTML
2. Math formulas flicker when toggling answer visibility
3. Answer panel is a single cramped block with no visual hierarchy
4. Multi-part questions display as one undifferentiated paragraph

## Technical Approach

### 1. Markdown-to-HTML Pipeline

**File**: `src/utils/math.ts`

Current state: `renderLatex()` only converts `$...$` and `$$...$$` via KaTeX. No Markdown processing exists.

New pipeline: three-pass conversion:

```
Raw text → Extract LaTeX → placeholder tokens
        → Markdown → HTML (bold, line breaks, lists)
        → Restore LaTeX tokens → final HTML
```

Add a `renderMarkdown()` function in `math.ts` that handles:
- `**text**` → `<strong>text</strong>`
- `\n` → `<br/>` (or paragraph breaks for double newlines)
- Numbered list detection: lines starting with `(1)` or `1.` → `<ol>` / `<li>`
- Bullet list detection: lines starting with `* ` or `- ` → `<ul>` / `<li>`

No external Markdown library — the required syntax is limited and predictable. This keeps the bundle small and avoids dependency on a library that might also process `$` characters (which would conflict with KaTeX).

### 2. Math Formula Stability

Three changes to eliminate flickering:

**a) AnswerPanel always-mounted**
- **File**: `src/components/Task/AnswerPanel.tsx`
- Replace conditional rendering `{visible && (...)}` with CSS-based visibility: always render the DOM, but wrap content in a `<div>` with `style={{ display: visible ? 'block' : 'none' }}`. This keeps KaTeX DOM nodes alive so they don't re-render on each toggle.

**b) LatexContent memoization**
- **File**: `src/components/Task/LatexContent.tsx`
- Wrap component with `React.memo` so identical `html` props skip re-render entirely.

**c) Remove animation from answer area**
- Remove the `.anim-in` class from the answer panel inner content. The fade animation triggers layout recalc which causes KaTeX reflow.

### 3. Answer Panel Card Layout

**File**: `src/components/Task/AnswerPanel.tsx`

Restructure from inline content with `<br/>` separators to four independent card blocks, each with a colored left border:

```
┌─ 📝 答案 ───────────────────────────┐
│  (green left border, bg tint)        │
│  sub-question blocks if multi-part   │
│  formulas on separate lines          │
└─────────────────────────────────────┘
    ↓ gap
┌─ 🔧 方法解析 ────────────────────────┐
│  (accent/brown left border)          │
└─────────────────────────────────────┘
    ↓ gap
┌─ ⚠️ 易错陷阱 ────────────────────────┐
│  (red left border)                   │
└─────────────────────────────────────┘
    ↓ gap
┌─ ✅ 完成后掌握 ──────────────────────┐
│  (gold left border)                  │
└─────────────────────────────────────┘
```

Each card: `padding: 16px`, `margin-bottom: 12px`, `border-left: 3px solid <color>`, `border-radius: 0 var(--radius) var(--radius) 0`, `line-height: 1.9`.

The answer card specifically detects multi-part questions (via `(1)` markers) and splits content into sub-blocks internally.

### 4. Question Display Improvements

**File**: `src/components/Task/TaskPage.tsx`

- Improve `splitSubQuestions()` to reliably detect `(1)`, `(2)`, `(a)`, `(b)`, `①`, `②`, `**题1：**` markers
- Multi-part questions: render each sub-question in its own block with a light separator
- Single-part questions: render in a standard `.task-body` div with proper line-height

### 5. CSS: Markdown-rendered Content Styles

**File**: `src/styles/theme.css`

Add styles for rendered Markdown content:
```css
.md-content strong { font-weight: 700; color: var(--text); }
.md-content ul, .md-content ol { padding-left: 1.5em; margin: 6px 0; }
.md-content li { margin-bottom: 4px; }
.md-content p { margin-bottom: 8px; }
.md-content br + br { display: block; content: ""; margin-top: 8px; }
```

### 6. Mobile / Tablet Responsiveness

**File**: `src/styles/theme.css`

- Formula overflow: `.katex-display { overflow-x: auto; overflow-y: hidden; }` (already present, verify)
- Answer cards: `max-width: 100%; word-wrap: break-word;`
- Sub-question blocks: `overflow-wrap: break-word;`
- Mobile line-height for answer content: at least 1.7
- KaTeX font preload in `index.html`:
  ```html
  <link rel="preload" href="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/fonts/KaTeX_Main-Regular.woff2" as="font" crossorigin>
  ```

### 7. Sample Answer Rewrites

Select 3-5 representative tasks from `chapter10.ts` and rewrite their `answer` field to follow the detailed structure:
- Why this method
- What is the rotation axis
- How the micro-element is taken
- How the radius is determined
- Integration bounds reasoning
- Formula derivation
- Final expression
- Common mistakes
- Summary

Candidate tasks for rewrite: id=3 (simple disk method), id=8 (method comparison), id=16 (comprehensive multi-part).

## Files Changed

| File | Change |
|------|--------|
| `src/utils/math.ts` | Add `renderMarkdown()` + modify pipeline |
| `src/components/Task/LatexContent.tsx` | Add `React.memo` |
| `src/components/Task/AnswerPanel.tsx` | Restructure to card layout, always-mounted pattern |
| `src/components/Task/TaskPage.tsx` | Improve sub-question splitting |
| `src/styles/theme.css` | Add `.md-content` styles, answer card styles, mobile fixes |
| `index.html` | Add KaTeX font preload link |
| `src/data/math/zhangyu30/chapter10.ts` | Rewrite 3-5 answer fields as structured examples |

## What NOT to Change

- Do not delete or remove any tasks
- Do not change task IDs, stages, or order
- Do not change question text (only render it better)
- Do not change answer content except the 3-5 sample rewrites
- Do not change data types (`Task` interface)
- Do not add new npm dependencies
