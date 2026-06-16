/**
 * RHEMA — Pitch Deck Generator
 * Paleta: Deep Indigo + Violet + Gold accent + Off-white
 */
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pres.title = "RHEMA — Pitch Deck";
pres.author = "RHEMA";
pres.company = "RHEMA";

// ───────── Palette ─────────
const C = {
  bgDark: "0F0B1F",      // deep indigo-black
  bgMid: "1A1530",       // card bg on dark
  bgLight: "F7F5F0",     // warm off-white
  primary: "6D5EF4",     // vibrant violet
  primaryDark: "4B3CC9",
  accent: "E9B949",      // warm gold
  textDark: "15122E",
  textMuted: "6B6885",
  textLight: "F7F5F0",
  textDim: "A8A4C4",
  success: "3FCF8E",
  divider: "2A2449",
};

const F = { header: "Calibri", body: "Calibri" };

// ───────── Helpers ─────────
function addFooter(slide, num) {
  slide.addText("RHEMA", {
    x: 0.4, y: 7.05, w: 2, h: 0.3,
    fontFace: F.header, fontSize: 10, bold: true,
    color: C.accent, charSpacing: 4,
  });
  slide.addText(`${num}`, {
    x: 12.5, y: 7.05, w: 0.5, h: 0.3,
    fontFace: F.body, fontSize: 10,
    color: C.textDim, align: "right",
  });
}

function darkBg(slide) {
  slide.background = { color: C.bgDark };
}
function lightBg(slide) {
  slide.background = { color: C.bgLight };
}

function addAccentDot(slide, x, y, size = 0.15, color = C.accent) {
  slide.addShape("ellipse", {
    x, y, w: size, h: size,
    fill: { color }, line: { color, width: 0 },
  });
}

function addSlideTag(slide, text, onDark = true) {
  slide.addText(text, {
    x: 0.6, y: 0.6, w: 3, h: 0.35,
    fontFace: F.header, fontSize: 11, bold: true,
    color: onDark ? C.accent : C.primary,
    charSpacing: 6,
  });
  slide.addShape("rect", {
    x: 0.6, y: 0.98, w: 0.4, h: 0.04,
    fill: { color: onDark ? C.accent : C.primary },
    line: { color: onDark ? C.accent : C.primary, width: 0 },
  });
}

// ═══════════════════════════════════════════════════════
// SLIDE 1 — Capa (Dark)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  // Decorative circles
  s.addShape("ellipse", {
    x: -2, y: -2, w: 5, h: 5,
    fill: { color: C.primary, transparency: 70 },
    line: { color: C.primary, width: 0 },
  });
  s.addShape("ellipse", {
    x: 10.5, y: 4.5, w: 4, h: 4,
    fill: { color: C.primaryDark, transparency: 60 },
    line: { color: C.primaryDark, width: 0 },
  });

  // Gold accent dot + tagline mark
  s.addShape("rect", {
    x: 0.8, y: 1.2, w: 0.08, h: 0.8,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  });
  s.addText("CONFIDENCIAL · PROPOSTA DE SOCIEDADE", {
    x: 1.05, y: 1.35, w: 8, h: 0.4,
    fontFace: F.header, fontSize: 11, bold: true,
    color: C.accent, charSpacing: 6,
  });

  // Logo / Name
  s.addText("RHEMA", {
    x: 0.8, y: 2.3, w: 12, h: 1.7,
    fontFace: F.header, fontSize: 128, bold: true,
    color: C.textLight, charSpacing: 12,
  });

  // Subtitle
  s.addText(
    "IA que transforma 40 minutos de pregação em\nlegendas prontas para Instagram — em 2 minutos.",
    {
      x: 0.8, y: 4.3, w: 11, h: 1.2,
      fontFace: F.body, fontSize: 24,
      color: C.textDim, italic: true,
    }
  );

  // Footer info
  s.addText("Abril 2026  •  Versão 1.0", {
    x: 0.8, y: 6.5, w: 6, h: 0.35,
    fontFace: F.body, fontSize: 12, color: C.textDim,
  });
  s.addText("gustaavosancho07@gmail.com", {
    x: 8, y: 6.5, w: 5, h: 0.35,
    fontFace: F.body, fontSize: 12, color: C.accent, align: "right",
  });
}

// ═══════════════════════════════════════════════════════
// SLIDE 2 — O Problema (Light)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  addSlideTag(s, "O PROBLEMA", false);

  s.addText("Toda igreja contemporânea\ngasta 3 dias para virar 1 pregação em conteúdo.", {
    x: 0.6, y: 1.3, w: 12, h: 1.6,
    fontFace: F.header, fontSize: 36, bold: true,
    color: C.textDark, lineSpacingMultiple: 1.1,
  });

  // 4 pain cards
  const pains = [
    { h: "3-4h", t: "transcrevendo\nmanualmente" },
    { h: "60-80%", t: "de alcance perdido\npela demora" },
    { h: "2-3 dias", t: "até a primeira\npostagem" },
    { h: "R$ 1,5-3k", t: "de trabalho/mês\nnão remunerado" },
  ];
  const cardW = 2.85, cardH = 2.3, startX = 0.6, startY = 3.4, gap = 0.15;
  pains.forEach((p, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape("roundRect", {
      x, y: startY, w: cardW, h: cardH,
      fill: { color: "FFFFFF" },
      line: { color: "E5E1F0", width: 1 },
      rectRadius: 0.1,
    });
    // Accent top bar
    s.addShape("rect", {
      x: x + 0.3, y: startY + 0.35, w: 0.35, h: 0.04,
      fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    });
    s.addText(p.h, {
      x: x + 0.25, y: startY + 0.5, w: cardW - 0.5, h: 0.95,
      fontFace: F.header, fontSize: 36, bold: true,
      color: C.primary,
    });
    s.addText(p.t, {
      x: x + 0.25, y: startY + 1.45, w: cardW - 0.5, h: 0.8,
      fontFace: F.body, fontSize: 13, color: C.textMuted,
      lineSpacingMultiple: 1.2,
    });
  });

  // Quote / conclusion
  s.addText("E o pior: quando publica, o culto já passou.", {
    x: 0.6, y: 6.15, w: 12, h: 0.5,
    fontFace: F.body, fontSize: 17, italic: true,
    color: C.textDark,
  });

  addFooter(s, "02");
}

// ═══════════════════════════════════════════════════════
// SLIDE 3 — A Solução (Dark)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  addSlideTag(s, "A SOLUÇÃO");

  s.addText("Sistema que roda durante o culto.", {
    x: 0.6, y: 1.3, w: 12, h: 0.8,
    fontFace: F.header, fontSize: 36, bold: true,
    color: C.textLight,
  });
  s.addText("Três coisas acontecem em paralelo, automaticamente.", {
    x: 0.6, y: 2.1, w: 12, h: 0.5,
    fontFace: F.body, fontSize: 18, color: C.textDim,
  });

  // 3 steps with numbered circles
  const steps = [
    { n: "1", h: "Transcreve", t: "A fala da pastora ao vivo, em pt-BR nativo." },
    { n: "2", h: "Curador IA", t: "Escreve 2 a 4 legendas no estilo CN/Bethel." },
    { n: "3", h: "Detector bíblico", t: "Identifica versículos e sugere exibição no Holyrics." },
  ];
  const boxW = 4.0, boxH = 3.5, gap2 = 0.25, startX2 = 0.6, startY2 = 3.1;
  steps.forEach((st, i) => {
    const x = startX2 + i * (boxW + gap2);
    s.addShape("roundRect", {
      x, y: startY2, w: boxW, h: boxH,
      fill: { color: C.bgMid },
      line: { color: C.divider, width: 1 },
      rectRadius: 0.12,
    });
    // Number circle
    s.addShape("ellipse", {
      x: x + 0.35, y: startY2 + 0.35, w: 0.8, h: 0.8,
      fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    });
    s.addText(st.n, {
      x: x + 0.35, y: startY2 + 0.35, w: 0.8, h: 0.8,
      fontFace: F.header, fontSize: 24, bold: true,
      color: C.textLight, align: "center", valign: "middle",
    });
    s.addText(st.h, {
      x: x + 0.35, y: startY2 + 1.35, w: boxW - 0.7, h: 0.55,
      fontFace: F.header, fontSize: 22, bold: true, color: C.textLight,
    });
    s.addText(st.t, {
      x: x + 0.35, y: startY2 + 2.0, w: boxW - 0.7, h: 1.2,
      fontFace: F.body, fontSize: 14, color: C.textDim,
      lineSpacingMultiple: 1.3,
    });
  });

  // Outcome
  s.addText("Legendas prontas 2 minutos depois do culto. O operador só revisa e publica.", {
    x: 0.6, y: 6.85, w: 12, h: 0.4,
    fontFace: F.body, fontSize: 14, italic: true, color: C.accent,
  });

  addFooter(s, "03");
}

// ═══════════════════════════════════════════════════════
// SLIDE 4 — Validação (Dark, high impact)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  addSlideTag(s, "VALIDAÇÃO");

  s.addText("Já funciona em culto real.", {
    x: 0.6, y: 1.3, w: 12, h: 0.8,
    fontFace: F.header, fontSize: 40, bold: true, color: C.textLight,
  });
  s.addText("22 de abril de 2026 — teste em culto ao vivo.", {
    x: 0.6, y: 2.1, w: 12, h: 0.5,
    fontFace: F.body, fontSize: 16, color: C.accent,
  });

  // Stats row
  const stats = [
    { v: "40 min", l: "transcrição contínua" },
    { v: "0", l: "falhas técnicas" },
    { v: "✓ 2 legendas", l: "aprovadas pela equipe" },
  ];
  const sW = 3.9, sH = 2.4, sStart = 0.6, sGap = 0.3, sY = 3.1;
  stats.forEach((st, i) => {
    const x = sStart + i * (sW + sGap);
    s.addShape("roundRect", {
      x, y: sY, w: sW, h: sH,
      fill: { color: C.bgMid },
      line: { color: C.primary, width: 2 },
      rectRadius: 0.12,
    });
    s.addText(st.v, {
      x: x + 0.25, y: sY + 0.35, w: sW - 0.5, h: 1.1,
      fontFace: F.header, fontSize: 48, bold: true,
      color: C.accent, align: "center",
    });
    s.addText(st.l, {
      x: x + 0.25, y: sY + 1.55, w: sW - 0.5, h: 0.7,
      fontFace: F.body, fontSize: 14, color: C.textDim, align: "center",
    });
  });

  // Quote
  s.addShape("rect", {
    x: 0.6, y: 6.0, w: 0.08, h: 0.9,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  });
  s.addText('"Muito boas."', {
    x: 0.85, y: 6.0, w: 8, h: 0.45,
    fontFace: F.header, fontSize: 18, bold: true, italic: true,
    color: C.textLight,
  });
  s.addText("— Equipe de mídia, culto 22/04", {
    x: 0.85, y: 6.45, w: 8, h: 0.35,
    fontFace: F.body, fontSize: 12, color: C.textDim,
  });

  addFooter(s, "04");
}

// ═══════════════════════════════════════════════════════
// SLIDE 5 — Mercado (Light)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  addSlideTag(s, "MERCADO", false);

  s.addText("15.000 igrejas.\nZero concorrentes diretos em português.", {
    x: 0.6, y: 1.3, w: 12, h: 1.5,
    fontFace: F.header, fontSize: 34, bold: true, color: C.textDark,
    lineSpacingMultiple: 1.15,
  });

  // Concentric circles (TAM/SAM/SOM visualization) — LEFT
  const cx = 3.0, cy = 4.9;
  s.addShape("ellipse", {
    x: cx - 2.2, y: cy - 2.2, w: 4.4, h: 4.4,
    fill: { color: C.primary, transparency: 85 },
    line: { color: C.primary, width: 1 },
  });
  s.addShape("ellipse", {
    x: cx - 1.5, y: cy - 1.5, w: 3.0, h: 3.0,
    fill: { color: C.primary, transparency: 70 },
    line: { color: C.primary, width: 1 },
  });
  s.addShape("ellipse", {
    x: cx - 0.7, y: cy - 0.7, w: 1.4, h: 1.4,
    fill: { color: C.accent },
    line: { color: C.accent, width: 0 },
  });
  s.addText("SOM\n150", {
    x: cx - 0.7, y: cy - 0.55, w: 1.4, h: 1.1,
    fontFace: F.header, fontSize: 13, bold: true,
    color: C.textDark, align: "center", valign: "middle",
  });

  // Right side: numbers
  const rX = 6.8;
  const marketItems = [
    { label: "TAM", value: "80.000", sub: "Igrejas evangélicas no Brasil (IBGE)" },
    { label: "SAM", value: "15.000", sub: "Com mídia + Holyrics + Instagram ativo" },
    { label: "SOM", value: "150", sub: "Meta realista em 3 anos (1% do SAM)" },
  ];
  marketItems.forEach((m, i) => {
    const y = 3.3 + i * 1.15;
    s.addText(m.label, {
      x: rX, y, w: 1.2, h: 0.35,
      fontFace: F.header, fontSize: 13, bold: true,
      color: C.primary, charSpacing: 4,
    });
    s.addText(m.value, {
      x: rX + 1.3, y: y - 0.1, w: 2.5, h: 0.6,
      fontFace: F.header, fontSize: 32, bold: true, color: C.textDark,
    });
    s.addText(m.sub, {
      x: rX, y: y + 0.45, w: 6, h: 0.4,
      fontFace: F.body, fontSize: 12, color: C.textMuted,
    });
  });

  s.addText(
    "Soluções americanas (Captions.ai, Opus Clip) não atendem tom religioso brasileiro e custam 3× mais.",
    {
      x: 0.6, y: 6.85, w: 12, h: 0.4,
      fontFace: F.body, fontSize: 13, italic: true, color: C.textMuted,
    }
  );

  addFooter(s, "05");
}

// ═══════════════════════════════════════════════════════
// SLIDE 6 — Modelo de Negócio (Dark)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  addSlideTag(s, "MODELO DE NEGÓCIO");

  s.addText("Dois planos. Alta margem.", {
    x: 0.6, y: 1.3, w: 12, h: 0.8,
    fontFace: F.header, fontSize: 36, bold: true, color: C.textLight,
  });

  // Plan cards
  const plans = [
    {
      name: "BASE", price: "R$ 127", per: "/mês",
      feats: ["8 cultos por mês", "2 variações de legenda", "Transcrição ao vivo", "Suporte padrão"],
      margin: "87,5%",
      highlight: false,
    },
    {
      name: "PRO", price: "R$ 297", per: "/mês",
      feats: ["20 cultos por mês", "4 variações de legenda", "Integração Holyrics", "Suporte prioritário"],
      margin: "89,3%",
      highlight: true,
    },
  ];

  plans.forEach((p, i) => {
    const x = 1.2 + i * 5.5;
    const y = 2.6;
    const w = 5.0, h = 4.1;
    s.addShape("roundRect", {
      x, y, w, h,
      fill: { color: p.highlight ? C.primary : C.bgMid },
      line: { color: p.highlight ? C.accent : C.divider, width: p.highlight ? 2 : 1 },
      rectRadius: 0.15,
    });

    if (p.highlight) {
      s.addShape("roundRect", {
        x: x + w - 1.6, y: y + 0.3, w: 1.3, h: 0.35,
        fill: { color: C.accent }, line: { color: C.accent, width: 0 },
        rectRadius: 0.1,
      });
      s.addText("POPULAR", {
        x: x + w - 1.6, y: y + 0.3, w: 1.3, h: 0.35,
        fontFace: F.header, fontSize: 10, bold: true,
        color: C.textDark, align: "center", valign: "middle", charSpacing: 3,
      });
    }

    s.addText(p.name, {
      x: x + 0.4, y: y + 0.35, w: 3, h: 0.45,
      fontFace: F.header, fontSize: 14, bold: true,
      color: p.highlight ? C.textLight : C.accent, charSpacing: 4,
    });
    s.addText(p.price, {
      x: x + 0.4, y: y + 0.85, w: w - 0.8, h: 0.9,
      fontFace: F.header, fontSize: 46, bold: true,
      color: p.highlight ? C.textLight : C.textLight,
    });
    s.addText(p.per, {
      x: x + 2.5, y: y + 1.3, w: 1.5, h: 0.4,
      fontFace: F.body, fontSize: 16, color: p.highlight ? C.textLight : C.textDim,
    });

    // Features
    p.feats.forEach((f, j) => {
      const fy = y + 1.95 + j * 0.38;
      s.addText("✓", {
        x: x + 0.4, y: fy, w: 0.3, h: 0.3,
        fontFace: F.body, fontSize: 14, bold: true,
        color: p.highlight ? C.accent : C.primary,
      });
      s.addText(f, {
        x: x + 0.75, y: fy, w: w - 1.1, h: 0.3,
        fontFace: F.body, fontSize: 13,
        color: p.highlight ? C.textLight : C.textDim,
      });
    });

    // Margin badge
    s.addText(`Margem ${p.margin}`, {
      x: x + 0.4, y: y + h - 0.55, w: w - 0.8, h: 0.35,
      fontFace: F.header, fontSize: 11, bold: true,
      color: p.highlight ? C.textLight : C.accent, charSpacing: 3,
    });
  });

  s.addText(
    "Ticket médio (mix 80/20): R$ 161/mês. Comparativo: Planning Center R$ 200-800 · Freelancer R$ 400-1.500.",
    {
      x: 0.6, y: 6.85, w: 12, h: 0.4,
      fontFace: F.body, fontSize: 12, italic: true, color: C.textDim,
    }
  );

  addFooter(s, "06");
}

// ═══════════════════════════════════════════════════════
// SLIDE 7 — Unit Economics (Light)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  addSlideTag(s, "UNIT ECONOMICS", false);

  s.addText("Números muito acima da média SaaS.", {
    x: 0.6, y: 1.3, w: 12, h: 0.8,
    fontFace: F.header, fontSize: 34, bold: true, color: C.textDark,
  });

  // 4 Big stats grid 2x2
  const bigStats = [
    { v: "5,0×", l: "LTV / CAC — Plano Base", sub: "Saudável: > 3×" },
    { v: "10,6×", l: "LTV / CAC — Plano Pro", sub: "Excelente" },
    { v: "4 meses", l: "Payback Base", sub: "Retorno rápido" },
    { v: "2,5 meses", l: "Payback Pro", sub: "Ótimo" },
  ];
  bigStats.forEach((bs, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.3;
    const y = 2.6 + row * 2.1;
    s.addShape("roundRect", {
      x, y, w: 5.9, h: 1.9,
      fill: { color: "FFFFFF" },
      line: { color: "E5E1F0", width: 1 },
      rectRadius: 0.12,
    });
    s.addShape("rect", {
      x, y, w: 0.12, h: 1.9,
      fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    });
    s.addText(bs.v, {
      x: x + 0.4, y: y + 0.25, w: 3, h: 1.0,
      fontFace: F.header, fontSize: 52, bold: true, color: C.primary,
    });
    s.addText(bs.l, {
      x: x + 3.4, y: y + 0.3, w: 2.4, h: 0.9,
      fontFace: F.header, fontSize: 14, bold: true, color: C.textDark,
    });
    s.addText(bs.sub, {
      x: x + 3.4, y: y + 1.2, w: 2.4, h: 0.5,
      fontFace: F.body, fontSize: 11, color: C.textMuted,
    });
  });

  s.addText(
    "Benchmark SaaS saudável: LTV/CAC > 3×. Nossos dois planos superam com folga.",
    {
      x: 0.6, y: 6.85, w: 12, h: 0.4,
      fontFace: F.body, fontSize: 13, italic: true, color: C.textMuted,
    }
  );

  addFooter(s, "07");
}

// ═══════════════════════════════════════════════════════
// SLIDE 8 — Projeção 3 anos (Dark) with bar chart
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  addSlideTag(s, "PROJEÇÃO 3 ANOS");

  s.addText("De zero a R$ 540k ARR em 36 meses.", {
    x: 0.6, y: 1.3, w: 12, h: 0.8,
    fontFace: F.header, fontSize: 34, bold: true, color: C.textLight,
  });

  // Bar chart manual (pptxgenjs chart)
  const chartData = [
    {
      name: "ARR (R$ mil)",
      labels: ["Ano 1", "Ano 2", "Ano 3"],
      values: [116, 289, 540],
    },
  ];
  s.addChart(pres.ChartType.bar, chartData, {
    x: 0.6, y: 2.4, w: 6.5, h: 4.3,
    barDir: "col",
    chartColors: [C.accent],
    plotArea: { fill: { color: C.bgDark } },
    catAxisLabelColor: C.textLight,
    catAxisLabelFontSize: 14,
    catAxisLabelFontFace: F.body,
    valAxisLabelColor: C.textDim,
    valAxisLabelFontSize: 11,
    valAxisLineColor: C.divider,
    catAxisLineColor: C.divider,
    valGridLine: { color: C.divider, style: "solid", size: 0.5 },
    showValue: true,
    dataLabelColor: C.textLight,
    dataLabelFontSize: 14,
    dataLabelFontBold: true,
    dataLabelFormatCode: 'R$ #"k"',
    showLegend: false,
    barGapWidthPct: 60,
  });

  // Right side — milestones
  const rX = 7.5;
  const milestones = [
    { y: "Ano 1", c: "60 clientes", l: "Break-even operacional no mês 4-5" },
    { y: "Ano 2", c: "150 clientes", l: "MRR R$ 24k · Lucro anual R$ 220k" },
    { y: "Ano 3", c: "280 clientes", l: "MRR R$ 45k · Lucro anual R$ 440k" },
  ];
  milestones.forEach((m, i) => {
    const y = 2.5 + i * 1.35;
    s.addShape("ellipse", {
      x: rX, y: y + 0.2, w: 0.25, h: 0.25,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText(m.y, {
      x: rX + 0.4, y, w: 5, h: 0.4,
      fontFace: F.header, fontSize: 14, bold: true, color: C.accent, charSpacing: 3,
    });
    s.addText(m.c, {
      x: rX + 0.4, y: y + 0.4, w: 5, h: 0.5,
      fontFace: F.header, fontSize: 22, bold: true, color: C.textLight,
    });
    s.addText(m.l, {
      x: rX + 0.4, y: y + 0.9, w: 5, h: 0.4,
      fontFace: F.body, fontSize: 12, color: C.textDim,
    });
  });

  // Optimistic callout
  s.addShape("roundRect", {
    x: 7.5, y: 6.3, w: 5.3, h: 0.6,
    fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    rectRadius: 0.08,
  });
  s.addText("Otimista (redes-âncora): R$ 1M-1,5M ARR no Ano 3", {
    x: 7.5, y: 6.3, w: 5.3, h: 0.6,
    fontFace: F.header, fontSize: 13, bold: true,
    color: C.textLight, align: "center", valign: "middle",
  });

  addFooter(s, "08");
}

// ═══════════════════════════════════════════════════════
// SLIDE 9 — Investimento & Roadmap (Light)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBg(s);
  addSlideTag(s, "INVESTIMENTO & ROADMAP", false);

  s.addText("R$ 8.500 para 12 meses. Payback em 1,5 mês.", {
    x: 0.6, y: 1.3, w: 12, h: 0.9,
    fontFace: F.header, fontSize: 30, bold: true, color: C.textDark,
  });

  // LEFT — Investment breakdown
  s.addText("Investimento (12 meses)", {
    x: 0.6, y: 2.5, w: 5.5, h: 0.4,
    fontFace: F.header, fontSize: 15, bold: true, color: C.primary, charSpacing: 3,
  });

  const invest = [
    { l: "APIs e infraestrutura", v: "R$ 3.240" },
    { l: "Marketing orgânico", v: "R$ 4.800" },
    { l: "Taxas de pagamento", v: "R$ 450" },
  ];
  invest.forEach((it, i) => {
    const y = 3.05 + i * 0.55;
    s.addShape("rect", {
      x: 0.6, y: y + 0.48, w: 5.5, h: 0.02,
      fill: { color: "E5E1F0" }, line: { color: "E5E1F0", width: 0 },
    });
    s.addText(it.l, {
      x: 0.6, y, w: 3.5, h: 0.4,
      fontFace: F.body, fontSize: 14, color: C.textDark,
    });
    s.addText(it.v, {
      x: 4.1, y, w: 2, h: 0.4,
      fontFace: F.header, fontSize: 14, bold: true,
      color: C.textDark, align: "right",
    });
  });
  // Total
  s.addShape("roundRect", {
    x: 0.6, y: 4.9, w: 5.5, h: 0.7,
    fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    rectRadius: 0.08,
  });
  s.addText("TOTAL", {
    x: 0.8, y: 4.9, w: 2, h: 0.7,
    fontFace: F.header, fontSize: 14, bold: true,
    color: C.textLight, valign: "middle", charSpacing: 3,
  });
  s.addText("R$ 8.490", {
    x: 3.1, y: 4.9, w: 2.8, h: 0.7,
    fontFace: F.header, fontSize: 20, bold: true,
    color: C.accent, align: "right", valign: "middle",
  });

  // RIGHT — Roadmap
  s.addText("Roadmap 12 meses", {
    x: 6.8, y: 2.5, w: 5.5, h: 0.4,
    fontFace: F.header, fontSize: 15, bold: true, color: C.primary, charSpacing: 3,
  });

  const roadmap = [
    { q: "Q1", t: "MVP ✓ · OBS · Holyrics · Landing", done: true },
    { q: "Q2", t: "Go-to-market · 10-15 pagantes" },
    { q: "Q3", t: "Reels/TikTok · 30-40 pagantes" },
    { q: "Q4", t: "Parceria Holyrics · 60+ pagantes" },
  ];
  roadmap.forEach((r, i) => {
    const y = 3.05 + i * 0.65;
    const dotColor = r.done ? C.success : C.primary;
    s.addShape("ellipse", {
      x: 6.8, y: y + 0.12, w: 0.3, h: 0.3,
      fill: { color: dotColor }, line: { color: dotColor, width: 0 },
    });
    if (r.done) {
      s.addText("✓", {
        x: 6.8, y: y + 0.08, w: 0.3, h: 0.3,
        fontFace: F.body, fontSize: 14, bold: true,
        color: C.textLight, align: "center", valign: "middle",
      });
    }
    s.addText(r.q, {
      x: 7.25, y, w: 0.7, h: 0.5,
      fontFace: F.header, fontSize: 16, bold: true, color: C.textDark,
    });
    s.addText(r.t, {
      x: 8.0, y: y + 0.05, w: 4.8, h: 0.45,
      fontFace: F.body, fontSize: 13, color: C.textMuted,
    });
  });

  addFooter(s, "09");
}

// ═══════════════════════════════════════════════════════
// SLIDE 10 — Proposta de Sociedade (Dark, climax)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  // Big background gradient circle
  s.addShape("ellipse", {
    x: 9, y: -2, w: 7, h: 7,
    fill: { color: C.primary, transparency: 70 },
    line: { color: C.primary, width: 0 },
  });

  addSlideTag(s, "A PROPOSTA");

  s.addText("O que procuramos.", {
    x: 0.6, y: 1.3, w: 12, h: 0.8,
    fontFace: F.header, fontSize: 40, bold: true, color: C.textLight,
  });

  // LEFT — what partner brings
  s.addText("Sócio que complemente o perfil técnico:", {
    x: 0.6, y: 2.5, w: 7, h: 0.5,
    fontFace: F.body, fontSize: 16, color: C.textDim,
  });

  const needs = [
    { i: "💼", t: "Força comercial / vendas B2B com igrejas" },
    { i: "🤝", t: "Rede em comunidades cristãs" },
    { i: "💰", t: "Capital inicial — R$ 8.500 bootstrap" },
    { i: "⏱️", t: "Dedicação de meio período no Ano 1" },
  ];
  needs.forEach((n, i) => {
    const y = 3.15 + i * 0.65;
    s.addShape("roundRect", {
      x: 0.6, y, w: 0.55, h: 0.55,
      fill: { color: C.bgMid }, line: { color: C.divider, width: 1 },
      rectRadius: 0.1,
    });
    s.addText(n.i, {
      x: 0.6, y, w: 0.55, h: 0.55,
      fontFace: F.body, fontSize: 20, align: "center", valign: "middle",
    });
    s.addText(n.t, {
      x: 1.35, y: y + 0.08, w: 5.7, h: 0.45,
      fontFace: F.body, fontSize: 15, color: C.textLight,
    });
  });

  // RIGHT — returns card
  s.addShape("roundRect", {
    x: 7.8, y: 2.5, w: 5.0, h: 4.2,
    fill: { color: C.bgMid }, line: { color: C.accent, width: 2 },
    rectRadius: 0.15,
  });
  s.addText("RETORNO AO SÓCIO (50/50)", {
    x: 8.05, y: 2.75, w: 4.5, h: 0.35,
    fontFace: F.header, fontSize: 11, bold: true, color: C.accent, charSpacing: 4,
  });
  s.addText("Cenário realista", {
    x: 8.05, y: 3.25, w: 4.5, h: 0.4,
    fontFace: F.body, fontSize: 13, color: C.textDim,
  });
  s.addText("Ano 2", {
    x: 8.05, y: 3.7, w: 2, h: 0.4,
    fontFace: F.body, fontSize: 14, color: C.textDim,
  });
  s.addText("R$ 145k", {
    x: 9.8, y: 3.65, w: 2.8, h: 0.5,
    fontFace: F.header, fontSize: 24, bold: true, color: C.textLight, align: "right",
  });
  s.addText("Ano 3", {
    x: 8.05, y: 4.25, w: 2, h: 0.4,
    fontFace: F.body, fontSize: 14, color: C.textDim,
  });
  s.addText("R$ 270k", {
    x: 9.8, y: 4.2, w: 2.8, h: 0.5,
    fontFace: F.header, fontSize: 24, bold: true, color: C.textLight, align: "right",
  });
  // Divider
  s.addShape("rect", {
    x: 8.05, y: 4.9, w: 4.5, h: 0.02,
    fill: { color: C.divider }, line: { color: C.divider, width: 0 },
  });
  s.addText("Cenário otimista", {
    x: 8.05, y: 5.05, w: 4.5, h: 0.4,
    fontFace: F.body, fontSize: 13, color: C.textDim,
  });
  s.addText("Ano 3", {
    x: 8.05, y: 5.6, w: 2, h: 0.4,
    fontFace: F.body, fontSize: 14, color: C.textDim,
  });
  s.addText("R$ 700k", {
    x: 9.8, y: 5.55, w: 2.8, h: 0.55,
    fontFace: F.header, fontSize: 26, bold: true, color: C.accent, align: "right",
  });
  s.addText("Vesting 4 anos · cliff 1 ano", {
    x: 8.05, y: 6.2, w: 4.5, h: 0.35,
    fontFace: F.body, fontSize: 11, italic: true, color: C.textDim, align: "center",
  });

  addFooter(s, "10");
}

// ═══════════════════════════════════════════════════════
// SLIDE 11 — Próximo passo (Bônus, climax CTA)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  // Decorative
  s.addShape("ellipse", {
    x: -3, y: 4, w: 8, h: 8,
    fill: { color: C.primary, transparency: 80 },
    line: { color: C.primary, width: 0 },
  });

  s.addText("PRÓXIMO PASSO", {
    x: 0.6, y: 1.5, w: 12, h: 0.4,
    fontFace: F.header, fontSize: 12, bold: true, color: C.accent, charSpacing: 6,
  });

  s.addText("Demo ao vivo.", {
    x: 0.6, y: 2.0, w: 12, h: 1.2,
    fontFace: F.header, fontSize: 72, bold: true, color: C.textLight,
  });

  s.addText("15 minutos. Você vê o sistema funcionando em tempo real.", {
    x: 0.6, y: 3.4, w: 12, h: 0.6,
    fontFace: F.body, fontSize: 22, color: C.textDim, italic: true,
  });

  // Contact card
  s.addShape("roundRect", {
    x: 0.6, y: 4.8, w: 12, h: 1.8,
    fill: { color: C.bgMid }, line: { color: C.accent, width: 2 },
    rectRadius: 0.15,
  });
  s.addText("VAMOS AGENDAR?", {
    x: 0.9, y: 5.05, w: 11, h: 0.4,
    fontFace: F.header, fontSize: 13, bold: true, color: C.accent, charSpacing: 5,
  });
  s.addText("gustaavosancho07@gmail.com", {
    x: 0.9, y: 5.5, w: 11, h: 0.55,
    fontFace: F.header, fontSize: 26, bold: true, color: C.textLight,
  });
  s.addText("Resposta em 24h · Demo agendada em até 3 dias", {
    x: 0.9, y: 6.05, w: 11, h: 0.4,
    fontFace: F.body, fontSize: 12, color: C.textDim,
  });

  addFooter(s, "11");
}

// ───────── Save ─────────
pres.writeFile({ fileName: "rhema-pitch-deck.pptx" }).then((f) => {
  console.log("✓ Deck salvo:", f);
});
