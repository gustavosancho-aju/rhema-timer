// variation-b-teleprompter.jsx — Word-centric. The sermon is the protagonist.

function VariationB({ fontScale = 1 }) {
  return (
    <div style={{
      width: 1440, height: 900,
      background: 'var(--bg-0)',
      color: 'var(--fg-1)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* atmosphere — renaissance purple */}
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(800px 500px at 50% -10%, rgba(45,27,105,0.45), transparent 60%),' +
          'radial-gradient(700px 500px at 50% 120%, rgba(143,216,220,0.08), transparent 60%),' +
          'var(--bg-0)',
      }} />
      <div className="atmo-noise" />

      {/* floating glass nav, top */}
      <FloatingNav />

      {/* main stage — centered teleprompter */}
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '300px 1fr 300px',
        paddingTop: 90,
      }}>
        {/* left spine — session meta */}
        <SessionSpine />

        {/* center teleprompter */}
        <Teleprompter fontScale={fontScale} />

        {/* right spine — agent pulse + captions preview */}
        <AgentSpine />
      </div>

      {/* bottom transport — glass */}
      <BottomTransport />
    </div>
  );
}

function FloatingNav() {
  return (
    <div style={{
      position: 'absolute', top: 24, left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 4,
      height: 44, padding: '0 6px 0 18px',
      borderRadius: 9999,
      background: 'rgba(4,32,40,0.55)',
      border: '1px solid var(--border-default)',
      backdropFilter: 'blur(24px) saturate(1.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(176,240,240,0.06)',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 14, borderRight: '1px solid var(--border-subtle)', marginRight: 8 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 6,
          background: 'radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--luxo-void)', fontWeight: 800, fontSize: 11,
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        }}>R</div>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Rhema <Serif style={{ color: 'var(--luxo-gold)' }}>AI</Serif></span>
      </div>
      {['Ao vivo', 'Histórico', 'Ajustes'].map((l, i) => (
        <button key={l} style={{
          height: 32, padding: '0 14px', borderRadius: 9999,
          background: i === 0 ? 'rgba(176,240,240,0.08)' : 'transparent',
          color: i === 0 ? 'var(--luxo-glow)' : 'var(--fg-2)',
          border: 'none',
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          {i === 0 && <Pulse size={5} />}
          {l}
        </button>
      ))}
    </div>
  );
}

function SessionSpine() {
  return (
    <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <Eyebrow style={{ color: 'var(--luxo-gold)' }}>Sessão · 23 abr</Eyebrow>
        <div style={{ marginTop: 10, fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          <Serif italic={false} style={{ color: 'var(--luxo-gold)', fontWeight: 400 }}>"O Secreto"</Serif>
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 6 }}>
          Culto de quarta · Pastora Ana
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SpineStat label="Duração" value="00:47:12" tone="primary" />
        <SpineStat label="Palavras transcritas" value="3 812" />
        <SpineStat label="Latência média" value="1.2s" tone="ok" />
        <SpineStat label="Confiança" value="94%" tone="ok" />
      </div>

      <div style={{ paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
        <Eyebrow>Temas emergindo</Eyebrow>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {['secreto', 'intimidade', 'recompensa', 'fé', 'promessa', 'secreto', 'Pai', 'encontrado'].map((w, i) => (
            <span key={i} style={{
              padding: '4px 10px',
              borderRadius: 9999,
              background: i === 0 ? 'rgba(143,216,220,0.1)' : 'rgba(176,240,240,0.04)',
              border: i === 0 ? '1px solid rgba(143,216,220,0.35)' : '1px solid var(--border-subtle)',
              fontSize: 11,
              color: i === 0 ? 'var(--luxo-gold)' : 'var(--fg-2)',
              fontFamily: i === 0 ? 'var(--font-serif)' : 'var(--font-mono)',
              fontStyle: i === 0 ? 'italic' : 'normal',
            }}>{w}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpineStat({ label, value, tone }) {
  const color = tone === 'ok' ? 'var(--luxo-glow)' : tone === 'primary' ? 'var(--fg-1)' : 'var(--fg-1)';
  return (
    <div>
      <div style={{
        fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--fg-3)', marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontSize: 22, fontWeight: 500,
        color, fontFamily: 'var(--font-mono)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
      }}>{value}</div>
    </div>
  );
}

function Teleprompter({ fontScale = 1 }) {
  const scale = fontScale;
  return (
    <div style={{
      position: 'relative',
      padding: '20px 40px 40px',
      display: 'flex', flexDirection: 'column',
      minHeight: 0,
      overflow: 'hidden',
    }}>
      {/* top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(180deg, var(--bg-0) 0%, transparent 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* timeline mark */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '8px 20px',
          borderRadius: 9999,
          background: 'rgba(4,32,40,0.6)',
          border: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(12px)',
        }}>
          <Pulse size={6} />
          <Elapsed value="00:47:12" color="var(--fg-1)" />
          <span style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            ao vivo
          </span>
        </div>
      </div>

      {/* scroll region */}
      <div className="thin-scroll" style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
      }}>
        {SAMPLE_TRANSCRIPT.map((line, i) => {
          const distance = SAMPLE_TRANSCRIPT.length - 1 - i;
          const opacity = Math.max(0.2, 1 - distance * 0.18);
          const size = i === SAMPLE_TRANSCRIPT.length - 1 ? 42 : 28;
          return (
            <div key={i} style={{
              maxWidth: 720,
              textAlign: 'center',
              marginBottom: i === SAMPLE_TRANSCRIPT.length - 1 ? 28 : 20,
              opacity,
              transition: 'opacity 500ms',
            }}>
              <div style={{
                fontSize: size * scale,
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                fontWeight: i === SAMPLE_TRANSCRIPT.length - 1 ? 500 : 400,
                color: 'var(--fg-1)',
                fontFamily: i === SAMPLE_TRANSCRIPT.length - 1 ? 'var(--font-serif)' : 'var(--font-sans)',
                fontStyle: i === SAMPLE_TRANSCRIPT.length - 1 ? 'italic' : 'normal',
                textWrap: 'pretty',
              }}>
                {i === SAMPLE_TRANSCRIPT.length - 1 ? (
                  <>
                    <span style={{ color: 'var(--luxo-gold)' }}>"</span>
                    {line.text}
                    <span style={{ color: 'var(--luxo-gold)' }}>"</span>
                  </>
                ) : line.text}
              </div>
            </div>
          );
        })}

        {/* currently streaming */}
        <div style={{
          maxWidth: 720,
          textAlign: 'center',
          marginTop: 14,
          position: 'relative',
        }}>
          <div style={{
            fontSize: 26 * scale,
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
            color: 'var(--fg-2)',
            fontWeight: 400,
          }}>
            {LIVE_PARAGRAPH}
            {LIVE_STREAMING_WORDS.map((w, i) => (
              <span key={i} style={{
                display: 'inline-block',
                marginLeft: 8,
                color: 'var(--fg-1)',
                animation: `rh-word-in 600ms ${i * 300}ms var(--ease-out-expo) both`,
              }}>{w}</span>
            ))}
            <span style={{
              display: 'inline-block', marginLeft: 4,
              width: 3, height: `${26 * scale}px`,
              verticalAlign: 'middle',
              background: 'var(--luxo-glow)',
              boxShadow: '0 0 10px var(--luxo-glow)',
              animation: 'rh-caret 1s infinite',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentSpine() {
  return (
    <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        padding: 16,
        borderRadius: 16,
        background: 'rgba(4,32,40,0.5)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.2))',
            boxShadow: '0 0 12px rgba(176,240,240,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: 'var(--luxo-void)',
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          }}>L</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Curador</div>
            <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>aguardando fim do culto</div>
          </div>
          <Badge variant="ghost" style={{ height: 20, fontSize: 10 }}>idle</Badge>
        </div>
        <div style={{
          fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.6,
          padding: 12, borderRadius: 10,
          background: 'rgba(45,27,105,0.2)',
          border: '1px solid rgba(27,86,112,0.12)',
        }}>
          Vou escutar até você encerrar. Quando parar, gero 2 legendas — uma <Serif style={{ color: 'var(--luxo-gold)' }}>emotiva</Serif> e uma <Serif style={{ color: '#1B5670' }}>reflexiva</Serif>.
        </div>
      </div>

      {/* pre-captions teaser */}
      <div>
        <Eyebrow>Preview das legendas</Eyebrow>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SAMPLE_CAPTIONS.map((c, i) => (
            <div key={i} style={{
              padding: 14,
              borderRadius: 12,
              background: 'rgba(4,32,40,0.4)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
                background: c.color,
              }} />
              <div style={{
                fontSize: 10, fontWeight: 600,
                color: c.color,
                textTransform: 'uppercase', letterSpacing: '0.18em',
                marginBottom: 6,
              }}>{c.direcionamento}</div>
              <div style={{
                fontSize: 11, color: 'var(--fg-2)',
                lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                filter: 'blur(2px)',
                opacity: 0.6,
              }}>
                {c.texto.split('\n').slice(0, 2).join(' ')}
              </div>
              <div style={{ marginTop: 6, fontSize: 9, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                encerre o culto para revelar
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BottomTransport() {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 14,
      height: 56, padding: '0 12px 0 20px',
      borderRadius: 9999,
      background: 'rgba(4,32,40,0.75)',
      border: '1px solid var(--border-default)',
      backdropFilter: 'blur(24px) saturate(1.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(176,240,240,0.06)',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Pulse size={7} color="#ff6b6b" />
        <Elapsed value="00:47:12" />
      </div>
      <div style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Ico.mic />
        <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>Mesa · canal 3</span>
      </div>
      <Waveform bars={20} color="var(--luxo-glow)" height={24} />
      <div style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
      <button style={{
        height: 40, padding: '0 18px', borderRadius: 9999,
        background: 'rgba(176,240,240,0.05)', border: '1px solid var(--border-default)',
        color: 'var(--fg-1)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <Ico.pause /> Pausar
      </button>
      <button style={{
        height: 40, padding: '0 20px', borderRadius: 9999,
        background: '#ff6b6b', color: 'var(--luxo-void)',
        border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        boxShadow: '0 0 24px rgba(255,107,107,0.35)',
      }}>
        <Ico.stop /> Encerrar e gerar legendas
      </button>
    </div>
  );
}

window.VariationB = VariationB;
