import katex from 'katex';

// Render inline LaTeX: $...$ delimiters
export function renderLatexInline(text: string): string {
  return text.replace(/\$([^$]+)\$/g, (_match, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      return _match;
    }
  });
}

// Render display LaTeX: $$...$$ delimiters
export function renderLatexBlock(text: string): string {
  return text.replace(/\$\$([^$]+)\$\$/g, (_match, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      return _match;
    }
  });
}

// Full render: inline then block
export function renderLatex(text: string): string {
  return renderLatexInline(renderLatexBlock(text));
}
