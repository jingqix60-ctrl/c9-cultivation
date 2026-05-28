import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/theme.css';
import App from './App';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'var(--font-body)', color: 'var(--text)', background: 'var(--bg)', minHeight: '100vh' }}>
          <h2 style={{ color: 'var(--red)', fontFamily: 'var(--font-title)' }}>应用加载失败</h2>
          <pre style={{ marginTop: 16, padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, overflow: 'auto', maxHeight: 400 }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '10px 18px', background: 'var(--accent)', color: '#FFFDF7', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 禁止 Ctrl+滚轮 和 Ctrl+± 缩放页面
document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
document.addEventListener('keydown', e => {
  if (e.ctrlKey && (e.key === '=' || e.key === '-' || e.key === '0' || e.key === '加' || e.key === '减')) {
    e.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
