// variation-c-conversational.jsx — Agent as protagonist. Chat-shaped interface.

function VariationC({ fontScale = 1 }) {
  return (
    <div style={{
      width: 1440, height: 900,
      background: 'var(--bg-0)',
      color: 'var(--fg-1)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* atmosphere */}
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(900px 500px at 20% 20%, rgba(176,240,240,0.09), transparent 60%),' +
          'radial-gradient(700px 600px at 90% 90%, rgba(45,27,105,0.25), transparent 60%),' +
          'var(--bg-0)',
      }} />
      <div className="atmo-noise" />

      {/* sidebar — conversation history */}
      <Sidebar />

      {/* main area */}
      <div style={{
        position: 'absolute', left: 280, right: 0, top: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        <ChatHeader />
        <ChatStream fontScale={fontScale} />
        <ChatComposer />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 280,
      background: 'rgba(0,16,16,0.7)',
      borderRight: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column',
      zIndex: 2,
    }}>
      {/* logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px rgba(176,240,240,0.3)',
          color: 'var(--luxo-void)', fontWeight: 800, fontSize: 14,
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        }}>R</div>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Rhema <Serif style={{ color: 'var(--luxo-gold)' }}>AI</Serif></div>
          <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 3 }}>palavra ao vivo</div>
        </div>
      </div>

      {/* new session button */}
      <div style={{ padding: 16 }}>
        <button style={{
          width: '100%', height: 44, borderRadius: 9999,
          background: 'var(--luxo-glow)',
          color: 'var(--luxo-void)', fontWeight: 600, fontSize: 13,
          border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 0 24px rgba(176,240,240,0.35)',
        }}>
          <Ico.mic /> Nova captura
        </button>
      </div>

      {/* session list */}
      <div style={{ padding: '4px 12px 8px' }}>
        <div style={{ padding: '8px 8px 6px', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Em andamento</div>
        <SidebarItem active live title='"O Secreto"' subtitle="47:12 · 3 812 palavras" />
      </div>

      <div className="thin-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 12px' }}>
        <div style={{ padding: '8px 8px 6px', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Esta semana</div>
        {SAMPLE_HISTORY.slice(0, 3).map((h, i) => (
          <SidebarItem key={i} title={h.title.replace('Culto de quarta · ', '').replace('Domingo · ', '')} subtitle={`${h.date} · ${h.duration}`} status={h.status} />
        ))}
        <div style={{ padding: '14px 8px 6px', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Antes</div>
        {SAMPLE_HISTORY.slice(3).map((h, i) => (
          <SidebarItem key={i} title={h.title.replace('Culto de quarta · ', '').replace('Domingo · ', '')} subtitle={`${h.date} · ${h.duration}`} status={h.status} />
        ))}
      </div>

      {/* user */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--luxo-teal-mid), var(--luxo-petroleo))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: 'var(--luxo-void)',
        }}>GV</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500 }}>Gustavo</div>
          <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>Operador</div>
        </div>
        <IconBtn title="Ajustes" style={{ width: 30, height: 30 }}><Ico.settings /></IconBtn>
      </div>
    </div>
  );
}

function SidebarItem({ title, subtitle, active, live, status }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', textAlign: 'left',
        padding: '10px 10px',
        borderRadius: 10,
        background: active ? 'rgba(176,240,240,0.06)' : (hover ? 'rgba(176,240,240,0.04)' : 'transparent'),
        border: active ? '1px solid rgba(176,240,240,0.22)' : '1px solid transparent',
        color: 'var(--fg-1)', cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        marginBottom: 2,
        transition: 'all 200ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
        {live && <Pulse size={5} />}
        <span style={{
          fontSize: 12, fontWeight: 500,
          color: active ? 'var(--luxo-glow)' : 'var(--fg-1)',
          letterSpacing: '-0.005em',
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</span>
        {status === 'posted' && <Ico.check />}
      </div>
      <div style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', paddingLeft: live ? 13 : 0 }}>{subtitle}</div>
    </button>
  );
}

function ChatHeader() {
  return (
    <div style={{
      padding: '18px 28px',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(0,16,16,0.4)',
      backdropFilter: 'blur(12px)',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Serif style={{ color: 'var(--luxo-gold)', fontSize: 18 }}>"O Secreto"</Serif>
          <Badge variant="live">ao vivo</Badge>
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>Culto de quarta · Pastora Ana · início 19:00</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <MetaStat label="Duração" value="00:47:12" />
        <div style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
        <MetaStat label="Palavras" value="3 812" />
        <div style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
        <MetaStat label="Latência" value="1.2s" tone="ok" />
        <div style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
        <button style={{
          height: 36, padding: '0 14px', borderRadius: 9999,
          background: 'rgba(239,107,107,0.12)',
          border: '1px solid rgba(239,107,107,0.35)',
          color: '#ff6b6b', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)',
        }}>
          <Ico.stop /> Encerrar
        </button>
      </div>
    </div>
  );
}

function MetaStat({ label, value, tone }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{
        fontSize: 13, fontFamily: 'var(--font-mono)',
        color: tone === 'ok' ? 'var(--luxo-glow)' : 'var(--fg-1)',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</span>
    </div>
  );
}

function ChatStream({ fontScale = 1 }) {
  return (
    <div className="thin-scroll" style={{
      flex: 1, minHeight: 0, overflowY: 'auto',
      padding: '32px 28px 20px',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* AI intro */}
        <AgentMessage>
          <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--fg-2)' }}>
            Captura iniciada às <span style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-mono)' }}>19:00</span> — mesa de som, canal 3.
            Estou escutando. Quando você encerrar, gero 2 legendas com direcionamentos diferentes.
          </div>
        </AgentMessage>

        {/* System event: transcription started */}
        <SystemEvent icon="mic" text="Transcrição ao vivo · pt-BR · Google STT" time="19:00:08" />

        {/* Transcript bubble */}
        <TranscriptBubble fontScale={fontScale} />

        {/* AI detecting themes mid-stream */}
        <AgentMessage inline>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            Temas que estão se formando:{' '}
            <span style={{
              display: 'inline-flex', gap: 6, marginLeft: 4, verticalAlign: 'middle',
            }}>
              {['secreto', 'intimidade', 'recompensa'].map(w => (
                <span key={w} style={{
                  padding: '2px 10px', borderRadius: 9999,
                  background: 'rgba(143,216,220,0.1)',
                  border: '1px solid rgba(143,216,220,0.3)',
                  color: 'var(--luxo-gold)',
                  fontSize: 11,
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                }}>{w}</span>
              ))}
            </span>
          </div>
        </AgentMessage>

      </div>
    </div>
  );
}

function AgentMessage({ children, inline }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginTop: 2,
        background: 'radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.2))',
        boxShadow: '0 0 14px rgba(176,240,240,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, color: 'var(--luxo-void)',
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
      }}>L</div>
      <div style={{ flex: 1, paddingTop: inline ? 8 : 4 }}>
        {!inline && (
          <div style={{
            fontSize: 11, color: 'var(--fg-3)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: 8,
          }}>Curador · Claude Sonnet 4.6</div>
        )}
        {children}
      </div>
    </div>
  );
}

function SystemEvent({ text, time }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 14px',
      borderRadius: 9999,
      background: 'rgba(176,240,240,0.03)',
      border: '1px solid var(--border-subtle)',
      alignSelf: 'flex-start',
      fontSize: 11, color: 'var(--fg-3)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.05em',
    }}>
      <Ico.mic />
      <span>{text}</span>
      <Dot size={3} color="var(--fg-4)" />
      <span>{time}</span>
    </div>
  );
}

function TranscriptBubble({ fontScale = 1 }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginTop: 2,
        background: 'rgba(176,240,240,0.05)',
        border: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--fg-2)',
      }}>
        <Ico.wave />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{
            fontSize: 11, color: 'var(--fg-3)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>Transcrição · Pastora Ana</span>
          <Pulse size={5} />
          <span style={{ fontSize: 10, color: 'var(--luxo-glow)', fontFamily: 'var(--font-mono)' }}>fluxo aberto</span>
        </div>

        <div style={{
          padding: '20px 24px',
          borderRadius: 18,
          background: 'rgba(4,32,40,0.5)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
        }}>
          {/* live scan bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, var(--luxo-glow), transparent)',
            animation: 'rh-scan 3s linear infinite',
            opacity: 0.5,
          }} />

          {SAMPLE_TRANSCRIPT.slice(-4).map((line, i, arr) => (
            <div key={i} style={{
              marginBottom: 12,
              opacity: i === arr.length - 1 ? 1 : 0.55,
              display: 'flex', gap: 14,
            }}>
              <span style={{
                flexShrink: 0, width: 44,
                fontFamily: 'var(--font-mono)', fontSize: 10,
                color: 'var(--fg-4)',
                paddingTop: 4,
              }}>{line.t.slice(-5)}</span>
              <div style={{
                fontSize: 16 * fontScale, lineHeight: 1.55,
                color: i === arr.length - 1 ? 'var(--fg-1)' : 'var(--fg-2)',
                letterSpacing: '-0.005em',
                flex: 1,
              }}>{line.text}</div>
            </div>
          ))}

          {/* live line */}
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{
              flexShrink: 0, width: 44,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--luxo-glow)',
              paddingTop: 4,
            }}>agora</span>
            <div style={{
              fontSize: 16 * fontScale, lineHeight: 1.55,
              color: 'var(--fg-1)',
              letterSpacing: '-0.005em',
              flex: 1,
            }}>
              {LIVE_PARAGRAPH}
              {LIVE_STREAMING_WORDS.map((w, i) => (
                <span key={i} style={{
                  display: 'inline-block', marginLeft: 6,
                  animation: `rh-word-in 600ms ${i * 300}ms var(--ease-out-expo) both`,
                  color: 'var(--luxo-glow)',
                }}>{w}</span>
              ))}
              <span style={{
                display: 'inline-block', marginLeft: 4,
                width: 2, height: `${16 * fontScale}px`,
                verticalAlign: 'middle',
                background: 'var(--luxo-glow)',
                boxShadow: '0 0 8px var(--luxo-glow)',
                animation: 'rh-caret 1s infinite',
              }} />
            </div>
          </div>
        </div>

        {/* live stats row */}
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 14,
          fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)',
        }}>
          <Waveform bars={18} color="var(--luxo-glow)" height={18} />
          <Dot size={3} color="var(--fg-4)" />
          <span>confiança 94%</span>
          <Dot size={3} color="var(--fg-4)" />
          <span>3 812 palavras</span>
          <Dot size={3} color="var(--fg-4)" />
          <span>+12 palavras/min</span>
        </div>
      </div>
    </div>
  );
}

function ChatComposer() {
  return (
    <div style={{
      padding: '16px 28px 24px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(0,16,16,0.6)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {[
            'Encerrar e gerar legendas',
            'Mais emotiva',
            'Mais reflexiva',
            'Acrescentar versículo',
            'Resumir pontos principais',
          ].map((c, i) => (
            <button key={c} style={{
              height: 30, padding: '0 14px',
              borderRadius: 9999,
              background: i === 0 ? 'rgba(176,240,240,0.08)' : 'rgba(176,240,240,0.04)',
              border: i === 0 ? '1px solid rgba(176,240,240,0.3)' : '1px solid var(--border-subtle)',
              color: i === 0 ? 'var(--luxo-glow)' : 'var(--fg-2)',
              fontSize: 11, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}>{c}</button>
          ))}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          height: 56, padding: '0 8px 0 22px',
          borderRadius: 9999,
          background: 'rgba(4,32,40,0.75)',
          border: '1px solid var(--border-default)',
          backdropFilter: 'blur(24px) saturate(1.2)',
          boxShadow: 'inset 0 1px 0 rgba(176,240,240,0.06), 0 20px 40px rgba(0,0,0,0.3)',
        }}>
          <Pulse size={8} />
          <input
            readOnly
            placeholder="Peça algo ao curador — ou apenas continue o culto…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--fg-1)', fontSize: 14, fontFamily: 'var(--font-sans)',
            }}
          />
          <span style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>⏎</span>
          <button style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--bg-2)',
            color: 'var(--fg-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            fontSize: 16, fontWeight: 700,
          }}>↑</button>
        </div>
      </div>
    </div>
  );
}

window.VariationC = VariationC;
