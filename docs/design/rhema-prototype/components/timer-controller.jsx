// timer-controller.jsx — Controller interface (laptop/mesa de som)

function TimerController() {
  return (
    <div style={{
      width: 1440, height: 900,
      background: 'var(--bg-0)',
      color: 'var(--fg-1)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div className="atmo-base" />

      {/* header */}
      <div style={{
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0,16,16,0.6)',
        backdropFilter: 'blur(12px)',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--luxo-void)', fontWeight: 800, fontSize: 13,
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            }}>R</div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Rhema <Serif style={{ color: 'var(--luxo-gold)' }}>AI</Serif></span>
          </div>
          <span style={{ color: 'var(--fg-4)' }}>/</span>
          <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Timer</span>
          <span style={{ color: 'var(--fg-4)' }}>/</span>
          <span style={{ fontSize: 13, color: 'var(--fg-1)', fontWeight: 500 }}>Culto Dom · 26/abr</span>
          <Badge variant="ghost" style={{ fontFamily: 'var(--font-mono)', height: 22, fontSize: 10 }}>Controller</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pulse size={6} />
            <span style={{ fontSize: 12, color: 'var(--luxo-glow)', fontFamily: 'var(--font-mono)' }}>WS conectado</span>
          </div>
          <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>4 dispositivos</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['C','V','O','M'].map(l => (
              <div key={l} style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'rgba(176,240,240,0.1)',
                border: '1px solid rgba(176,240,240,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: 'var(--luxo-glow)',
                fontFamily: 'var(--font-mono)',
              }}>{l}</div>
            ))}
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid', gridTemplateColumns: '1fr 360px',
        gap: 0,
      }}>
        {/* left — active banner + timers list */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 32px', gap: 20, minHeight: 0 }}>
          <ActiveBanner />
          <TimersList />
        </div>

        {/* right — messages + display controls */}
        <div style={{
          padding: '24px 28px 24px 0',
          display: 'flex', flexDirection: 'column', gap: 16,
          minHeight: 0,
        }}>
          <DisplayControls />
          <MessagesPanel />
        </div>
      </div>
    </div>
  );
}

function ActiveBanner() {
  return (
    <div style={{
      position: 'relative',
      padding: 24,
      borderRadius: 20,
      background: 'radial-gradient(500px 200px at 0% 0%, rgba(176,240,240,0.12), transparent 60%), rgba(4,32,40,0.7)',
      border: '1px solid rgba(176,240,240,0.3)',
      boxShadow: '0 0 40px rgba(176,240,240,0.12), inset 0 1px 0 rgba(176,240,240,0.06)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, var(--luxo-glow), transparent 70%)',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <Badge variant="live">ATIVO</Badge>
        <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>3 de 6 · Pastora Ana</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Palavra</div>
          <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>countdown · duração 00:42:00</div>
        </div>
        <div style={{
          fontSize: 96, fontWeight: 500,
          fontFamily: 'var(--font-mono)',
          color: 'var(--luxo-glow)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 40px rgba(176,240,240,0.35)',
        }}>00:08:42</div>
      </div>

      {/* progress */}
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            width: '79%', height: '100%',
            background: 'linear-gradient(90deg, var(--luxo-glow) 0%, var(--luxo-green) 60%, var(--luxo-gold) 100%)',
            boxShadow: '0 0 12px rgba(176,240,240,0.4)',
          }} />
        </div>
        <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>79% · 00:33:18 decorridos</span>
      </div>

      {/* transport */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <TransportBtn variant="primary"><Ico.pause /> Pausar</TransportBtn>
        <TransportBtn><Ico.stop /> Parar</TransportBtn>
        <TransportBtn>Reset</TransportBtn>
        <div style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 6px' }} />
        <TransportBtn>−1min</TransportBtn>
        <TransportBtn>+1min</TransportBtn>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>auto-advance · próximo: Ministração</span>
      </div>
    </div>
  );
}

function TransportBtn({ children, variant }) {
  const primary = variant === 'primary';
  return (
    <button style={{
      height: 38, padding: '0 16px', borderRadius: 9999,
      background: primary ? 'var(--luxo-glow)' : 'rgba(176,240,240,0.05)',
      color: primary ? 'var(--luxo-void)' : 'var(--fg-1)',
      border: primary ? 'none' : '1px solid var(--border-default)',
      fontSize: 12, fontWeight: 600, cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      boxShadow: primary ? '0 0 20px rgba(176,240,240,0.3)' : 'none',
    }}>{children}</button>
  );
}

function TimersList() {
  return (
    <div style={{
      flex: 1, minHeight: 0,
      borderRadius: 20,
      background: 'rgba(4,32,40,0.5)',
      border: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Eyebrow>Timers · 6 itens</Eyebrow>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={miniBtn}>Importar CSV</button>
          <button style={{ ...miniBtn, color: 'var(--luxo-glow)', borderColor: 'rgba(176,240,240,0.3)' }}>+ Adicionar</button>
        </div>
      </div>
      <div className="thin-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {TIMERS.map((t, i) => <TimerRow key={t.id} t={t} first={i === 0} />)}
      </div>
      <div style={{
        padding: '12px 20px', borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)',
      }}>
        <span>Total do evento: 01:30:00</span>
        <span>decorrido: 00:25:00 · restante: 01:05:00</span>
      </div>
    </div>
  );
}

const miniBtn = {
  height: 28, padding: '0 12px', borderRadius: 9999,
  background: 'transparent',
  border: '1px solid var(--border-default)',
  color: 'var(--fg-2)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
};

function TimerRow({ t, first }) {
  const [hover, setHover] = React.useState(false);
  const isActive = t.status === 'active';
  const isDone = t.status === 'done';
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 32px 1fr 130px 110px 80px auto',
        alignItems: 'center', gap: 12,
        padding: '14px 20px',
        borderTop: first ? 'none' : '1px solid var(--border-subtle)',
        background: isActive ? 'rgba(176,240,240,0.04)' : (hover ? 'rgba(176,240,240,0.03)' : 'transparent'),
        opacity: isDone ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 2,
        color: 'var(--fg-3)', fontSize: 10,
      }}>
        <span style={{ cursor: 'pointer' }}>▲</span>
        <span style={{ cursor: 'pointer' }}>▼</span>
      </div>
      <div style={{
        width: 4, height: 32, borderRadius: 2,
        background: t.color,
        boxShadow: isActive ? `0 0 12px ${t.color}` : 'none',
      }} />
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 500, marginBottom: 2,
          letterSpacing: '-0.005em',
        }}>
          {isActive && <Pulse size={5} />}
          {isDone && <Ico.check />}
          {t.title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{t.presenter}</div>
      </div>
      <div style={{
        fontSize: 11, color: 'var(--fg-3)',
        textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>{t.type}</div>
      <div style={{
        fontSize: 15, fontFamily: 'var(--font-mono)',
        color: isActive ? 'var(--luxo-glow)' : 'var(--fg-1)',
        fontVariantNumeric: 'tabular-nums',
      }}>{t.remaining || t.dur}</div>
      <div style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {isActive ? 'rodando' : isDone ? 'ok' : 'pendente'}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {!isActive && !isDone && (
          <button style={{
            height: 28, padding: '0 10px', borderRadius: 9999,
            background: 'rgba(176,240,240,0.08)',
            border: '1px solid rgba(176,240,240,0.3)',
            color: 'var(--luxo-glow)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <Ico.play /> Ativar
          </button>
        )}
      </div>
    </div>
  );
}

function DisplayControls() {
  const btns = [
    { l: 'Blackout', c: 'var(--fg-2)' },
    { l: 'Flash', c: 'var(--luxo-glow)' },
    { l: 'Focus', c: 'var(--luxo-gold)' },
  ];
  return (
    <div style={{
      padding: 16,
      borderRadius: 16,
      background: 'rgba(4,32,40,0.5)',
      border: '1px solid var(--border-subtle)',
    }}>
      <Eyebrow>Palco · display</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {btns.map(b => (
          <button key={b.l} style={{
            height: 52, borderRadius: 12,
            background: 'rgba(176,240,240,0.04)',
            border: '1px solid var(--border-default)',
            color: b.c, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.04em',
          }}>{b.l}</button>
        ))}
      </div>
    </div>
  );
}

function MessagesPanel() {
  return (
    <div style={{
      flex: 1, minHeight: 0,
      padding: 16,
      borderRadius: 16,
      background: 'rgba(4,32,40,0.5)',
      border: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Eyebrow>Mensagens ao palco</Eyebrow>
        <span style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>⌘⏎ envia</span>
      </div>
      <textarea
        readOnly
        defaultValue="Últimos 5 minutos"
        style={{
          minHeight: 84,
          padding: 12,
          borderRadius: 12,
          background: 'rgba(0,16,16,0.6)',
          border: '1px solid var(--border-default)',
          color: 'var(--fg-1)', fontSize: 14,
          fontFamily: 'var(--font-sans)',
          resize: 'none', outline: 'none',
          letterSpacing: '-0.005em',
        }}
      />
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        {[
          { l: 'Branco', c: '#F0FAFA' },
          { l: 'Verde', c: '#2E6A7A' },
          { l: 'Vermelho', c: '#ff6b6b', active: true },
        ].map(c => (
          <button key={c.l} style={{
            flex: 1, height: 36, borderRadius: 10,
            background: c.active ? `${c.c}22` : 'rgba(176,240,240,0.04)',
            border: c.active ? `1px solid ${c.c}55` : '1px solid var(--border-subtle)',
            color: c.c, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'var(--font-sans)',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.c }} />
            {c.l}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button style={{
          flex: 1, height: 40, borderRadius: 9999,
          background: 'var(--luxo-glow)', color: 'var(--luxo-void)',
          border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          boxShadow: '0 0 20px rgba(176,240,240,0.3)',
        }}>Enviar ao palco</button>
        <button style={{
          height: 40, padding: '0 14px', borderRadius: 9999,
          background: 'transparent',
          border: '1px solid var(--border-default)',
          color: 'var(--fg-2)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}>Flash</button>
      </div>

      <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Histórico da sessão</div>
        <div className="thin-scroll" style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MESSAGE_HISTORY.map((m, i) => (
            <div key={i} style={{
              padding: '8px 10px', borderRadius: 8,
              background: 'rgba(176,240,240,0.03)',
              borderLeft: `2px solid ${m.color === 'red' ? '#ff6b6b' : m.color === 'green' ? '#2E6A7A' : '#F0FAFA'}`,
              fontSize: 12, color: 'var(--fg-2)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{m.t}</span>
              <span style={{ flex: 1 }}>{m.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.TimerController = TimerController;
