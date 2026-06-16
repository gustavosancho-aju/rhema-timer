// variation-a-command-center.jsx — The full dashboard. All three panels visible.

function VariationA({ fontScale = 1, showIndicators = true }) {
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

      {/* TOP BAR */}
      <TopBar />

      {/* MAIN GRID */}
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '260px 1fr 420px',
        gap: 20,
        padding: '20px 28px 28px',
        height: 'calc(100% - 72px)',
      }}>
        {/* LEFT — sessions / history */}
        <LeftRail />

        {/* CENTER — live transcription */}
        <CenterTranscript fontScale={fontScale} showIndicators={showIndicators} />

        {/* RIGHT — agent curator */}
        <RightAgent />
      </div>
    </div>
  );
}

// ----- TOP BAR -----

function TopBar() {
  return (
    <div style={{
      height: 72, padding: '0 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'relative', zIndex: 2,
      background: 'rgba(0,16,16,0.6)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Logo />
        <div style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
        <nav style={{ display: 'flex', gap: 4 }}>
          {[
            { label: 'Ao vivo', active: true },
            { label: 'Histórico' },
            { label: 'Referências' },
            { label: 'Ajustes' },
          ].map(item => (
            <button key={item.label} style={{
              height: 34, padding: '0 14px',
              borderRadius: 9999,
              background: item.active ? 'rgba(176,240,240,0.08)' : 'transparent',
              color: item.active ? 'var(--luxo-glow)' : 'var(--fg-2)',
              border: item.active ? '1px solid rgba(176,240,240,0.22)' : '1px solid transparent',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              {item.active && <Pulse size={5} />}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          height: 34, padding: '0 14px',
          borderRadius: 9999,
          background: 'rgba(176,240,240,0.04)',
          border: '1px solid var(--border-subtle)',
        }}>
          <Ico.mic />
          <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>Mesa de som · canal 3</span>
          <Dot size={3} color="var(--fg-4)" />
          <span style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>48 kHz</span>
        </div>
        <IconBtn title="Ajustes"><Ico.settings /></IconBtn>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--luxo-teal-mid), var(--luxo-petroleo))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'var(--luxo-void)',
        }}>GV</div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.1))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 18px rgba(176,240,240,0.35)',
        color: 'var(--luxo-void)', fontWeight: 800, fontSize: 15,
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
      }}>R</div>
      <div style={{ lineHeight: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>Rhema <span style={{ color: 'var(--luxo-gold)', fontFamily: 'var(--font-serif)', fontWeight: 400, fontStyle: 'italic' }}>AI</span></span>
        <span style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Palavra ao vivo</span>
      </div>
    </div>
  );
}

// ----- LEFT RAIL -----

function LeftRail() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
      <Card noPad>
        <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow>Sessão atual</Eyebrow>
          <Badge variant="live">ao vivo</Badge>
        </div>
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>
            Culto de quarta
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
            <Serif style={{ color: 'var(--luxo-gold)' }}>"O Secreto"</Serif> · Pastora Ana
          </div>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <Stat label="Duração" value="47:12" mono />
          <Stat label="Palavras" value="3 812" mono borderLeft />
        </div>
      </Card>

      <Card noPad style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow>Histórico</Eyebrow>
          <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>últimos 14 dias</span>
        </div>
        <div className="thin-scroll" style={{ overflowY: 'auto', flex: 1 }}>
          {SAMPLE_HISTORY.map((h, i) => (
            <HistoryRow key={i} {...h} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function HistoryRow({ date, title, duration, words, status }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: hover ? 'rgba(176,240,240,0.03)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 240ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontFamily: 'var(--font-mono)',
          color: 'var(--fg-3)', letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>{date}</span>
        <Dot size={3} color="var(--fg-4)" />
        <span style={{
          fontSize: 10, fontWeight: 600,
          color: status === 'posted' ? 'var(--luxo-glow)' : 'var(--luxo-gold)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{status === 'posted' ? 'publicado' : 'rascunho'}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--fg-1)', marginBottom: 4, letterSpacing: '-0.005em' }}>
        {title}
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', display: 'flex', gap: 10, fontFamily: 'var(--font-mono)' }}>
        <span>{duration}</span>
        <span>{words.toLocaleString('pt-BR').replace(',', ' ')} palavras</span>
      </div>
    </div>
  );
}

function Stat({ label, value, mono, borderLeft }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderLeft: borderLeft ? '1px solid var(--border-subtle)' : 'none',
    }}>
      <div style={{
        fontSize: 10, color: 'var(--fg-3)',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontSize: 18, fontWeight: 600,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        color: 'var(--fg-1)',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
    </div>
  );
}

// ----- CENTER PANEL -----

function CenterTranscript({ fontScale, showIndicators }) {
  const scale = fontScale || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
      {/* transport bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        borderRadius: 16,
        background: 'rgba(4,32,40,0.5)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#ff6b6b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Ico.stop />
          </button>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>Gravando</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Pulse size={7} color="#ff6b6b" />
              <Elapsed value="00:47:12" />
              <Dot size={3} color="var(--fg-4)" />
              <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>início 19:00 · estimado até 20:30</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Áudio</span>
            <Waveform bars={28} color="var(--luxo-glow)" height={28} />
          </div>
          <div style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
          <MetaStat label="Latência" value="1.2s" tone="ok" />
          <MetaStat label="Confiança" value="94%" tone="ok" />
          <MetaStat label="pt-BR" value="Google STT" tone="muted" />
        </div>
      </div>

      {/* transcript surface */}
      <div style={{
        flex: 1, minHeight: 0,
        position: 'relative',
        borderRadius: 24,
        background:
          'radial-gradient(800px 400px at 50% 0%, rgba(45,27,105,0.22), transparent 60%), rgba(4,32,40,0.55)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'inset 0 1px 0 rgba(176,240,240,0.05), 0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 28px 12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Eyebrow>Transcrição ao vivo</Eyebrow>
            <Badge variant="gold"><Serif>pt-BR</Serif></Badge>
          </div>
          {showIndicators && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--fg-3)' }}>
              <span>autoscroll</span>
              <div style={{
                width: 28, height: 16, borderRadius: 9999,
                background: 'rgba(176,240,240,0.25)',
                border: '1px solid rgba(176,240,240,0.35)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 1, right: 1,
                  width: 12, height: 12, borderRadius: '50%',
                  background: 'var(--luxo-glow)',
                  boxShadow: '0 0 6px var(--luxo-glow)',
                }} />
              </div>
            </div>
          )}
        </div>

        {/* transcript body */}
        <div className="thin-scroll" style={{
          flex: 1, overflowY: 'auto',
          padding: '28px 36px 0',
        }}>
          {SAMPLE_TRANSCRIPT.map((line, i) => (
            <TranscriptLine key={i} line={line} dim={i < 2} scale={scale} />
          ))}
          <LiveLine scale={scale} />
        </div>

        {/* bottom — word chips / live now */}
        <div style={{
          padding: '14px 28px 18px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0,16,16,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 10, color: 'var(--fg-3)',
              letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>Agora · palavras-chave detectadas</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['secreto', 'intimidade', 'recompensa', 'fé', 'promessa'].map((w, i) => (
              <span key={w} style={{
                padding: '4px 10px',
                borderRadius: 9999,
                background: i === 0 ? 'rgba(176,240,240,0.08)' : 'rgba(176,240,240,0.05)',
                border: i === 0 ? '1px solid rgba(176,240,240,0.3)' : '1px solid var(--border-subtle)',
                fontSize: 11,
                color: i === 0 ? 'var(--luxo-glow)' : 'var(--fg-2)',
                fontFamily: 'var(--font-mono)',
              }}>{w}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptLine({ line, dim, scale }) {
  return (
    <div style={{
      display: 'flex', gap: 20,
      marginBottom: 20,
      opacity: dim ? 0.35 : 1,
      transition: 'opacity 400ms',
    }}>
      <span style={{
        flexShrink: 0, width: 64,
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--fg-3)', letterSpacing: '0.05em',
        paddingTop: 8,
      }}>{line.t}</span>
      <div style={{
        fontSize: 20 * scale, lineHeight: 1.5,
        color: 'var(--fg-1)',
        letterSpacing: '-0.005em',
        maxWidth: 680,
      }}>{line.text}</div>
    </div>
  );
}

function LiveLine({ scale }) {
  return (
    <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
      <span style={{
        flexShrink: 0, width: 64, paddingTop: 8,
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <Pulse size={6} />
        <span style={{ fontSize: 10, color: 'var(--luxo-glow)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>agora</span>
      </span>
      <div style={{
        fontSize: 22 * scale, lineHeight: 1.5,
        color: 'var(--fg-1)',
        letterSpacing: '-0.005em',
        maxWidth: 680,
        fontWeight: 500,
      }}>
        {LIVE_PARAGRAPH}
        {LIVE_STREAMING_WORDS.map((w, i) => (
          <span key={i} style={{
            display: 'inline-block',
            marginLeft: 6,
            animation: `rh-word-in 600ms ${i * 300}ms var(--ease-out-expo) both`,
            background: 'linear-gradient(90deg, var(--luxo-glow), var(--fg-1) 80%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent',
          }}>{w}</span>
        ))}
        <span style={{
          display: 'inline-block', marginLeft: 4,
          width: 2, height: `${20 * scale}px`,
          verticalAlign: 'middle',
          background: 'var(--luxo-glow)',
          boxShadow: '0 0 8px var(--luxo-glow)',
          animation: 'rh-caret 1s infinite',
        }} />
      </div>
    </div>
  );
}

function MetaStat({ label, value, tone }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
      <span style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{
        fontSize: 12, fontFamily: 'var(--font-mono)',
        color: tone === 'ok' ? 'var(--luxo-glow)' : tone === 'muted' ? 'var(--fg-2)' : 'var(--fg-1)',
      }}>{value}</span>
    </div>
  );
}

// ----- RIGHT PANEL (AGENT) -----

function RightAgent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
      {/* Agent header */}
      <div style={{
        padding: '16px 18px',
        borderRadius: 16,
        background:
          'radial-gradient(240px 120px at 100% 0%, rgba(176,240,240,0.12), transparent 70%), rgba(4,32,40,0.6)',
        border: '1px solid var(--border-default)',
        boxShadow: 'inset 0 1px 0 rgba(176,240,240,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.2))',
            boxShadow: '0 0 18px rgba(176,240,240,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: 'var(--luxo-void)', fontSize: 15,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          }}>L</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              Agente Curador
              <Badge variant="live">pensando</Badge>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>
              Claude Sonnet 4.6 · treinado em @cnaracaju, @cnfortaleza, Bethel
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {AGENT_STEPS.map((s, i) => (
            <AgentStep key={i} {...s} />
          ))}
        </div>
      </div>

      {/* Caption options */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column', gap: 12,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          <Eyebrow>Legendas · 2 direcionamentos</Eyebrow>
          <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>geradas 19:47</span>
        </div>
        <div className="thin-scroll" style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 12,
          paddingRight: 2,
        }}>
          {SAMPLE_CAPTIONS.map((c, i) => (
            <CaptionCard key={i} caption={c} index={i} />
          ))}

          <button style={{
            height: 40,
            borderRadius: 12,
            background: 'transparent',
            border: '1px dashed var(--border-default)',
            color: 'var(--fg-3)',
            fontSize: 12, fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Ico.sparkle /> Gerar outra rodada
          </button>
        </div>
      </div>
    </div>
  );
}

function AgentStep({ label, status, detail }) {
  const isDone = status === 'done';
  const isActive = status === 'active';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%', marginTop: 2, flexShrink: 0,
        background: isDone ? 'rgba(176,240,240,0.1)' : isActive ? 'transparent' : 'transparent',
        border: isDone ? '1px solid rgba(176,240,240,0.4)' : isActive ? '1px solid var(--luxo-glow)' : '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--luxo-glow)',
        animation: isActive ? 'rh-breathe 2s infinite' : 'none',
        boxShadow: isActive ? '0 0 8px rgba(176,240,240,0.5)' : 'none',
      }}>
        {isDone && <Ico.check />}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 13, color: isActive ? 'var(--fg-1)' : 'var(--fg-2)',
          fontWeight: isActive ? 500 : 400,
        }}>
          {label}
          {isActive && <TypingDots />}
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{detail}</div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, marginLeft: 8, verticalAlign: 'middle' }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 3, height: 3, borderRadius: '50%',
          background: 'var(--luxo-glow)', boxShadow: '0 0 4px var(--luxo-glow)',
          animation: `rh-typing 1.2s ${i * 0.15}s infinite`,
        }} />
      ))}
    </span>
  );
}

function CaptionCard({ caption, index }) {
  const [hover, setHover] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const Icon = caption.icon === 'heart' ? Ico.heart : Ico.brain;

  function copy() {
    try { navigator.clipboard?.writeText(caption.texto); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 16,
        borderRadius: 16,
        background: 'rgba(4,32,40,0.65)',
        border: hover ? '1px solid rgba(255,255,255,0.18)' : '1px solid var(--border-subtle)',
        boxShadow: hover ? '0 12px 32px rgba(0,0,0,0.4)' : 'inset 0 1px 0 rgba(176,240,240,0.05)',
        transform: hover ? 'translateY(-1px)' : 'none',
        transition: 'all 240ms var(--ease-out-expo)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* direction bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, ${caption.color}, transparent 70%)`,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, borderRadius: 6,
            background: `${caption.color}22`,
            color: caption.color,
          }}>
            <Icon />
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: caption.color, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            {caption.direcionamento}
          </span>
          <Badge variant="neutral" style={{ height: 20, fontSize: 10 }}>opção {index + 1}</Badge>
        </div>
        <button onClick={copy} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 28, padding: '0 10px', borderRadius: 9999,
          background: copied ? 'rgba(176,240,240,0.15)' : 'transparent',
          border: copied ? '1px solid rgba(176,240,240,0.35)' : '1px solid var(--border-subtle)',
          color: copied ? 'var(--luxo-glow)' : 'var(--fg-2)',
          fontSize: 11, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          transition: 'all 240ms',
        }}>
          {copied ? <><Ico.check /> copiado</> : <><Ico.copy /> copiar</>}
        </button>
      </div>

      <div style={{
        fontSize: 13, lineHeight: 1.6,
        color: 'var(--fg-1)',
        whiteSpace: 'pre-wrap',
        marginBottom: 12,
        letterSpacing: '-0.005em',
      }}>{caption.texto}</div>

      <div style={{
        display: 'flex', gap: 10, paddingTop: 10,
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 10, color: 'var(--fg-3)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
      }}>
        <span>{caption.stats.chars} car.</span>
        <Dot size={3} color="var(--fg-4)" />
        <span>{caption.stats.words} palavras</span>
        <Dot size={3} color="var(--fg-4)" />
        <span>hashtags: {caption.stats.hashtags}</span>
      </div>
    </div>
  );
}

function Card({ children, noPad, style }) {
  return (
    <div style={{
      borderRadius: 16,
      background: 'rgba(4,32,40,0.55)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'inset 0 1px 0 rgba(176,240,240,0.05)',
      padding: noPad ? 0 : 16,
      ...style,
    }}>{children}</div>
  );
}

window.VariationA = VariationA;
