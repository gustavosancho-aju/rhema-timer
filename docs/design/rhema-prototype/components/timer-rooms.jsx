// timer-rooms.jsx — Interface 0: tela inicial de gerenciamento de salas

function TimerRooms() {
  return (
    <div style={{
      width: 1440, height: 900,
      background: 'var(--bg-0)',
      color: 'var(--fg-1)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="atmo-base" />
      <div className="atmo-noise" />

      {/* top bar */}
      <div style={{
        height: 72, padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative', zIndex: 2,
        background: 'rgba(0,16,16,0.6)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px rgba(176,240,240,0.35)',
              color: 'var(--luxo-void)', fontWeight: 800, fontSize: 15,
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            }}>R</div>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Rhema <Serif style={{ color: 'var(--luxo-gold)' }}>AI</Serif></span>
          </div>
          <div style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
          <nav style={{ display: 'flex', gap: 4 }}>
            {['Transcrição', 'Timer', 'Histórico', 'Ajustes'].map((item, i) => (
              <button key={item} style={{
                height: 34, padding: '0 14px',
                borderRadius: 9999,
                background: i === 1 ? 'rgba(176,240,240,0.08)' : 'transparent',
                color: i === 1 ? 'var(--luxo-glow)' : 'var(--fg-2)',
                border: i === 1 ? '1px solid rgba(176,240,240,0.22)' : '1px solid transparent',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}>{item}</button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--luxo-gold), #8d6d3a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'var(--luxo-void)',
          }}>GV</div>
        </div>
      </div>

      {/* content */}
      <div style={{ padding: '40px 60px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <Eyebrow>Timer · salas</Eyebrow>
            <h1 style={{
              fontSize: 44, fontWeight: 700, margin: '10px 0 6px',
              letterSpacing: '-0.02em',
            }}>
              Palco sob <Serif style={{ color: 'var(--luxo-gold)', fontWeight: 400 }}>controle</Serif>.
            </h1>
            <div style={{ fontSize: 15, color: 'var(--fg-3)', maxWidth: 560 }}>
              Crie uma sala e compartilhe 5 interfaces sincronizadas em tempo real — palco, operador, moderador e agenda.
            </div>
          </div>
          <button style={{
            height: 48, padding: '0 24px', borderRadius: 9999,
            background: 'var(--luxo-glow)',
            color: 'var(--luxo-void)', fontWeight: 600, fontSize: 14,
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            boxShadow: '0 0 24px rgba(176,240,240,0.35)',
          }}>
            + Nova sala
          </button>
        </div>

        {/* stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          marginBottom: 28,
        }}>
          <RoomStat label="Salas ativas" value="1" tone="live" />
          <RoomStat label="Total de salas" value="4" />
          <RoomStat label="Conexões agora" value="4" mono />
          <RoomStat label="Timers ativos" value="1" tone="ok" />
        </div>

        {/* rooms table */}
        <div style={{
          borderRadius: 20,
          background: 'rgba(4,32,40,0.55)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 0.8fr 2fr',
            padding: '14px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--fg-3)',
          }}>
            <span>Sala</span>
            <span>Status</span>
            <span>Conexões</span>
            <span>Timers</span>
            <span>Links (5 interfaces)</span>
          </div>
          {TIMER_ROOMS.map((r, i) => <RoomRow key={r.id} room={r} first={i === 0} />)}
        </div>
      </div>
    </div>
  );
}

function RoomStat({ label, value, tone, mono }) {
  const color = tone === 'live' ? 'var(--luxo-glow)' : tone === 'ok' ? 'var(--luxo-glow)' : 'var(--fg-1)';
  return (
    <div style={{
      padding: 18,
      borderRadius: 14,
      background: 'rgba(4,32,40,0.5)',
      border: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--fg-3)', marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {tone === 'live' && <Pulse size={7} />}
        <span style={{
          fontSize: 28, fontWeight: 600,
          color,
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}>{value}</span>
      </div>
    </div>
  );
}

function RoomRow({ room, first }) {
  const [hover, setHover] = React.useState(false);
  const active = room.status === 'ativa';
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 0.8fr 2fr',
        padding: '18px 24px',
        alignItems: 'center',
        borderTop: first ? 'none' : '1px solid var(--border-subtle)',
        background: hover ? 'rgba(176,240,240,0.03)' : 'transparent',
        transition: 'background 200ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {active && <Pulse size={6} />}
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.005em' }}>{room.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            id: {room.id} · {room.last}
          </div>
        </div>
      </div>

      <div>
        {active && <Badge variant="live">ao vivo</Badge>}
        {room.status === 'idle' && <Badge variant="neutral">idle</Badge>}
        {room.status === 'rascunho' && <Badge variant="gold">rascunho</Badge>}
      </div>

      <div style={{
        fontSize: 14, color: room.connections > 0 ? 'var(--fg-1)' : 'var(--fg-3)',
        fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
      }}>
        {room.connections} <span style={{ color: 'var(--fg-4)', fontSize: 11 }}>dispositivos</span>
      </div>

      <div style={{ fontSize: 14, color: 'var(--fg-2)', fontFamily: 'var(--font-mono)' }}>{room.timers}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[
          { l: 'Controller', c: 'var(--luxo-glow)' },
          { l: 'Viewer', c: 'var(--luxo-gold)' },
          { l: 'Operator', c: '#1B5670' },
          { l: 'Moderator', c: 'var(--fg-2)' },
          { l: 'Agenda', c: 'var(--fg-2)' },
        ].map(link => (
          <button key={link.l} style={{
            height: 26, padding: '0 10px', borderRadius: 9999,
            background: 'rgba(176,240,240,0.04)',
            border: '1px solid var(--border-subtle)',
            color: link.c, fontSize: 10, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            letterSpacing: '0.04em',
          }}>
            {link.l}
            <Ico.copy />
          </button>
        ))}
      </div>
    </div>
  );
}

window.TimerRooms = TimerRooms;
