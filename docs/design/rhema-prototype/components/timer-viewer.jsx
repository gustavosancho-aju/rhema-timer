// timer-viewer.jsx — Viewer fullscreen (palco)

function TimerViewer() {
  return (
    <div style={{
      width: 1440, height: 900,
      background: '#000',
      color: 'var(--fg-1)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* subtle wrapup glow — red because < 10min */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(900px 500px at 50% 50%, rgba(255,107,107,0.08), transparent 70%)',
      }} />

      {/* ws status dot */}
      <div style={{
        position: 'absolute', top: 24, right: 24,
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 10, color: 'rgba(240,250,250,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2E6A7A', boxShadow: '0 0 4px #2E6A7A' }} />
        conectado
      </div>

      {/* top label */}
      <div style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(240,250,250,0.4)', letterSpacing: '0.24em', textTransform: 'uppercase' }}>
          Culto Dom · 26/abr
        </div>
      </div>

      {/* main */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontSize: 288,
          fontFamily: 'var(--font-mono)',
          fontWeight: 500,
          color: '#ff6b6b',
          letterSpacing: '-0.04em',
          lineHeight: 0.9,
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 80px rgba(255,107,107,0.3)',
        }}>08:42</div>
        <div style={{ marginTop: 20, fontSize: 36, fontWeight: 500, letterSpacing: '-0.01em' }}>Palavra</div>
        <div style={{ marginTop: 10, fontSize: 18, color: 'rgba(240,250,250,0.5)' }}>
          <Serif style={{ color: 'var(--luxo-gold)' }}>Pastora Ana</Serif>
        </div>
      </div>

      {/* progress bar full width */}
      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 180 }}>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(176,240,240,0.08)', overflow: 'hidden' }}>
          <div style={{
            width: '79%', height: '100%',
            background: 'linear-gradient(90deg, #2E6A7A, #8FD8DC 60%, #ff6b6b)',
          }} />
        </div>
      </div>

      {/* message overlay, bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 60,
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          padding: '18px 40px',
          borderRadius: 16,
          background: 'rgba(255,107,107,0.18)',
          border: '1px solid rgba(255,107,107,0.4)',
          boxShadow: '0 0 40px rgba(255,107,107,0.2)',
          fontSize: 28, fontWeight: 500, color: '#ffcaca',
          letterSpacing: '-0.01em',
        }}>
          Últimos 5 minutos
        </div>
      </div>
    </div>
  );
}

window.TimerViewer = TimerViewer;
