// timer-operator-moderator-agenda.jsx — 3 remaining interfaces in one file

// Operator — tablet with big touch buttons
function TimerOperator() {
  return (
    <div style={{
      width: 1024, height: 768,
      background: 'var(--bg-0)',
      color: 'var(--fg-1)',
      fontFamily: 'var(--font-sans)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div className="atmo-base" />
      <div style={{
        padding: '18px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Rhema <Serif style={{ color: 'var(--luxo-gold)' }}>AI</Serif></span>
          <Badge variant="ghost" style={{ fontFamily: 'var(--font-mono)' }}>Operator</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Pulse size={6} /><span style={{ fontSize: 12, color: 'var(--luxo-glow)' }}>sincronizado</span>
        </div>
      </div>

      <div style={{ padding: 28, position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* active timer big */}
        <div style={{
          padding: 28, borderRadius: 24,
          background: 'radial-gradient(400px 200px at 0% 0%, rgba(176,240,240,0.12), transparent 60%), rgba(4,32,40,0.7)',
          border: '1px solid rgba(176,240,240,0.3)',
          boxShadow: '0 0 30px rgba(176,240,240,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Badge variant="live">ATIVO</Badge>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>3 de 6</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 600 }}>Palavra</div>
              <div style={{ fontSize: 14, color: 'var(--fg-3)' }}>Pastora Ana · countdown</div>
            </div>
            <div style={{
              fontSize: 108, fontWeight: 500,
              fontFamily: 'var(--font-mono)', color: 'var(--luxo-glow)',
              letterSpacing: '-0.03em', lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              textShadow: '0 0 40px rgba(176,240,240,0.35)',
            }}>08:42</div>
          </div>
          {/* big touch buttons */}
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {[
              { l: 'Pausar', c: 'var(--luxo-glow)', solid: true },
              { l: 'Parar', c: 'var(--fg-1)' },
              { l: 'Reset', c: 'var(--fg-2)' },
              { l: '−1 min', c: 'var(--fg-1)' },
              { l: '+1 min', c: 'var(--fg-1)' },
            ].map(b => (
              <button key={b.l} style={{
                height: 64, borderRadius: 14,
                background: b.solid ? b.c : 'rgba(176,240,240,0.05)',
                color: b.solid ? 'var(--luxo-void)' : b.c,
                border: b.solid ? 'none' : '1px solid var(--border-default)',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                boxShadow: b.solid ? '0 0 20px rgba(176,240,240,0.3)' : 'none',
              }}>{b.l}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, flex: 1, minHeight: 0 }}>
          {/* timer list */}
          <div style={{ borderRadius: 16, background: 'rgba(4,32,40,0.5)', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <Eyebrow>Próximos</Eyebrow>
            </div>
            <div className="thin-scroll" style={{ flex: 1, overflowY: 'auto' }}>
              {TIMERS.filter(t => t.status === 'pending').map((t, i) => (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                }}>
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: t.color }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{t.presenter} · {t.dur}</div>
                  </div>
                  <button style={{
                    height: 40, padding: '0 16px', borderRadius: 9999,
                    background: 'rgba(176,240,240,0.08)',
                    border: '1px solid rgba(176,240,240,0.3)',
                    color: 'var(--luxo-glow)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}><Ico.play /> Ativar</button>
                </div>
              ))}
            </div>
          </div>

          {/* quick message */}
          <div style={{ borderRadius: 16, background: 'rgba(4,32,40,0.5)', border: '1px solid var(--border-subtle)', padding: 16, display: 'flex', flexDirection: 'column' }}>
            <Eyebrow>Recado rápido</Eyebrow>
            <textarea readOnly placeholder="Escreva ao palco..." style={{
              marginTop: 10, padding: 12, minHeight: 72, borderRadius: 12,
              background: 'rgba(0,16,16,0.6)', border: '1px solid var(--border-default)',
              color: 'var(--fg-1)', fontSize: 13, fontFamily: 'var(--font-sans)',
              resize: 'none', outline: 'none',
            }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 10 }}>
              {[{l:'Ok',c:'#F0FAFA'},{l:'Go',c:'#2E6A7A'},{l:'!',c:'#ff6b6b'}].map(c => (
                <button key={c.l} style={{
                  height: 44, borderRadius: 10,
                  background: 'rgba(176,240,240,0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: c.c, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.c }} />
                  {c.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Moderator — read-only timer + message sender
function TimerModerator() {
  return (
    <div style={{
      width: 960, height: 720,
      background: 'var(--bg-0)', color: 'var(--fg-1)', fontFamily: 'var(--font-sans)',
      position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <div className="atmo-base" />
      <div style={{
        padding: '16px 28px', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Rhema <Serif style={{ color: 'var(--luxo-gold)' }}>AI</Serif></span>
          <Badge variant="ghost" style={{ fontFamily: 'var(--font-mono)' }}>Moderator</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Pulse size={6} /><span style={{ fontSize: 12, color: 'var(--luxo-glow)' }}>sala viva</span>
        </div>
      </div>

      <div style={{ padding: 28, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, position: 'relative' }}>
        {/* read-only timer */}
        <div style={{
          padding: 24, borderRadius: 20,
          background: 'rgba(4,32,40,0.55)', border: '1px solid var(--border-subtle)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <Eyebrow>No palco agora</Eyebrow>
            <div style={{ marginTop: 10, fontSize: 22, fontWeight: 600 }}>Palavra</div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>Pastora Ana</div>
          </div>
          <div style={{
            fontSize: 120, fontWeight: 500,
            fontFamily: 'var(--font-mono)', color: 'var(--luxo-glow)',
            letterSpacing: '-0.03em', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'center', margin: '20px 0',
            textShadow: '0 0 40px rgba(176,240,240,0.3)',
          }}>08:42</div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', textAlign: 'center', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            somente leitura · 79% decorrido
          </div>
        </div>

        {/* send message */}
        <div style={{
          padding: 24, borderRadius: 20,
          background: 'rgba(4,32,40,0.55)', border: '1px solid var(--border-subtle)',
          display: 'flex', flexDirection: 'column',
        }}>
          <Eyebrow>Enviar ao palco</Eyebrow>
          <textarea readOnly defaultValue="Últimos 5 minutos" style={{
            marginTop: 12, padding: 14, minHeight: 110, borderRadius: 12,
            background: 'rgba(0,16,16,0.6)', border: '1px solid var(--border-default)',
            color: 'var(--fg-1)', fontSize: 15, fontFamily: 'var(--font-sans)',
            resize: 'none', outline: 'none',
          }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {[{l:'Branco',c:'#F0FAFA'},{l:'Verde',c:'#2E6A7A'},{l:'Vermelho',c:'#ff6b6b',active:true}].map(c => (
              <button key={c.l} style={{
                flex: 1, height: 42, borderRadius: 10,
                background: c.active ? `${c.c}22` : 'rgba(176,240,240,0.04)',
                border: c.active ? `1px solid ${c.c}55` : '1px solid var(--border-subtle)',
                color: c.c, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.c }} />
                {c.l}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button style={{
              flex: 1, height: 44, borderRadius: 9999,
              background: 'var(--luxo-glow)', color: 'var(--luxo-void)',
              border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 0 20px rgba(176,240,240,0.3)',
            }}>Enviar</button>
            <button style={{
              height: 44, padding: '0 16px', borderRadius: 9999,
              background: 'transparent', border: '1px solid var(--border-default)',
              color: 'var(--fg-2)', fontSize: 12, cursor: 'pointer',
            }}>Limpar palco</button>
          </div>
        </div>

        {/* history full width */}
        <div style={{ gridColumn: '1 / -1', padding: 20, borderRadius: 16, background: 'rgba(4,32,40,0.5)', border: '1px solid var(--border-subtle)' }}>
          <Eyebrow>Histórico da sessão · 3 envios</Eyebrow>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MESSAGE_HISTORY.map((m, i) => (
              <div key={i} style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(176,240,240,0.03)',
                borderLeft: `2px solid ${m.color === 'red' ? '#ff6b6b' : m.color === 'green' ? '#2E6A7A' : '#F0FAFA'}`,
                fontSize: 13, color: 'var(--fg-2)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{m.t}</span>
                <span style={{ flex: 1 }}>{m.text}</span>
                <span style={{ fontSize: 10, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>entregue</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Agenda — read-only list
function TimerAgenda() {
  return (
    <div style={{
      width: 720, height: 900,
      background: 'var(--bg-0)', color: 'var(--fg-1)', fontFamily: 'var(--font-sans)',
      position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <div className="atmo-base" />
      <div style={{
        padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 2,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Rhema <Serif style={{ color: 'var(--luxo-gold)' }}>AI</Serif></span>
            <Badge variant="ghost" style={{ fontFamily: 'var(--font-mono)' }}>Agenda</Badge>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>Culto Dom · 26/abr</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Total</div>
          <div style={{ fontSize: 20, fontFamily: 'var(--font-mono)', color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>01:30:00</div>
        </div>
      </div>

      <div className="thin-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {TIMERS.map((t, i) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 0',
              borderBottom: i === TIMERS.length - 1 ? 'none' : '1px solid var(--border-subtle)',
              opacity: t.status === 'done' ? 0.45 : 1,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: t.status === 'active' ? 'rgba(176,240,240,0.12)' : t.status === 'done' ? 'rgba(176,240,240,0.04)' : 'rgba(176,240,240,0.04)',
                border: t.status === 'active' ? '1px solid rgba(176,240,240,0.4)' : '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: t.status === 'active' ? 'var(--luxo-glow)' : t.status === 'done' ? 'var(--luxo-glow)' : 'var(--fg-3)',
                fontSize: 11, fontWeight: 700,
                boxShadow: t.status === 'active' ? '0 0 10px rgba(176,240,240,0.3)' : 'none',
              }}>
                {t.status === 'active' ? <Ico.play /> : t.status === 'done' ? <Ico.check /> : t.order}
              </div>
              <div style={{ width: 3, height: 36, borderRadius: 2, background: t.color, boxShadow: t.status === 'active' ? `0 0 8px ${t.color}` : 'none' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, marginBottom: 3 }}>
                  {t.title}
                  {t.status === 'active' && <Badge variant="live">agora</Badge>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{t.presenter}</div>
              </div>
              <div style={{
                fontSize: 16, fontFamily: 'var(--font-mono)',
                color: t.status === 'active' ? 'var(--luxo-glow)' : 'var(--fg-2)',
                fontVariantNumeric: 'tabular-nums',
              }}>{t.remaining || t.dur}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '14px 28px', borderTop: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)',
      }}>
        <span>decorrido 00:25:00</span>
        <span>restante 01:05:00</span>
      </div>
    </div>
  );
}

Object.assign(window, { TimerOperator, TimerModerator, TimerAgenda });
