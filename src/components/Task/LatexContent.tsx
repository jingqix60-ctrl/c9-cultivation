import { useMemo, useEffect, useRef, memo } from 'react';
import { renderLatex } from '../../utils/math';

interface Props {
  html: string;
  className?: string;
}

declare global {
  interface Window {
    MathJax?: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      typesetClear: (elements?: HTMLElement[]) => void;
    };
  }
}

const LatexContent = memo(function LatexContent({ html, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useMemo(() => renderLatex(html), [html]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    const typeset = () => {
      if (cancelled) return;
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetClear([el]);
        window.MathJax.typesetPromise([el]);
      } else {
        setTimeout(typeset, 100);
      }
    };

    typeset();

    return () => { cancelled = true; };
  }, [rendered]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
});

export default LatexContent;
