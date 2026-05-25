import { useMemo } from 'react';
import { renderLatex } from '../../utils/math';

interface Props {
  html: string;
  className?: string;
}

export default function LatexContent({ html, className }: Props) {
  const rendered = useMemo(() => renderLatex(html), [html]);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
