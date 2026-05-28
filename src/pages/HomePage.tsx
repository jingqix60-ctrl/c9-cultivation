import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STAGES } from '../data/stages';

const BASE = '/c9-cultivation';
const STAGE_IMAGES: Record<string, string> = {
  foundation: `${BASE}/images/xiajie.jpg`,
  spirit: `${BASE}/images/lingyu.jpg`,
  heaven: `${BASE}/images/tiantang-wen.jpg`,
};

// ── 考研倒计时 ──
// 2026年考研（2027届）预计时间：
const EXAMS = [
  { label: '思想政治理论', date: new Date('2026-12-21T08:30:00') },
  { label: '外国语',       date: new Date('2026-12-21T14:00:00') },
  { label: '数学',         date: new Date('2026-12-22T08:30:00') },
  { label: '专业课',       date: new Date('2026-12-22T14:00:00') },
];

function getNextExam() {
  const now = Date.now();
  for (const exam of EXAMS) {
    const diff = exam.date.getTime() - now;
    if (diff > 0) return { ...exam, diff };
  }
  return null;
}

function formatCountdown(diff: number) {
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

function ExamCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allFinished = EXAMS.every(exam => exam.date.getTime() - now <= 0);
  if (allFinished) {
    return (
      <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 14, color: '#B85C5C', fontFamily: 'var(--font-title)', fontWeight: 600, letterSpacing: '0.04em' }}>
        🎉 所有考试已结束
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap',
      marginBottom: 24,
    }}>
      {EXAMS.map(exam => {
        const diff = exam.date.getTime() - now;
        const ended = diff <= 0;
        const cd = formatCountdown(Math.max(0, diff));
        return (
          <div key={exam.label} style={{
            textAlign: 'center', minWidth: 120,
            background: 'var(--surface)', border: '1px solid rgba(184,92,92,0.15)',
            borderRadius: 'var(--radius)', padding: '10px 14px',
            opacity: ended ? 0.35 : 1,
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 10, color: ended ? 'var(--text3)' : '#B85C5C', marginBottom: 3, fontFamily: 'var(--font-title)', letterSpacing: '0.04em', fontWeight: 600 }}>
              {exam.label}
              {ended && ' ✓'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, fontFamily: 'var(--font-title)' }}>
              {[
                { v: cd.d, l: '天' },
                { v: cd.h, l: '时' },
                { v: cd.m, l: '分' },
                { v: cd.s, l: '秒' },
              ].map(item => (
                <div key={item.l} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  background: ended ? 'var(--surface3)' : 'rgba(184,92,92,0.06)',
                  borderRadius: 4, padding: '4px 6px', minWidth: 32,
                }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: ended ? 'var(--text3)' : (item.l === '秒' ? '#C0392B' : '#B85C5C'), fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>
                    {String(item.v).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 8, color: ended ? 'var(--text3)' : '#B85C5C', marginTop: 1 }}>{item.l}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page anim-in">
      {/* 装饰层 */}
      <div className="home-glow" />
      <div className="home-circle home-circle-1" />
      <div className="home-circle home-circle-2" />
      <div className="home-cloud home-cloud-left" />
      <div className="home-cloud home-cloud-right" />

      <div className="home-content">
        {/* 标题 */}
        <div className="home-header" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="home-logo" style={{
            width: 120, height: 120, margin: '0 auto 16px',
            borderRadius: 12,
            overflow: 'hidden',
            background: '#F7F1E6',
            boxShadow: '0 2px 16px rgba(94,77,56,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={`${BASE}/images/shouye.jpg`} alt="天道修炼"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 26, color: 'var(--accent)', fontWeight: 600, marginBottom: 8, letterSpacing: '0.06em' }}>
            天道修炼
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text2)', maxWidth: 360, margin: '0 auto', lineHeight: 1.7 }}>
            选择你的修炼阶段，开启考研数学渡劫之路
          </p>
        </div>

        {/* 考研倒计时 */}
        <ExamCountdown />

        {/* 三张阶段大卡片 */}
        <div className="home-cards" style={{
          display: 'flex', flexDirection: 'column', gap: 18,
          width: '100%', maxWidth: 440,
        }}>
        {STAGES.map(stage => (
          <button
            key={stage.id}
            onClick={() => navigate(`/stage/${stage.id}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 18,
              width: '100%', padding: '16px 20px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'var(--font-body)',
              color: 'var(--text)',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.2s',
            }}
            className="home-stage-btn"
          >
            <div style={{
              flexShrink: 0,
              width: 96, height: 72,
              borderRadius: 6,
              overflow: 'hidden',
              background: '#F7F1E6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={STAGE_IMAGES[stage.id]} alt={stage.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--font-title)', color: 'var(--accent)', marginBottom: 2, letterSpacing: '0.04em' }}>
                {stage.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                {stage.desc}
              </div>
            </div>
            <span style={{ fontSize: 16, color: 'var(--text3)', flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
