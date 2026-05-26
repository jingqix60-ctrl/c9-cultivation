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

// ── Lightweight Markdown rendering ──
function renderMarkdown(text: string): string {
  // Normalize line endings
  let html = text.replace(/\r\n/g, '\n');

  // Bold **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic *text* (but not ** which is already handled)
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

  // Split on double newlines into paragraphs
  const paragraphs = html.split(/\n{2,}/);
  html = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    // Single newlines within a paragraph become <br/>
    const withBreaks = trimmed.replace(/\n/g, '<br/>');
    return `<p>${withBreaks}</p>`;
  }).join('');

  return html;
}

// ── Full pipeline: LaTeX placeholder protection → Markdown → LaTeX restore ──
let placeholders: string[] = [];

function storeFormula(match: string): string {
  const idx = placeholders.length;
  placeholders.push(match);
  return `%%LATEX_${idx}%%`;
}

export function renderLatex(text: string): string {
  placeholders = [];

  // Pass 1: Extract LaTeX into placeholders (protect from Markdown processing)
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
      const formula = original.slice(2, -2).trim();
      try {
        return katex.renderToString(formula, { throwOnError: false, displayMode: true });
      } catch {
        return original;
      }
    } else {
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
  // Clean up leading <br/> after <p>
  html = html.replace(/<p><br\/>/g, '<p>');

  return html;
}

// Keep old exports for backward compatibility
export { renderLatexInline, renderLatexBlock };
