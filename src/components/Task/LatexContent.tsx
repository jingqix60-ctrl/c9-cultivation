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
