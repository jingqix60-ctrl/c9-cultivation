// ── Lightweight Markdown → HTML rendering ──
// Math formulas ($...$ and $$...$$) are kept as-is for MathJax to typeset.

function renderMarkdown(text: string): string {
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
    const withBreaks = trimmed.replace(/\n/g, '<br/>');
    return `<p>${withBreaks}</p>`;
  }).join('');

  return html;
}

export function renderLatex(text: string): string {
  let html = renderMarkdown(text);

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p><br\/>/g, '<p>');

  return html;
}
